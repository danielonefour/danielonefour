import { NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// Helper to get Contentful Management Client
function getContentfulClient() {
  const accessToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  if (!accessToken) {
    console.error('CONTENTFUL_MANAGEMENT_TOKEN is missing');
    return null;
  }
  return createClient({ accessToken });
}

// Helper to get Nodemailer transporter
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.EMAIL_PORT || '2525'),
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  });
}

// Helper to get Stripe client
function getStripe() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return null;
  return new Stripe(stripeKey, {
    apiVersion: '2025-03-31.basil' as any
  });
}


export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event;

  // Verify the webhook signature
  try {
    const stripe = getStripe();
    if (!stripe) throw new Error('Stripe client not initialized');

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: any) {
  try {
    // Get metadata from the session
    const { registrationId, eventId, customerEmail, customerName } = session.metadata;

    if (!registrationId) {
      console.error('Registration ID not found in session metadata');
      return;
    }

    // Update the registration entry in Contentful
    const client = getContentfulClient();
    if (!client) throw new Error('Contentful client not initialized');

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    // Get the registration entry
    const entry = await environment.getEntry(registrationId);
    
    // Update the payment status
    entry.fields.paymentStatus = { 'en-US': 'paid' };
    entry.fields.paymentReference = { 'en-US': session.payment_intent || session.id };
    entry.fields.paymentDate = { 'en-US': new Date().toISOString() };
    
    // Save and publish the updated entry
    await entry.update();
    await entry.publish();

    // Get event details
    let eventTitle = 'your event';
    if (eventId) {
      try {
        const eventEntry = await environment.getEntry(eventId);
        if (eventEntry.fields.title) {
          eventTitle = eventEntry.fields.title['en-US'];
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    }

    // Send payment confirmation email to customer
    if (customerEmail) {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"Daniel One Four" <${process.env.EMAIL_FROM || 'noreply@daniel-one-four.com'}>`,
        to: customerEmail,
        subject: `Payment Confirmation - ${eventTitle}`,
        html: `
          <h2>Payment Confirmation</h2>
          <p>Dear ${customerName || 'Participant'},</p>
          <p>We're pleased to confirm that your payment for <strong>${eventTitle}</strong> has been successfully processed.</p>
          <p>Payment Reference: ${session.payment_intent || session.id}</p>
          <p>Amount: ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: session.currency.toUpperCase(),
          }).format(session.amount_total / 100)}</p>
          <p>We're looking forward to seeing you at the event. If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,</p>
          <p>The Daniel One Four Team</p>
        `,
      });
    }

    // Send notification to admin
    const adminTransporter = getTransporter();
    await adminTransporter.sendMail({
      from: `"Daniel One Four" <${process.env.EMAIL_FROM || 'noreply@daniel-one-four.com'}>`,
      to: process.env.ADMIN_EMAIL || 'admin@daniel-one-four.com',
      subject: `Payment Received - ${eventTitle}`,
      html: `
        <h2>Payment Received</h2>
        <p><strong>Event:</strong> ${eventTitle}</p>
        <p><strong>Customer:</strong> ${customerName || 'Unknown'}</p>
        <p><strong>Email:</strong> ${customerEmail || 'Unknown'}</p>
        <p><strong>Payment Reference:</strong> ${session.payment_intent || session.id}</p>
        <p><strong>Amount:</strong> ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: session.currency.toUpperCase(),
        }).format(session.amount_total / 100)}</p>
        <p><strong>Payment Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  // This is a fallback in case checkout.session.completed doesn't handle everything
  // Most of the logic is already handled in the checkout.session.completed handler
  console.log('Payment intent succeeded:', paymentIntent.id);
} 