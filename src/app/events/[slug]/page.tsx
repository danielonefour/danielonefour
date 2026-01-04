import React from 'react';
import { notFound } from 'next/navigation';
import { getEventBySlug, getAllEvents } from '@/lib/contentful-events';
import ClientEventPage from '@/components/events/ClientEventPage';
import { Metadata } from 'next';

// Define revalidation period for ISR
export const revalidate = 3600; // Revalidate every hour

// Enable dynamic params for routes not generated at build time
export const dynamicParams = true;

// Generate static params for all events at build time
export async function generateStaticParams() {
  try {
    const events = await getAllEvents();
    console.log(`Generating static params for ${events?.items?.length} events`);
    
    return events?.items?.map((event) => ({
      slug: event.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for events:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  
  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The event you are looking for does not exist.',
    };
  }
  
  return {
    title: `${event.title} - Daniel One Four Events`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.image ? [event.image] : [],
      type: 'website',
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Pre-fetch the event data on the server for SEO
  const event = await getEventBySlug(slug);
  
  if (!event) {
    notFound();
  }
  
  return <ClientEventPage slug={slug} initialEvent={event} />;
} 