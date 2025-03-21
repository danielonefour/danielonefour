'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiClock } from 'react-icons/fi';
import HoleButton from '@/components/ui/HoleButton';
import eventImage from '@/assets/images/event.png';
import { format } from 'date-fns';
import { getUpcomingEvents, Event } from '@/lib/contentful-events';

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchEvents = async () => {
        try {
          setIsLoading(true);
          const response = await getUpcomingEvents(3);
          setEvents(response);
          setError(null);
        } catch (err) {
          console.error('Error fetching events:', err);
          setError('Failed to load events. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchEvents();
    }, []);

    if (isLoading) {
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
                <Link href="/events" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View All Events
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 p-4 rounded-lg h-96 animate-pulse"></div>
                ))}
              </div>
            </div>
          </section>
        );
      }
    
      if (error) {
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-center text-red-500 mb-8">{error}</p>
            </div>
          </section>
        );
      }
    
      if (events.length === 0) {
        return (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-center text-gray-500 mb-8">No upcoming events at the moment. Check back soon!</p>
            </div>
          </section>
        );
      }

  return (
    <section className="py-16 md:py-24 bg-light-gray">
      <div className="container mx-auto px-6">
      <div className="mb-8">
              <div className="uppercase tracking-wider text-sm font-medium mb-4">
                EVENTS
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Upcoming Events
              </h2>
              
              {/* Book Appointment Button - Moved here */}
              <div className="mb-8">
                <HoleButton 
                  href="/events"
                  bgColorClass="bg-brand-orange"
                >
                  <span className="mr-4">View All Events</span>
                </HoleButton>
              </div>
            </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Image and Title */}
          <div className="lg:col-span-5 relative">
            
            
            <div className="relative">
              <div className="relative h-[500px] w-full">
                <Image
                  src={eventImage}
                  alt="Events"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 transform translate-y-8 translate-x-[-20px] bg-header-bg p-6 max-w-[250px]">
                <h3 className="text-xl font-bold">
                  Friendly And Efficient Business Coaches
                </h3>
              </div>
            </div>
          </div>
          
          {/* Right Column - Events List */}
          <div className="lg:col-span-7">
            <div className="space-y-0">
              {events.map((event, index) => (
                <React.Fragment key={index}>
                  <Link 
                    href={`/events/${event.slug}`}
                    className="block py-8 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-8">
                      {/* Date */}
                      <div className="text-center w-24">
                        <div className="text-6xl font-bold">{format(new Date(event.date), 'd')}</div>
                        <div className="text-sm text-gray-600">{format(new Date(event.date), 'MMM')}</div>
                      </div>
                      
                      {/* Event Image */}
                      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={eventImage}
                          alt={event.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      
                      {/* Event Details */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:gap-8">
                          <div className="flex items-center gap-2 text-gray-600 mb-2 sm:mb-0">
                            <FiMapPin size={18} />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex text-sm items-center gap-2 text-gray-600">
                            <FiClock size={18} />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Divider (except for the last item) */}
                  {index < events.length - 1 && (
                    <div className="w-full h-px bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection; 