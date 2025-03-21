import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import nodemailer from 'nodemailer';

// Initialize the contentful management client
const client = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || '',
});

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.EMAIL_PORT) || 2525,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

// Function to submit form data to Contentful
async function submitToContentful(formData: any) {
  try {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    // Create the entry
    const entry = await environment.createEntry('contactSubmission', {
      fields: {
        name: { 'en-US': formData.name },
        email: { 'en-US': formData.email },
        subject: { 'en-US': formData.subject },
        message: { 'en-US': formData.message },
        phone: { 'en-US': formData.phone || '' },
        sourceUrl: { 'en-US': formData.sourceUrl || '' },
        ipAddress: { 'en-US': formData.ipAddress || '' },
        submittedAt: { 'en-US': new Date().toISOString() },
        status: { 'en-US': 'new' }
      }
    });
    
    // Publish the entry
    await entry.publish();
    
    return entry;
  } catch (error) {
    console.error('Error submitting to Contentful:', error);
    throw error;
  }
}

// Function to send notification email
async function sendEmail(formData: any) {
  try {
    const recipientEmail = process.env.NOTIFICATION_EMAIL || 'admin@danielonefour.com';
    
    // Send email to admin
    await transporter.sendMail({
      from: `"Website Contact Form" <noreply@danielonefour.com>`,
      to: recipientEmail,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
        ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
        <hr>
        <p><small>This message was sent from the website contact form. IP: ${formData.ipAddress}</small></p>
      `,
    });
    
    // Send confirmation email to the user
    await transporter.sendMail({
      from: `"Daniel One Four" <noreply@danielonefour.com>`,
      to: formData.email,
      subject: `Thank you for contacting us`,
      html: `
        <h1>Thank You for Contacting Us</h1>
        <p>Dear ${formData.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>For your records, here is a copy of your message:</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,</p>
        <p>The Daniel One Four Team</p>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get IP address from request
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    
    // Get source URL from referer
    const sourceUrl = request.headers.get('referer') || '';
    
    // Add metadata to form data
    const formData = {
      ...data,
      ipAddress,
      sourceUrl,
    };
    
    // Submit to Contentful and send email concurrently
    await Promise.all([
      submitToContentful(formData),
      sendEmail(formData)
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
} 