import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from 'contentful-management';
import Stripe from 'stripe';

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
    const { 
      name, 
      email, 
      phone, 
      organization, 
      message, 
      eventId, 
      eventTitle,
      amount,
      currency 
    } = body;
    
    // Validate required fields
    if (!name || !email || !eventId || !eventTitle) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }
    
    // Create timestamp
    const submissionDate = new Date().toISOString();
    
    // Save to Contentful
    const client = getContentfulClient();
    if (!client) throw new Error('Contentful client not initialized');

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    // Create entry in Contentful
    const entry = await environment.createEntry('eventRegistration', {
      fields: {
        name: { 'en-US': name },
        email: { 'en-US': email },
        phone: { 'en-US': phone || '' },
        organization: { 'en-US': organization || '' },
        message: { 'en-US': message || '' },
        eventId: { 'en-US': eventId },
        eventTitle: { 'en-US': eventTitle },
        submissionDate: { 'en-US': submissionDate },
        amount: { 'en-US': amount || 0 },
        currency: { 'en-US': currency || 'USD' },
        paymentStatus: { 'en-US': amount ? 'pending' : 'not_applicable' },
        status: { 'en-US': 'New' }
      }
    });
    
    // Publish the entry
    await entry.publish();

    let clientSecret = null;
    let paymentIntentId = null;
    
    // Create Stripe payment intent if it's a paid event
    if (amount && amount > 0) {
      const stripe = getStripe();
      if (!stripe) throw new Error('Stripe client not initialized');

      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'USD',
        metadata: {
          eventId,
          eventTitle,
          customerName: name,
          customerEmail: email
        },
        receipt_email: email,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      clientSecret = paymentIntent.client_secret;
      paymentIntentId = paymentIntent.id;
      
      // Add the payment reference with proper error handling
      try {
        // Try to update and publish the entry
        let updatedEntry = await environment.getEntry(entry.sys.id);
        updatedEntry.fields.paymentReference = { 'en-US': paymentIntentId };
        
        // First update
        try {
          updatedEntry = await updatedEntry.update();
        } catch (error: any) {
          if (error.status === 409) {
            console.log('Version conflict during update, retrying with fresh entry');
            updatedEntry = await environment.getEntry(entry.sys.id);
            updatedEntry.fields.paymentReference = { 'en-US': paymentIntentId };
            updatedEntry = await updatedEntry.update();
          } else {
            throw error;
          }
        }
        
        // Then publish (separate try/catch)
        try {
          await updatedEntry.publish();
        } catch (error: any) {
          if (error.status === 409) {
            console.log('Version conflict during publish, retrying with fresh entry');
            // Get the latest version and try again
            const freshEntry = await environment.getEntry(entry.sys.id);
            await freshEntry.publish();
          } else {
            throw error;
          }
        }
      } catch (contentfulError) {
        console.error('Error updating Contentful entry:', contentfulError);
        // Continue even if the update fails - we still want to return the clientSecret
        // The payment can still be processed
      }
    }
    
    // Send email to admin
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Daniel One Four" <${process.env.EMAIL_FROM || 'noreply@daniel-one-four.com'}>`,
      to: process.env.ADMIN_EMAIL || 'admin@daniel-one-four.com',
      subject: `New Event Registration: ${eventTitle}`,
      html: `
        <h2>New Event Registration</h2>
        <p><strong>Event:</strong> ${eventTitle}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message || 'Not provided'}</p>
        <p><strong>Submission Date:</strong> ${new Date(submissionDate).toLocaleString()}</p>
        ${amount && amount > 0 ? `<p><strong>Price:</strong> ${currency || ''} ${amount}</p>
        <p><strong>Payment Status:</strong> Pending</p>` : '<p><strong>Price:</strong> FREE</p>'}
      `,
    });
    
    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Daniel One Four" <${process.env.EMAIL_FROM || 'noreply@daniel-one-four.com'}>`,
      to: email,
      subject: `Your Registration for ${eventTitle}`,
      html: `
        <h2>Thank You for Registering!</h2>
        <p>Dear ${name},</p>
        <p>We're excited to confirm your registration for <strong>${eventTitle}</strong>.</p>
        <p>Here's a summary of your registration:</p>
        <ul>
          <li><strong>Event:</strong> ${eventTitle}</li>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
          ${organization ? `<li><strong>Organization:</strong> ${organization}</li>` : ''}
          ${message ? `<li><strong>Your message:</strong> ${message}</li>` : ''}
          ${amount && amount > 0 ? `<li><strong>Price:</strong> ${currency || ''} ${amount}</li>` : '<li><strong>Price:</strong> FREE</li>'}
        </ul>
        ${amount && amount > 0 
          ? `<p>You will now be directed to complete your payment. After completing the payment, you will receive a payment confirmation email.</p>` 
          : `<p>We'll be in touch with more details about the event soon. If you have any questions in the meantime, please don't hesitate to contact us.</p>`}
        <p>Best regards,</p>
        <p>The Daniel One Four Team</p>
      `,
    });
    
    // Return different response for paid and free events
    if (amount && amount > 0 && clientSecret) {
      return NextResponse.json({ 
        success: true, 
        clientSecret, 
        registrationId: entry.sys.id 
      });
    } else {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
} 