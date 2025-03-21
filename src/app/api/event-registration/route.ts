import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from 'contentful-management';

// Initialize Contentful Management client
const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || '',
});

// Initialize Nodemailer with Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT || '2525'),
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, organization, message, eventId, eventTitle } = body;
    
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
        status: { 'en-US': 'New' }
      }
    });
    
    // Publish the entry
    await entry.publish();
    
    // Send email to admin
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
        </ul>
        <p>We'll be in touch with more details about the event soon. If you have any questions in the meantime, please don't hesitate to contact us.</p>
        <p>Best regards,</p>
        <p>The Daniel One Four Team</p>
      `,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing event registration:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
} 