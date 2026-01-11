'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { FiMail, FiPhone, FiSend, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { FiMapPin, FiClock } from 'react-icons/fi';

import { useCompanyDetails } from '@/hooks/useCompanyDetails';

const ClientContactPage = () => {
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      <main className="min-h-screen bg-neutral-50 pt-36 pb-16 md:pt-48 md:pb-24">
        <section className="container max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" data-aos="fade-up">
            <span className="inline-block px-4 py-1.5 bg-brand-orange/10 text-brand-orange font-bold text-xs tracking-widest uppercase rounded-full">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              We'd Love to <br className="md:hidden" /> <span className="text-brand-blue">Hear From You</span>
            </h1>
            <p className="text-slate-600 text-lg md:text-xl">
              Have a question about our courses or services? Fill out the form below and our team will get back to you shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Contact Information & Sidebar */}
            <div className="lg:col-span-4 space-y-6" data-aos="fade-right">
              {/* Info Card */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lightBlue/30 rounded-bl-[100px] -mr-8 -mt-8"></div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-6 relative z-10">Contact Info</h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-brand-lightBlue rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <FiMail className="text-brand-blue text-xl group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Email</h4>
                      <a href="mailto:danielonefour14@gmail.com" className="text-slate-800 font-medium hover:text-brand-blue transition-colors">
                        danielonefour14@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-brand-lightBlue rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <FiPhone className="text-brand-blue text-xl group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</h4>
                      <a href="tel:+31612671297" className="text-slate-800 font-medium hover:text-brand-blue transition-colors">
                        +31 6 1267 1297
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-brand-lightBlue rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <FiMapPin className="text-brand-blue text-xl group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Office</h4>
                      <p className="text-slate-800 font-medium">
                        Lagos, Nigeria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-brand-lightBlue rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <FiClock className="text-brand-blue text-xl group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours</h4>
                      <p className="text-slate-800 font-medium">
                        Mon-Fri: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

               {/* Optional: Add a small CTA or testimonial card here if desired */}
               <div className="bg-brand-blue text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3">Not sure where to start?</h3>
                    <p className="text-blue-50 mb-6">Explore our services to see how we can help you achieve your goals.</p>
                    <a href="/services" className="inline-flex items-center gap-2 bg-white text-brand-blue px-6 py-3 rounded-xl font-bold hover:bg-brand-yellow hover:text-slate-900 transition-all">
                      View Services
                      <FiSend className="rotate-0" />
                    </a>
                  </div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-orange/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
               </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-8" data-aos="fade-left">
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6" id="contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                       <label htmlFor="lastName" className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                        placeholder="+234..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-slate-700 ml-1">I'm interested in...</label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Select a topic</option>
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
                        <option value="other">Other Inquiry</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all resize-none"
                      placeholder="Tell us a bit more about your needs..."
                      required
                    ></textarea>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3 animate-fade-in">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-4 animate-fade-in">
                      <div className="bg-green-100 p-2 rounded-full">
                         <FiCheckCircle className="text-xl" />
                      </div>
                      <div>
                        <p className="font-bold">Message sent successfully!</p>
                        <p className="text-sm text-green-600">We'll get back to you shortly.</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-5 bg-slate-900 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-brand-blue transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed transform hover:-translate-y-1 shadow-lg hover:shadow-brand-blue/30"
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader className="animate-spin text-xl" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FiSend className="text-lg" />
                      </>
                    )}
                  </button>
                </form>
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