'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import { Service } from '@/lib/contentful';
import { useAllServices } from '@/hooks/use-contentful';

interface ClientServicesPageProps {
  initialServices: Service[];
}

export default function ClientServicesPage({ initialServices }: ClientServicesPageProps) {
  const { data: services = initialServices } = useAllServices();

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6">
      

        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No services found. Please check back later.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 space-y-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="break-inside-avoid-column">
      <Link 
        href={`/services/${service.slug}`} 
        className="block group transition-transform duration-300 hover:scale-[1.02] transform-gpu"
      >
        <div className="p-8 h-full bg-gray-50 border border-gray-100 rounded-2xl relative transition-all duration-300 group-hover:bg-white group-hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-brand-blue transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {service.description}
          </p>
          
          <div className="mt-auto flex items-center justify-between text-brand-blue font-medium">
            <span className="text-base">Explore Service</span>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-blue text-white transition-colors duration-300 group-hover:bg-blue-50 group-hover:text-brand-blue">
              <FiArrowUpRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}