import React from 'react';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/contentful-events';
import ClientEventPage from '@/components/events/ClientEventPage';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = params.slug;
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
  };
}

export default function EventPage({ params }: { params: { slug: string } }) {
  return <ClientEventPage slug={params.slug} />;
} 