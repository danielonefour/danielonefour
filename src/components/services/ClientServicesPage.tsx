'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiStar, FiZap } from 'react-icons/fi';
import { Service } from '@/lib/contentful';
import { useAllServices } from '@/hooks/use-contentful';

interface ClientServicesPageProps {
  initialServices: Service[];
}

export default function ClientServicesPage({ initialServices }: ClientServicesPageProps) {
  const { data: services = initialServices } = useAllServices();

  return (
    <section className="py-24 bg-brand-yellow">
      <div className="max-w-7xl mx-auto px-6">
        {services.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-xl">
            <p className="text-xl text-slate-500 font-bold">No services found. New brilliance coming soon.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const isBlue = index % 2 === 0;

  return (
    <div className="break-inside-avoid-column mb-8">
      <Link
        href={`/services/${service.slug}`}
        className="group block relative overflow-hidden transition-all duration-500 hover:-translate-y-2"
      >
        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl transition-all duration-500 group-hover:shadow-2xl relative overflow-hidden">
          {/* Creative Brand Accents */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl transition-all duration-500 ${
              isBlue
                ? 'bg-brand-blue/10 group-hover:bg-brand-blue/20'
                : 'bg-brand-orange/10 group-hover:bg-brand-orange/20'
            }`}
          ></div>

          <div className="relative z-10 space-y-6">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                isBlue ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-orange/10 text-brand-orange'
              }`}
            >
              {isBlue ? <FiStar /> : <FiZap />}
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-brand-blue transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">{service.description}</p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span
                className={`text-sm font-black uppercase tracking-widest ${
                  isBlue ? 'text-brand-blue' : 'text-brand-orange'
                }`}
              >
                Discover More
              </span>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 ${
                  isBlue
                    ? 'bg-brand-blue text-white group-hover:bg-slate-900 shadow-brand-blue/20'
                    : 'bg-brand-orange text-slate-900 group-hover:bg-slate-900 group-hover:text-white shadow-brand-orange/20'
                } shadow-lg group-hover:rotate-45`}
              >
                <FiArrowUpRight size={24} />
              </div>
            </div>
          </div>

          {/* Bottom border indicator */}
          <div
            className={`absolute bottom-0 left-0 h-1.5 transition-all duration-500 w-0 group-hover:w-full ${
              isBlue ? 'bg-brand-blue' : 'bg-brand-orange'
            }`}
          ></div>
        </div>
      </Link>
    </div>
  );
}
