import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getAllEvents, Event } from '@/lib/contentful-events';
import PageHeader from '@/components/layout/PageHeader';
import aboutImage from '@/assets/images/about.png';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const EVENTS_PER_PAGE = 10;

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1">
    {event.image && (
      <div className="relative h-48 w-full">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    )}
    <div className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-blue-700 font-bold">
            {format(new Date(event.date), 'MMM')}
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {format(new Date(event.date), 'd')}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{event.title}</h3>
          <div className="text-gray-600 mt-1 text-sm">
            {event.time && <span className="mr-3">{event.time}</span>}
            {event.location && <span>{event.location}</span>}
          </div>
        </div>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
      
      {/* Price information */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium">
          {event.duration && (
            <span className="text-gray-600">Duration: {event.duration}</span>
          )}
        </div>
        <div>
          {event.amount ? (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {event.currency} {event.amount.toFixed(2)}
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              FREE
            </span>
          )}
        </div>
      </div>
      
      <Link
        href={`/events/${event.slug}`}
        className="text-blue-600 font-medium hover:text-blue-800"
      >
        Learn More
      </Link>
    </div>
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            aria-label="Previous page"
          >
            Previous
          </Link>
        )}

        {pages.map(page => (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`px-4 py-2 border rounded-md ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </Link>
        ))}

        {currentPage < totalPages && (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            aria-label="Next page"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

export async function generateMetadata() {
  return {
    title: 'Events - Daniel One Four',
    description: 'Join our workshops, webinars, and conferences to enhance your leadership and personal growth.',
  };
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse the page parameter safely, ensuring it's properly awaited
  const pageParam = searchParams?.page || '1';
  const currentPage = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam);
  
  const { items: events, total } = await getAllEvents(currentPage, EVENTS_PER_PAGE);
  const totalPages = Math.ceil(total / EVENTS_PER_PAGE);

  return (
    <>
      <Header />
      <main>
        <PageHeader
          title="Upcoming Events"
          image={aboutImage}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Events', href: '/events' },
          ]}
        />
        
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Upcoming Events</h1>
          
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                basePath="/events" 
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 
