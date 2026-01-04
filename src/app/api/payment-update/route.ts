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
  try {
    const body = await request.json();
    const { registrationId, paymentIntentId, status } = body;
    
    if (!registrationId || !paymentIntentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get Contentful space and environment
    const client = getContentfulClient();
    if (!client) throw new Error('Contentful client not initialized');

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    // Get the entry
    let entry = await environment.getEntry(registrationId);
    
    // Update payment status and payment reference
    entry.fields.paymentStatus = { 'en-US': status };
    entry.fields.paymentReference = { 'en-US': paymentIntentId };
    
    // Update the entry with proper error handling
    try {
      // First update
      try {
        entry = await entry.update();
      } catch (error: any) {
        if (error.status === 409) {
          console.log('Version conflict during update, retrying with fresh entry');
          entry = await environment.getEntry(registrationId);
          entry.fields.paymentStatus = { 'en-US': status };
          entry.fields.paymentReference = { 'en-US': paymentIntentId };
          entry = await entry.update();
        } else {
          throw error;
        }
      }
      
      // Then publish
      try {
        await entry.publish();
      } catch (error: any) {
        if (error.status === 409) {
          console.log('Version conflict during publish, retrying with fresh entry');
          const freshEntry = await environment.getEntry(registrationId);
          await freshEntry.publish();
        } else {
          throw error;
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating Contentful entry:', error);
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment update' },
      { status: 500 }
    );
  }
}

async function sendPaymentConfirmationEmails(
  customerEmail: string,
  customerName: string,
  eventTitle: string,
  paymentIntent: any
) {
  const amount = paymentIntent.amount / 100; // Convert from cents
  const currency = paymentIntent.currency.toUpperCase();
  
  // Send payment confirmation email to customer
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Daniel One Four" <${process.env.EMAIL_FROM || 'noreply@daniel-one-four.com'}>`,
    to: customerEmail,
    subject: `Payment Confirmation - ${eventTitle}`,
    html: `
      <h2>Payment Confirmation</h2>
      <p>Dear ${customerName || 'Participant'},</p>
      <p>We're pleased to confirm that your payment for <strong>${eventTitle}</strong> has been successfully processed.</p>
      <p>Payment Reference: ${paymentIntent.id}</p>
      <p>Amount: ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(amount)}</p>
      <p>We're looking forward to seeing you at the event. If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,</p>
      <p>The Daniel One Four Team</p>
    `,
  });

  // Send notification to admin
  await transporter.sendMail({
    from: `"Daniel One Four" <${process.env.EMAIL_FROM || 'noreply@daniel-one-four.com'}>`,
    to: process.env.ADMIN_EMAIL || 'admin@daniel-one-four.com',
    subject: `Payment Received - ${eventTitle}`,
    html: `
      <h2>Payment Received</h2>
      <p><strong>Event:</strong> ${eventTitle}</p>
      <p><strong>Customer:</strong> ${customerName || 'Unknown'}</p>
      <p><strong>Email:</strong> ${customerEmail || 'Unknown'}</p>
      <p><strong>Payment Reference:</strong> ${paymentIntent.id}</p>
      <p><strong>Amount:</strong> ${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(amount)}</p>
      <p><strong>Payment Date:</strong> ${new Date().toLocaleString()}</p>
    `,
  });
} 