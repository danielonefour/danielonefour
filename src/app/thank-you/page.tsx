'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import aboutImage from '@/assets/images/about.png';
import Link from 'next/link';
import { FiCheck, FiMail, FiSend } from 'react-icons/fi';

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const [type, setType] = useState<string>('');
  
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setType(typeParam);
    }
  }, [searchParams]);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Thank You', href: '/thank-you' },
  ];

  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title="Thank You" 
          image={aboutImage}
          breadcrumbs={breadcrumbs}
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiCheck className="text-green-600 text-4xl" />
              </div>
              
              {type === 'newsletter' ? (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Subscription Confirmed!
                  </h2>
                  <p className="text-lg text-gray-700 mb-8">
                    Thank you for confirming your newsletter subscription. You're now all set to receive our latest updates, articles, and special offers directly in your inbox.
                  </p>
                  <div className="flex justify-center">
                    <FiMail className="text-6xl text-gray-400 mb-8" />
                  </div>
                </>
              ) : type === 'contact' ? (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Message Received!
                  </h2>
                  <p className="text-lg text-gray-700 mb-8">
                    Thank you for contacting us. We've received your message and will get back to you as soon as possible. A confirmation email has been sent to your email address.
                  </p>
                  <div className="flex justify-center">
                    <FiSend className="text-6xl text-gray-400 mb-8" />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Thank You!
                  </h2>
                  <p className="text-lg text-gray-700 mb-8">
                    Your request has been successfully processed. If you have any questions, please don't hesitate to contact us.
                  </p>
                </>
              )}
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/" className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
                  Return Home
                </Link>
                <Link href="/contact" className="px-6 py-3 border border-black text-black rounded-md font-medium hover:bg-gray-100 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ThankYouPage; 