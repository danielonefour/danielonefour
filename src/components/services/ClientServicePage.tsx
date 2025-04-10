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
          image={aboutImage}
          breadcrumbs={breadcrumbs}
        />

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Column - Service Details */}
              <div className="lg:w-2/3">
                <div className="relative mb-8">
                  {currentService.featuredImage ? (
                    <Image
                      src={currentService.featuredImage}
                      alt={currentService.title}
                      width={800}
                      height={500} 
                      className="w-full h-[400px] object-cover rounded-md"
                      priority
                    />
                  ) : (
                    <div className="w-full h-[400px] bg-gradient-to-r from-brand-blue to-brand-orange flex items-center justify-center rounded-md">
                      <h2 className="text-4xl text-white font-bold">{currentService.title}</h2>
                    </div>
                  )}
                </div>
                
                {/* <h2 className="text-3xl font-bold mb-6">Description For Our Service</h2> */}
                <div className="prose prose-lg max-w-none mb-10">
                  <div dangerouslySetInnerHTML={{ __html: currentService.content }} />
                </div>
                
                <p className="text-gray-700 italic mb-10">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error
                </p>

                <h2 className="text-3xl font-bold mb-6">Benefits</h2>
                <div className="flex mb-10">
                  <div className="w-full">
                    <p className="mb-4">Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatu. Excepteur Sint Occaecat Cup.</p>
                    
                    <ul className="space-y-4">
                      {currentService.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                            <FaCheck className="text-green-600 text-sm" />
                          </div>
                          <span>{benefit}</span>
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
                <div className="flex items-center mt-16 py-8 border-t border-gray-200">
                  <div className="w-1/2 flex items-center">
                    <Link href={`/services/${prevService.slug}`} className="group flex items-center">
                      <FiChevronLeft className="mr-2 text-xl" />
                      <span className="text-xl font-medium">{prevService.title}</span>
                    </Link>
                  </div>
                  
                  <div className="h-10 w-px bg-gray-300 mx-4"></div>
                  
                  <div className="w-1/2 flex items-center justify-end">
                    <Link href={`/services/${nextService.slug}`} className="group flex items-center">
                      <span className="text-xl font-medium">{nextService.title}</span>
                      <FiChevronRight className="ml-2 text-xl" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Service List & Contact */}
              <div className="lg:w-1/3">
                {/* Services List */}
                <div className="bg-header-bg p-8 mb-8">
                  <h3 className="text-xl font-bold mb-6">Our Services</h3>
                  
                  <ul className="space-y-4">
                    {allServices.map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <Link href={`/services/${item.slug}`} className={`hover:font-bold transition-all ${item.slug === slug ? 'font-bold' : ''}`}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              
                {/* Contact Info */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-6">Get In Touch With Us</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <FiMail className="mr-2" />
                        <span className="font-medium">Info@Example.Com</span>
                      </div>
                      <p className="text-gray-600 pl-6">Contact@Example.Com</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <FiPhone className="mr-2" />
                        <span className="font-medium">+668 66 448 6452 99</span>
                      </div>
                      <p className="text-gray-600 pl-6">+7896 875 987 54</p>
                    </div>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-4 mb-8">
                  <Link href="#" className="flex items-center justify-between p-6 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <FiDownload className="mr-4 text-xl" />
                      <div>
                        <p className="font-medium">Download</p>
                        <p>Brochure</p>
                      </div>
                    </div>
                    <div className="text-3xl">↓</div>
                  </Link>
                  
                  <Link href="#" className="flex items-center justify-between p-6 bg-black text-white">
                    <div className="flex items-center">
                      <FiFilePlus className="mr-4 text-xl" />
                      <div>
                        <p className="font-medium">Services</p>
                        <p>Details</p>
                      </div>
                    </div>
                    <div className="text-3xl">↓</div>
                  </Link>
                </div>
                
                {/* How to Contact Section - Moved to be the last element */}
                <Link href="/contact" className="block bg-header-bg p-8 hover:bg-header-bg/80 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                      <FiMessageCircle className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-bold">How can I contact<br />Daniel-One-Four</h3>
                  </div>
                  <p className="text-gray-700">
                    Get in touch with our team today to discuss your coaching needs and discover how we can help you achieve your goals.
                  </p>
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