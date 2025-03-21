'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { FiMapPin, FiClock, FiCalendar } from 'react-icons/fi';
import { Oval } from 'react-loader-spinner';
import { remark } from 'remark';
import html from 'remark-html';
import PageHeader from '@/components/layout/PageHeader';
import { getEventBySlug } from '@/lib/contentful-events';
import EventRegistrationForm from '@/components/events/EventRegistrationForm';
import Header from '@/components/layout/Header';
import Footer from '../layout/Footer';

// Define interface for Event data
interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  content?: any;
  image?: string;
}

interface ClientEventPageProps {
  slug: string;
}

export default function ClientEventPage({ slug }: ClientEventPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [contentHtml, setContentHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const eventData = await getEventBySlug(slug);
        
        if (!eventData) {
          notFound();
        }
        
        setEvent(eventData as Event);
        
        // Process content with remark-html if it's a string
        if (eventData.content && typeof eventData.content === 'string') {
          const processedContent = await remark()
            .use(html)
            .process(eventData.content);
          
          setContentHtml(processedContent.toString());
        }
      } catch (err) {
        console.error('Error fetching event data:', err);
        setError('Failed to load event. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchEventData();
    }
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <main>
          <div className="container mx-auto px-4 py-16 flex justify-center">
            <div className="text-center">
              <Oval
                height={60}
                width={60}
                color="#1699C1"
                secondaryColor="#e0f2fe"
                strokeWidth={4}
                strokeWidthSecondary={4}
              />
              <p className="mt-4 text-gray-600">Loading event details...</p>
            </div>
          </div>
        </main>
      <Footer />
      </>
    );
  }
  
  // Error state
  if (error) {
    return (
      <>
        <Header />
        <main>
          <div className="container mx-auto px-4 py-16">
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
              <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!event) {
    notFound();
  }
  
  const eventDate = new Date(event.date);
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: event.title, href: `/events/${event.slug}` },
  ];
  
  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title={event.title}
          image={{ src: event.image || '/images/default-event-header.jpg', width: 1920, height: 600 }}
          breadcrumbs={breadcrumbs}
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Event Details - takes up 2/3 on desktop */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiCalendar className="text-blue-600" size={20} />
                  <span>{format(eventDate, 'MMMM d, yyyy')}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiClock className="text-blue-600" size={20} />
                    <span>{event.time}</span>
                  </div>
                )}
                
                {event.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiMapPin className="text-blue-600" size={20} />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none mb-12">
                <h2 className="text-3xl font-bold mb-6">About This Event</h2>
                <div className="mb-8">
                  {event.description}
                </div>
                
                {/* Rich text content */}
                <div>
                  {contentHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  ) : event.content && typeof event.content === 'object' && 'nodeType' in event.content ? (
                    <p>This content uses Contentful Rich Text format and cannot be displayed with markdown rendering.</p>
                  ) : (
                    <p>No detailed content available for this event.</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Registration Form - takes up 1/3 on desktop */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-8 rounded-lg sticky top-8">
                <h2 className="text-2xl font-bold mb-6">Register for this Event</h2>
                <EventRegistrationForm eventId={event.id} eventTitle={event.title} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 