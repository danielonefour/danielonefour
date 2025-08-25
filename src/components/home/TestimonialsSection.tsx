'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getFeaturedTestimonials, Testimonial } from '@/lib/contentful-testimonials';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { RiDoubleQuotesL } from 'react-icons/ri'; // Added for a modern quote icon

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
        const response = await getFeaturedTestimonials(6);
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
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Handle previous slide
  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (totalSlides <= 1) return;
    
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
      <section className="bg-zinc-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-zinc-100">
            What Our Clients Say
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(testimonialsPerSlide)].map((_, index) => (
                <div key={index} className="bg-zinc-800 p-8 rounded-lg shadow-xl animate-pulse h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-zinc-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-zinc-100">
            What Our Clients Say
          </h2>
          <p className="text-center text-red-400 mb-12">{error}</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const visibleTestimonials = getCurrentTestimonials();

  return (
    <section className="bg-brand-blue py-16 md:py-24 text-zinc-200">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="uppercase tracking-widest text-xs md:text-sm font-semibold text-white mb-3">
          Testimonials
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-white">
          Client Stories
        </h2>

          </div>
          
          {totalSlides > 1 && (
            <div className="flex gap-4">
              <button 
                onClick={() => handleManualNavigation('prev')}
                className="w-12 h-12 bg-zinc-800 border-2 border-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors duration-300 group"
                aria-label="Previous testimonial"
              >
                <FiArrowLeft size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
              </button>
              <button 
                onClick={() => handleManualNavigation('next')}
                className="w-12 h-12 bg-zinc-800 border-2 border-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors duration-300 group"
                aria-label="Next testimonial"
              >
                <FiArrowRight size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          )}
        </div>
        
        {/* Divider line */}
        <div className="w-full h-px bg-brand-lightBlue mb-16"></div>
        
        {/* Testimonial Grid with spacing and padding adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {visibleTestimonials.map((testimonial, index) => (
            <div 
              key={`${currentSlide}-${index}`} 
              className="flex flex-col gap-6 p-6 md:p-8 bg-brand-lightBlue rounded-xl shadow-2xl relative"
            >
              {/* Quote Icon */}
              <RiDoubleQuotesL size={48} className="absolute top-6 left-6 text-zinc-700 opacity-20" />
              
              {/* Testimonial Content */}
              <p className="text-lg text-zinc-700 font-light mt-8">
                {testimonial.quote}
              </p>
              
              <div className="flex items-center gap-4 mt-4">
                {/* Profile Image */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-78888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888800 flex-shrink-0">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-sm">
                      <span className="font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                {/* Profile Info */}
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-zinc-500">{testimonial.name}</h3>
                  <div className="text-sm text-zinc-500">
                    {testimonial.role && <p>{testimonial.role}</p>}
                    {testimonial.company && <p>{testimonial.company}</p>}
                  </div>
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