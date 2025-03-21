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
  // Use React Query with initialData for instant loading
  const { data: services = initialServices } = useAllServices();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Your Inner Strength Create
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            The Majority Have Suffered Alteration In Some Form, By Injected Humour. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No services found. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
    <Link href={`/services/${service.slug}`} className="block h-full group">
      <div className="p-8 h-full border border-gray-100 relative transition-colors duration-300 group-hover:bg-white bg-header-bg">
        <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
        <p className="text-gray-700 mb-12">{service.description}</p>
        
        {/* Arrow Circle - positioned in the bottom right corner */}
        <div className="absolute bottom-[-30px] right-[-30px] w-[60px] h-[60px] rounded-full bg-black flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <FiArrowUpRight className="text-white" size={24} />
        </div>
      </div>
    </Link>
  );
} 