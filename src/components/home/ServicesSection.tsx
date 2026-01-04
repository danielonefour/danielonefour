'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/lib/contentful';

interface ServicesSectionProps {
  initialServices?: Service[];
}

const ServicesSection = ({ initialServices = [] }: ServicesSectionProps) => {
  return (
    <section className="py-24 bg-zinc-50 overflow-hidden" id="services">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4" data-aos="fade-up">
          <span className="inline-block px-4 py-1.5 bg-brand-orange/10 text-brand-orange font-bold text-xs tracking-widest uppercase rounded-full">
            Our Expertise
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            How We <span className="text-brand-blue">Empower</span> You
          </h2>
          <p className="text-slate-600 text-lg">
            We provide specialized coaching, training, and consulting services designed to elevate your personal and professional impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialServices.map((service, index) => (
            <div 
              key={service.id || service.slug} 
              className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-blue/20 transition-all duration-500 flex flex-col h-full"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-8">
                {service.featuredImage ? (
                  <Image
                    src={service.featuredImage}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-blue/5 flex items-center justify-center text-brand-blue/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-blue transition-colors">
                {service.title}
              </h3>
              
              <p className="text-slate-600 mb-8 line-clamp-3 flex-grow">
                {service.description}
              </p>

              <div className="pt-4 border-t border-slate-50 mt-auto">
                <Link 
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-brand-blue font-bold hover:gap-3 transition-all duration-300"
                >
                  Explore Service
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {initialServices.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No services found. Please check back later.</p>
          </div>
        )}
        
        <div className="mt-20 text-center" data-aos="zoom-in">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 border-2 border-slate-900 text-slate-900 font-bold px-10 py-4 rounded-full hover:bg-slate-900 hover:text-white transition-all duration-300"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
