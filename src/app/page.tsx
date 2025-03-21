import React from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import { getAllServices } from '@/lib/contentful';
import { getFeaturedBlogPosts } from '@/lib/contentful';
import { getUpcomingEvents } from '@/lib/contentful-events';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="py-16 flex justify-center">
    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Dynamic imports with loading fallbacks
const ProgramsSection = dynamic(() => import('@/components/home/ProgramsSection'), {
  loading: () => <LoadingSpinner />
});

const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'), {
  loading: () => <LoadingSpinner />
});

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
  loading: () => <LoadingSpinner />
});

const EventsSection = dynamic(() => import('@/components/home/EventsSection'), {
  loading: () => <LoadingSpinner />
});

const BlogSection = dynamic(() => import('@/components/home/BlogSection'), {
  loading: () => <LoadingSpinner />
});

export const metadata: Metadata = {
  title: 'Daniel One Four - Coaching, Training, and Consulting',
  description: 'Empower your leadership journey with Daniel One Four. We provide executive coaching, leadership training, and consulting services.',
};

// Revalidate page every 10 minutes
export const revalidate = 600;

export default async function Home() {
  // Fetch critical data in parallel at build time
  const [initialServices, initialPosts, initialEvents] = await Promise.all([
    getAllServices(),
    getFeaturedBlogPosts(),
    getUpcomingEvents(3),
  ]);

  return (
    <>
    <Header />
    <main>
      <HeroSection />
      <ProgramsSection />
      <ServicesSection initialServices={initialServices} />
      <TestimonialsSection />
      <EventsSection initialEvents={initialEvents} />
      <BlogSection initialPosts={initialPosts} />
    </main>
    <Footer />
    </>
  );
}
