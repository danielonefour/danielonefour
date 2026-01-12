import React from 'react';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import aboutImage from '@/assets/images/about.png';

export const metadata = {
  title: 'Payment Successful - Daniel One Four',
  description: 'Your payment has been successfully processed',
};

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          title="Payment Successful"
          image={aboutImage}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Events', href: '/events' },
            { label: 'Payment Successful', href: '/events/payment-success' },
          ]}
        />
        
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <FiCheckCircle className="mx-auto text-green-500" size={64} />
              <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your payment. Your transaction has been completed successfully
                and your registration has been confirmed.
              </p>
              <p className="text-gray-600 mb-8">
                A confirmation email has been sent to your email address with all the details.
              </p>
              
              <div className="flex justify-center gap-4">
                <Link 
                  href="/events" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Back to Events
                </Link>
                <Link 
                  href="/" 
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 