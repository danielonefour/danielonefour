import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { FiChevronRight, FiChevronLeft, FiMail, FiPhone, FiDownload, FiFilePlus, FiMessageCircle } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import aboutImage from '@/assets/images/about.png';
import { Metadata } from 'next';
import ServiceFAQs from '@/components/services/ServiceFAQs';
import { getServiceBySlug, getAllServices } from '@/lib/contentful';
import ClientServicePage from '@/components/services/ClientServicePage';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const slug = params.slug;
  const service = await getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.'
    };
  }
  
  return {
    title: `${service.title} | Daniel One Four Coaching`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  // Fetch the initial data on the server for SEO and fast initial load
  const slug = params.slug;
  const [service, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getAllServices()
  ]);
  
  if (!service) {
    notFound();
  }
  
  // This page now uses server components for the initial load
  // and passes data to a client component that can use React Query
  return <ClientServicePage initialService={service} initialAllServices={allServices} slug={slug} />;
} 