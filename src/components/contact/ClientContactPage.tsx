'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { FiMail, FiPhone, FiSend, FiLoader, FiCheckCircle } from 'react-icons/fi';
import aboutImage from '@/assets/images/about.png';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

const ClientContactPage = () => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact' },
  ];
  const { data: companyDetails, isLoading } = useCompanyDetails();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill out all required fields');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      // Show success notification
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: ''
      });
      
      // Scroll to top of form
      const formElement = document.getElementById('contact-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title="Contact Us" 
          image={aboutImage}
          breadcrumbs={breadcrumbs}
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get In Touch With Our Team
              </h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Our coaching experts are ready to help you achieve your goals. Contact us today to discuss your needs and how we can support your journey to success.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Contact Cards */}
              <div className="bg-header-bg p-8 rounded-md text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPhone className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Phone</h3>
                <p className="mb-2">{companyDetails?.primaryPhoneNumber}</p>
                <p>{companyDetails?.secondaryPhoneNumbers?.map(phone => phone).join(', ')}</p>
              </div>
              
              <div className="bg-header-bg p-8 rounded-md text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="mb-2">{companyDetails?.primaryEmail}</p>
                <p>{companyDetails?.secondaryEmails?.map(email => email).join(', ')}</p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="grid grid-cols-1">
                <div className="p-8 md:p-12 bg-header-bg" id="contact-form">
                  <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                  <p className="mb-6">
                    Fill out the form and our team will get back to you within 24 hours. We're here to help you with any questions you might have.
                  </p>
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
                      <FiCheckCircle className="mr-2 text-xl" />
                      <div>
                        <p className="font-medium">Message sent successfully!</p>
                        <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                      </div>
                    </div>
                  )}
                  
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block mb-2 font-medium">Your Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block mb-2 font-medium">Your Email <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block mb-2 font-medium">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block mb-2 font-medium">Subject <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block mb-2 font-medium">Your Message <span className="text-red-500">*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Your message here..."
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-black text-white rounded-md font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-500"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <FiSend className='text-brand-orange' />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ClientContactPage; 