'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getFeaturedTestimonials, Testimonial } from '@/lib/contentful-testimonials';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  
  // Number of testimonials to show per slide based on screen width
  const testimonialsPerSlide = windowWidth < 768 ? 1 : 2;
  
  // Calculate total slides based on testimonials length and how many we show per slide
  const totalSlides = testimonials.length > 0 
    ? Math.ceil(testimonials.length / testimonialsPerSlide) 
    : 0;

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);
    
    // Add resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await getFeaturedTestimonials(6); // Fetch up to 6 testimonials
        setTestimonials(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Handle next slide
  const nextSlide = () => {
    if (totalSlides <= 1) return; // Don't rotate if only one slide
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Handle previous slide
  const prevSlide = () => {
    if (totalSlides <= 1) return; // Don't rotate if only one slide
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (totalSlides <= 1) return; // Don't set up rotation if only one slide
    
    // Auto-rotate every 10 seconds
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 10000);
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [testimonials, totalSlides, testimonialsPerSlide]);

  // Reset interval when manually changing slides
  const handleManualNavigation = (direction: 'prev' | 'next') => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    if (direction === 'prev') {
      prevSlide();
    } else {
      nextSlide();
    }
    
    // Restart auto-rotation (10 seconds interval)
    if (totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 10000);
    }
  };

  // Get current visible testimonials based on current slide and testimonials per slide
  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * testimonialsPerSlide;
    return testimonials.slice(startIndex, startIndex + testimonialsPerSlide);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 font-['Work_Sans']">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What Our Clients Say</h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(testimonialsPerSlide)].map((_, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md animate-pulse h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 font-['Work_Sans']">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">What Our Clients Say</h2>
          <p className="text-center text-red-500 mb-12">{error}</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't render the section if there are no testimonials
  }

  const visibleTestimonials = getCurrentTestimonials();

  return (
    <section className="py-16 md:py-24 bg-white font-['Work_Sans']">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="uppercase tracking-wider text-sm font-medium mb-4">
              REVIEW
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Testimonials
            </h2>
          </div>
          
          {totalSlides > 1 && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleManualNavigation('prev')}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-800 transition-colors"
                aria-label="Previous testimonial"
              >
                <FiArrowLeft size={16} />
              </button>
              <button 
                onClick={() => handleManualNavigation('next')}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-gray-800 transition-colors"
                aria-label="Next testimonial"
              >
                <FiArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
        
        {/* Divider line */}
        <div className="w-full h-px bg-gray-200 mb-16"></div>
        
        {/* Testimonial Grid - shows 1 or 2 testimonials based on screen width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <div key={`${currentSlide}-${index}`} className="flex flex-col md:flex-row gap-8 items-start">
              {/* Testimonial Image */}
              <div className="relative h-[300px] w-full md:w-1/2">
                {testimonial.image ? (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              
              {/* Testimonial Content */}
              <div className="w-full md:w-1/2">
                <p className="text-gray-700 mb-8 text-lg">
                  {testimonial.quote}
                </p>
                <div>
                  <h3 className="text-xl font-bold">{testimonial.name}</h3>
                  {testimonial.role && (
                    <p className="text-gray-600">{testimonial.role}</p>
                  )}
                  {testimonial.company && (
                    <p className="text-gray-600">{testimonial.company}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 

