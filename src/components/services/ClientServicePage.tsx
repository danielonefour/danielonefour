'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { FiChevronRight, FiChevronLeft, FiMail, FiPhone, FiDownload, FiFilePlus, FiMessageCircle } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import aboutImage from '@/assets/images/about.png';
import ServiceFAQs from '@/components/services/ServiceFAQs';
import { useServiceBySlug, useAllServices } from '@/hooks/use-contentful';
import { Service } from '@/lib/contentful';

interface ClientServicePageProps {
  initialService: Service;
  initialAllServices: Service[];
  slug: string;
}

export default function ClientServicePage({ 
  initialService, 
  initialAllServices,
  slug 
}: ClientServicePageProps) {
  // Use React Query hooks with initialData for instant loading
  // We're using initialService as default data, which is guaranteed to be non-null
  const { data: service } = useServiceBySlug(slug);
  const { data: allServices = initialAllServices } = useAllServices();
  
  // Use initialService if service from query is null (should never happen)
  const currentService = service || initialService;
  
  // Create breadcrumbs based on the current service
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: currentService.title, href: `/services/${slug}` },
  ];

  // Find the current service index for navigation
  const currentServiceIndex = allServices.findIndex(s => s.slug === slug);
  const prevService = currentServiceIndex > 0 ? allServices[currentServiceIndex - 1] : allServices[allServices.length - 1];
  const nextService = currentServiceIndex < allServices.length - 1 ? allServices[currentServiceIndex + 1] : allServices[0];
  
  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title={currentService.title} 
          image="/images/author/leader-chess.jpg"
          breadcrumbs={breadcrumbs}
          titleClassName="text-3xl md:text-5xl lg:text-6xl"
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Column - Service Details */}
              <div className="lg:w-2/3">
                <div className="relative mb-10 rounded-3xl overflow-hidden shadow-2xl">
                  {currentService.featuredImage ? (
                    <Image
                      src={currentService.featuredImage}
                      alt={currentService.title}
                      width={800}
                      height={500} 
                      className="w-full h-[450px] object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 800px"
                    />
                  ) : (
                    <div className="w-full h-[450px] bg-gradient-to-br from-brand-blue to-brand-orange flex items-center justify-center rounded-md">
                      <h2 className="text-4xl text-white font-black">{currentService.title}</h2>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                </div>
                
                {/* <h2 className="text-3xl font-bold mb-6">Description For Our Service</h2> */}
                <div className="prose prose-lg prose-slate max-w-none mb-12 prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-blue prose-img:rounded-2xl">
                  <div dangerouslySetInnerHTML={{ __html: currentService.content }} />
                </div>
                
                <p className="text-slate-600 italic mb-12 border-l-4 border-brand-orange pl-6 py-2 bg-slate-50 rounded-r-lg">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error
                </p>

                <h2 className="text-3xl font-bold mb-8 text-slate-900">Benefits</h2>
                <div className="flex mb-12">
                  <div className="w-full">
                    <p className="mb-6 text-slate-600 text-lg">Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatu. Excepteur Sint Occaecat Cup.</p>
                    
                    <ul className="space-y-4">
                      {currentService.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-brand-blue/30">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-0.5 text-green-600">
                            <FaCheck className="text-sm" />
                          </div>
                          <span className="text-slate-700 font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* FAQ Section */}
                <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                {currentService.faqs && currentService.faqs.length > 0 ? (
                  <ServiceFAQs faqs={currentService.faqs} />
                ) : (
                  <div className="bg-gray-50 p-6 rounded-md mb-8">
                    <p className="text-gray-600 text-center py-4">No FAQs available for this service</p>
                  </div>
                )}
                
                {/* Navigation Arrows - Positioned at bottom of left column */}
                <div className="flex items-center mt-16 py-8 border-t border-slate-200">
                  <div className="w-1/2 flex items-center">
                    <Link href={`/services/${prevService.slug}`} className="group flex items-center text-slate-800 hover:text-brand-blue transition-colors">
                      <div className="w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center mr-4 group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:-translate-x-1">
                         <FiChevronLeft className="text-xl" />
                      </div>
                      <div>
                         <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Previous Service</span>
                         <span className="text-lg font-bold line-clamp-1">{prevService.title}</span>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="h-12 w-px bg-slate-200 mx-6"></div>
                  
                  <div className="w-1/2 flex items-center justify-end text-right">
                    <Link href={`/services/${nextService.slug}`} className="group flex items-center justify-end text-slate-800 hover:text-brand-blue transition-colors">
                      <div>
                         <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next Service</span>
                         <span className="text-lg font-bold line-clamp-1">{nextService.title}</span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center ml-4 group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:translate-x-1">
                         <FiChevronRight className="text-xl" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Service List & Contact */}
              <div className="lg:w-1/3">
                {/* Services List */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-brand-orange rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-900">Our Services</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {allServices.map((item, index) => (
                      <li key={index}>
                        <Link 
                          href={`/services/${item.slug}`} 
                          className={`flex justify-between items-center group p-3 rounded-xl transition-all ${
                             item.slug === slug 
                               ? 'bg-brand-blue text-white shadow-md' 
                               : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-medium">{item.title}</span>
                          {item.slug === slug && <FiChevronRight />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              
                {/* Contact Info */}
                <div className="bg-brand-blue p-8 rounded-3xl shadow-lg mb-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                   <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">Get In Touch</h3>
                    
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center mb-1 text-brand-yellow font-medium">
                          <FiMail className="mr-3" />
                          <span>Email Us</span>
                        </div>
                        <p className="pl-7 text-white/90 text-sm break-all">info@danielonefour.com</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-1 text-brand-yellow font-medium">
                          <FiPhone className="mr-3" />
                          <span>Call Us</span>
                        </div>
                        <p className="pl-7 text-white/90 text-sm">+668 66 448 6452 99</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-4 mb-8">
                  <Link href="#" className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                         <FiDownload className="text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Download</p>
                        <p className="font-bold text-slate-900">Brochure</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="#" className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors">
                        <FiFilePlus className="text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Services</p>
                        <p className="font-bold">Details</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* How to Contact Section - Moved to be the last element */}
                <Link href="/contact" className="block bg-brand-yellow p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiMessageCircle className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">Start Your<br />Journey</h3>
                  </div>
                  <p className="text-slate-800 font-medium text-sm leading-relaxed mb-4">
                    Ready to transform your leadership skills? Get in touch with our team today.
                  </p>
                  <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-0.5">
                    Contact Us <FiChevronRight className="ml-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 