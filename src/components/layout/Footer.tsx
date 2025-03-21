'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { FiArrowRight, FiLoader, FiCheck, FiX } from 'react-icons/fi';
import logoBlack from '@/assets/images/logo-black.png';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

const Footer = () => {
  const { data: companyDetails, isLoading } = useCompanyDetails();
  
  // Newsletter form state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setSubmitStatus('error');
      setStatusMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      // Success
      setSubmitStatus('success');
      setStatusMessage(data.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (err) {
      setSubmitStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Reset status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setStatusMessage('');
    }
  };
  
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Logo and Company Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <Link href="/" prefetch>
              <Image 
                src={logoBlack} 
                alt="Dasan" 
                width={120} 
                height={40} 
                className="h-10 w-auto"
              />
              </Link>
              
            </div>
            <p className="text-gray-700 mb-6">
              {companyDetails?.introTagLine}
            </p>
            <p className="text-gray-700 mb-6">
              {companyDetails?.streetAddress}, {" "}
              {companyDetails?.postCode}, {" "}
              {companyDetails?.country}
            </p>
            <div className="flex items-center text-gray-700">
              <span>
                {companyDetails?.primaryPhoneNumber ? (
                  <a href={`tel:${companyDetails?.primaryPhoneNumber}`}>{companyDetails?.primaryPhoneNumber}</a>
                ) : null}
              </span>
              <span className="mx-4">|</span>
              <span>
                {companyDetails?.primaryEmail ? (
                  <a href={`mailto:${companyDetails?.primaryEmail}`}>{companyDetails?.primaryEmail}</a>
                ) : null}
              </span>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="text-xl font-bold mb-6">
              Join Our Newsletter Community<br />
              For Regular Inspiration
            </h3>
            <form className="mb-4" onSubmit={handleNewsletterSubmit}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="your mail address" 
                  className="px-4 py-3 bg-gray-100 border-none focus:outline-none flex-grow"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  className="bg-black text-white p-3 disabled:bg-gray-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <FiLoader className="animate-spin" size={24} />
                  ) : (
                    <FiArrowRight size={24} />
                  )}
                </button>
              </div>
              
              {/* Status message */}
              {submitStatus === 'success' && (
                <div className="flex items-center mt-2 text-green-600">
                  <FiCheck className="mr-2" />
                  <span>{statusMessage}</span>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="flex items-center mt-2 text-red-600">
                  <FiX className="mr-2" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </form>
            
            <div>
              <p className="text-gray-700 mb-4">Social Media</p>
              <div className="flex space-x-4">
                {companyDetails?.socialMedias?.facebook && (
                  <a href={companyDetails.socialMedias?.facebook} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                    <FaFacebookF size={20} />
                  </a>
                )}
                {companyDetails?.socialMedias?.instagram && (
                  <a href={companyDetails.socialMedias?.instagram} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                    <FaInstagram size={20} />
                  </a>
                )}
                {companyDetails?.socialMedias?.twitter && (
                  <a href={companyDetails.socialMedias?.twitter} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                    <FaTwitter size={20} />
                  </a>
                )}
                {companyDetails?.socialMedias?.linkedin && (
                  <a href={companyDetails.socialMedias?.linkedin} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
                    <FaLinkedin size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Links and Support */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-700 hover:text-black">About Us</Link></li>
              <li><Link href="/services" className="text-gray-700 hover:text-black">Services</Link></li>
              <li><Link href="/programs" className="text-gray-700 hover:text-black">Programs</Link></li>
              <li><Link href="/events" className="text-gray-700 hover:text-black">Events</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/policy" className="text-gray-700 hover:text-black">Privacy Policy</Link></li>
              <li><Link href="/contact" className="text-gray-700 hover:text-black">Contact us</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-700 text-sm mb-4 md:mb-0">
            © 2025 {companyDetails?.companyName}. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/policy" className="text-gray-700 hover:text-black text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 