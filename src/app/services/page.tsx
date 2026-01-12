import React from 'react';
import { getAllServices } from '@/lib/contentful';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';

import ClientServicesPage from '@/components/services/ClientServicesPage';

export const metadata: Metadata = {
  title: 'Services | Daniel One Four Coaching',
  description: 'Explore our range of coaching services designed to help you achieve your personal and professional goals.',
};

export default async function ServicesPage() {
  // Fetch services on the server for SEO and initial render
  const services = await getAllServices();
  
  // Create breadcrumbs for the services page
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
  ];

  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title="Our Services" 
          image="/images/author/leader-chess.jpg"
          breadcrumbs={breadcrumbs}
        />

        <ClientServicesPage initialServices={services} />
      </main>
      <Footer />
    </>
  );
} 