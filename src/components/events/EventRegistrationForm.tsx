'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Payment Form Component
function PaymentForm({ clientSecret, registrationId, onPaymentSuccess }: { 
  clientSecret: string
  registrationId: string
  onPaymentSuccess: () => void 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred during payment.');
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Update payment status in Contentful
        try {
          const response = await fetch('/api/payment-update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              registrationId,
              paymentIntentId: paymentIntent.id,
              status: 'succeeded'
            }),
          });

          if (!response.ok) {
            console.error('Failed to update payment status');
          }
        } catch (error) {
          console.error('Error updating payment status:', error);
        }

        // Notify parent component of success
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full mt-4 bg-brand-blue text-white py-3 px-4 rounded-md font-medium ${
          (!stripe || processing) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-blue-dark'
        }`}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  amount?: number;
  currency?: string;
}

// Main Registration Form Component
const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId,
  eventTitle,
  amount,
  currency
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: '',
    eventId,
    eventTitle
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setClientSecret(null); // Hide payment form
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/event-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount,
          currency
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for event');
      }
      
      if (amount && amount > 0 && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setRegistrationId(data.registrationId);
      } else {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          message: '',
          eventId,
          eventTitle
        });
        
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show payment success message
  if (paymentSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
        <p className="font-medium">Payment successful!</p>
        <p className="mt-1">Thank you for registering for "{eventTitle}". We'll send you a confirmation email shortly.</p>
      </div>
    );
  }

  // Show registration success message for free events
  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
        <p className="font-medium">Registration submitted successfully!</p>
        <p className="mt-1">We'll contact you with more details about "{eventTitle}".</p>
      </div>
    );
  }

  // Show Stripe payment form if we have a client secret
  if (clientSecret && registrationId) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Complete Payment</h3>
        <Elements stripe={stripePromise} options={{ 
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0066cc',
              colorBackground: '#ffffff',
              colorText: '#1a1a1a',
              colorDanger: '#df1b41',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '4px'
            }
          }
        }}>
          <PaymentForm 
            clientSecret={clientSecret} 
            registrationId={registrationId}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    );
  }

  // Show registration form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your full name"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="your.email@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="(123) 456-7890"
        />
      </div>
      
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
          Organization/Company
        </label>
        <input
          type="text"
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your organization (if applicable)"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Comments
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any questions or special requirements?"
        />
      </div>
      
      {/* Display price information */}
      {amount && amount > 0 ? (
        <div className="bg-blue-50 p-4 rounded-md mb-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Registration Fee:</span>
            <span className="font-bold">{currency || ''} {amount.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Payment will be processed securely after registration.
          </p>
        </div>
      ) : (
        <div className="bg-green-50 p-4 rounded-md mb-2">
          <div className="font-medium text-green-800">This event is free to attend</div>
        </div>
      )}
      
      {submitError && (
        <div className="text-red-500 text-sm">{submitError}</div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-brand-blue text-white py-3 px-4 rounded-md font-medium ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-blue'
        }`}
      >
        {isSubmitting ? 'Submitting...' : amount && amount > 0 ? 'Register & Pay' : 'Register Now'}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        By registering, you agree to our terms of service and privacy policy.
        Your information will be used to process your registration and communicate about this event.
      </p>
    </form>
  );
};

export default EventRegistrationForm; 