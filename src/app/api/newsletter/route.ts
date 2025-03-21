import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

// Function to check if email already exists
async function checkEmailExists(email: string) {
  try {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    // Query entries with the email
    const entries = await environment.getEntries({
      content_type: 'newsletterSubscriber',
      'fields.email': email
    });
    
    return entries.items.length > 0 ? entries.items[0] : null;
  } catch (error) {
    console.error('Error checking if email exists:', error);
    throw error;
  }
}

// Function to submit subscriber to Contentful
async function submitToContentful(subscriberData: any) {
  try {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    // Create the entry
    const entry = await environment.createEntry('newsletterSubscriber', {
      fields: {
        email: { 'en-US': subscriberData.email },
        name: { 'en-US': subscriberData.name || '' },
        subscriptionDate: { 'en-US': new Date().toISOString() },
        active: { 'en-US': true },
        sourceUrl: { 'en-US': subscriberData.sourceUrl || '' },
        ipAddress: { 'en-US': subscriberData.ipAddress || '' },
        confirmationToken: { 'en-US': subscriberData.confirmationToken || '' },
        confirmed: { 'en-US': false },
        externalId: { 'en-US': '' }
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

// Function to update a subscriber entry
async function updateSubscriberEntry(entryId: string, updateData: any) {
  try {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    // Get the entry
    const entry = await environment.getEntry(entryId);
    
    // Update fields
    if (updateData.active !== undefined) {
      entry.fields.active = { 'en-US': updateData.active };
    }
    
    if (updateData.confirmationToken) {
      entry.fields.confirmationToken = { 'en-US': updateData.confirmationToken };
    }
    
    // Update the entry
    const updatedEntry = await entry.update();
    
    // Publish the entry
    await updatedEntry.publish();
    
    return updatedEntry;
  } catch (error) {
    console.error('Error updating subscriber entry:', error);
    throw error;
  }
}

// Function to send confirmation email
async function sendConfirmationEmail(subscriberData: any) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/api/newsletter/confirm?token=${subscriberData.confirmationToken}&email=${encodeURIComponent(subscriberData.email)}`;
    
    await transporter.sendMail({
      from: `"Daniel One Four" <noreply@danielonefour.com>`,
      to: subscriberData.email,
      subject: `Confirm Your Newsletter Subscription`,
      html: `
        <h1>Confirm Your Subscription</h1>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>Please click the button below to confirm your subscription:</p>
        <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
          <tr>
            <td align="center" bgcolor="#000000" style="padding: 12px 24px; border-radius: 4px;">
              <a href="${confirmUrl}" target="_blank" style="display: inline-block; color: #ffffff; text-decoration: none; font-weight: bold;">
                Confirm Subscription
              </a>
            </td>
          </tr>
        </table>
        <p>Or copy and paste this link into your browser:</p>
        <p>${confirmUrl}</p>
        <p>If you did not sign up for this newsletter, you can ignore this email.</p>
        <hr>
        <p>Best regards,</p>
        <p>The Daniel One Four Team</p>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

// Mailchimp/external email service integration
async function addToEmailService(subscriberData: any) {
  // This would be replaced with actual API calls to your email service
  // For example, using the Mailchimp API
  try {
    console.log('Adding subscriber to email service:', subscriberData.email);
    // Mock success response with a fake ID
    const externalId = `mock_${Date.now()}`;
    return { success: true, id: externalId };
  } catch (error) {
    console.error('Error adding to email service:', error);
    // Don't throw - we still want to store in Contentful even if external service fails
    return { success: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const data = await request.json();
    
    // Basic validation
    if (!data.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Get IP address from request
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    
    // Get source URL from referer
    const sourceUrl = request.headers.get('referer') || '';
    
    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    
    // Check if email already exists
    const existingEntry = await checkEmailExists(data.email);
    
    if (existingEntry) {
      // Update existing entry with new confirmation token
      await updateSubscriberEntry(existingEntry.sys.id, {
        active: true,
        confirmationToken
      });
      
      // Add metadata to subscriber data
      const subscriberData = {
        ...data,
        ipAddress,
        sourceUrl,
        confirmationToken,
      };
      
      // Send confirmation email
      await sendConfirmationEmail(subscriberData);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Subscription renewed. Please check your email to confirm.' 
      });
    }
    
    // Add metadata to subscriber data
    const subscriberData = {
      ...data,
      ipAddress,
      sourceUrl,
      confirmationToken,
    };
    
    // Submit to Contentful
    const newEntry = await submitToContentful(subscriberData);
    
    // Attempt to add to email service
    const emailServiceResult = await addToEmailService(subscriberData);
    
    // If successfully added to email service, update the Contentful entry
    if (emailServiceResult.success && emailServiceResult.id) {
      await updateSubscriberEntry(newEntry.sys.id, {
        externalId: emailServiceResult.id
      });
    }
    
    // Send confirmation email
    await sendConfirmationEmail(subscriberData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription successful. Please check your email to confirm.' 
    });
  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

// Confirmation endpoint for newsletter subscription
export async function GET(request: NextRequest) {
  try {
    // Get token and email from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing token or email' },
        { status: 400 }
      );
    }
    
    // Check if subscriber exists with this token
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');
    
    const entries = await environment.getEntries({
      content_type: 'newsletterSubscriber',
      'fields.email': email,
      'fields.confirmationToken': token
    });
    
    if (entries.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid token or email' },
        { status: 400 }
      );
    }
    
    // Update subscriber to confirmed
    const entry = entries.items[0];
    entry.fields.confirmed = { 'en-US': true };
    const updatedEntry = await entry.update();
    await updatedEntry.publish();
    
    // Redirect to a thank you page
    return NextResponse.redirect(new URL('/thank-you?type=newsletter', request.url));
  } catch (error) {
    console.error('Error confirming subscription:', error);
    return NextResponse.json(
      { error: 'Failed to confirm subscription' },
      { status: 500 }
    );
  }
} 