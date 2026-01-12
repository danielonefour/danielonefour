'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getFeaturedTestimonials, Testimonial } from '@/lib/contentful-testimonials';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { RiDoubleQuotesL } from 'react-icons/ri';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await getFeaturedTestimonials(6);
        setTestimonials(response);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;
    autoPlayRef.current = setInterval(nextSlide, 8000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [testimonials]);

  const handleManualNavigation = (direction: 'prev' | 'next') => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    direction === 'prev' ? prevSlide() : nextSlide();
    autoPlayRef.current = setInterval(nextSlide, 8000);
  };

  if (isLoading || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="bg-brand-blue py-24 md:py-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-brand-orange font-bold text-xs tracking-widest uppercase rounded-full backdrop-blur-sm border border-white/10">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Voices of <span className="text-brand-orange">Impact</span>
          </h2>
        </div>

        <div className="relative w-full">
          {/* Main Testimonial Highlight */}
          <div 
            key={currentIndex}
            className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center min-h-[450px]"
            data-aos="fade-up"
          >
            {/* Image Side */}
            <div className="relative group mx-auto lg:mx-0 w-64 h-64 md:w-80 md:h-80 lg:w-full lg:h-[450px]">
              <div className="absolute inset-0 bg-brand-orange/20 rounded-[2rem] md:rounded-[3rem] transform rotate-3 scale-105 transition-transform group-hover:rotate-6"></div>
              <div className="relative h-full w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                {current.image ? (
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-5xl font-bold text-white/20">
                    {current.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-transparent to-transparent opacity-60"></div>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center space-y-8 text-left">
              <div className="relative">
                <RiDoubleQuotesL className="absolute -top-10 -left-6 text-white/10 text-8xl md:text-9xl -z-10" />
                <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/90 leading-relaxed italic">
                  "{current.quote}"
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-white">
                  {current.name}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-brand-yellow font-medium text-sm md:text-base uppercase tracking-wider">
                  <span>{current.role}</span>
                  {current.company && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
                      <span>{current.company}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Navigation & Controls */}
              <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleManualNavigation('prev')}
                    className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-blue transition-all duration-300 transform hover:scale-110"
                    aria-label="Previous"
                  >
                    <FiArrowLeft size={24} />
                  </button>
                  <button
                    onClick={() => handleManualNavigation('next')}
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-brand-blue hover:bg-brand-orange hover:text-white transition-all duration-300 transform hover:scale-110 shadow-xl shadow-black/20"
                    aria-label="Next"
                  >
                    <FiArrowRight size={24} />
                  </button>
                </div>
                
                <div className="hidden md:flex gap-2">
                  {testimonials.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
                        setCurrentIndex(i);
                        autoPlayRef.current = setInterval(nextSlide, 8000);
                      }}
                      className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 bg-brand-orange' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;