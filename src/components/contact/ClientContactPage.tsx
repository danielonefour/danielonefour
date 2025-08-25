'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { FiMail, FiPhone, FiSend, FiLoader, FiCheckCircle } from 'react-icons/fi';
import aboutImage from '@/assets/images/about.png';
import { FiMapPin, FiClock } from 'react-icons/fi';

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
<main className="mt-12 md:mt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Contact Form & Image Section */}
              <div className="bg-[#f6f6f6] p-6 md:p-10 rounded-3xl shadow-lg border border-gray-200">
                <div className="flex flex-col gap-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                      Have Questions? 
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Fill out the form below, and one of our team members will get back to you shortly. Reach out for any inquiries.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm mb-1">First Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5b4a]"
                      placeholder="Your first name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-gray-700 text-sm mb-1">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5b4a]"
                      placeholder="Your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-700 text-sm mb-1">E-mail</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5b4a]"
                      placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 text-sm mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5b4a]"
                        placeholder="+234 800234756"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 text-sm mb-1">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1a5b4a]"
                        required
                      >
                         <option value="" disabled>Select a service</option>
                    <option value="pre-teen">Pre-teen Course</option>
                    <option value="teens">Teens Course</option>
                    <option value="youth">Youth Course</option>
                    <option value="adult-one-on-one">Adult One-on-One</option>
                    <option value="business-etiquette">Business Etiquette</option>
                    <option value="family-package">Family Package</option>
                    <option value="school-package">School Package</option>
                    <option value="group-coaching">Group Coaching</option>
                    <option value="workshops">Workshops/Training</option>
                    <option value="speaking">Speaking Engagement</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-gray-700 text-sm mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5b4a]"
                    placeholder="Tell us about your goals and how we can help you..."
                        required
                      ></textarea>
                    </div>

                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
                        <FiCheckCircle className="mr-2 text-xl" />
                        <div>
                          <p className="font-medium">Message sent successfully!</p>
                          <p className="text-sm">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8 py-3 bg-brand-blue text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#1a5b4a] transition-colors disabled:bg-gray-400"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <FiSend className='text-white -rotate-45' />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Information Cards Section */}
              <div className="flex flex-col gap-6">
                <div className="relative rounded-3xl overflow-hidden shadow-lg p-6 h-auto min-h-[300px] flex items-end"
                     style={{backgroundImage: `url('/images/hero.png')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <div className="relative z-10 text-white p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold">Daniel One Four</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-semibold leading-tight">
                      Our experts will help you
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-brand-lightBlue p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
                      <FiMail className="text-brand-blue text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                      <p className="text-gray-600">danielonefour14@gmail.com

</p>
                    </div>
                  </div>

                  <div className="bg-brand-blue p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
                      <FiPhone className="text-brand-blue text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-100">Call</h4>
                      <p className="text-gray-100">+31612671297</p>
                    </div>
                  </div>

                  <div className="bg-brand-lightBlue p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
                      <FiMapPin className="text-brand-blue text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">Address</h4>
                      <p className="text-gray-600">Lagos, Nigeria, BA 80301</p>
                    </div>
                  </div>

                  <div className="bg-brand-lightBlue p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
                      <FiClock className="text-brand-blue text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">Working Hours</h4>
                      <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
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