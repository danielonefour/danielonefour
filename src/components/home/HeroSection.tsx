'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HoleButton from '@/components/ui/HoleButton';
import { useSliders } from '@/hooks/useSliders';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(false);
  const { data: slides, isLoading } = useSliders();

  // Auto slide change
  useEffect(() => {
    if (!slides || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    if (!slides) return;
    setCurrentSlide(index);
  };

  if (isLoading || !slides || slides.length === 0) {
    return (
      <div className="relative h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-64 bg-gray-300 animate-pulse rounded-md mb-4 mx-auto"></div>
          <div className="h-4 w-80 bg-gray-300 animate-pulse rounded-md mx-auto mb-2"></div>
          <div className="h-4 w-72 bg-gray-300 animate-pulse rounded-md mx-auto mb-6"></div>
          <div className="h-10 w-40 bg-gray-300 animate-pulse rounded-md mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="px-6 md:px-12 lg:px-20 relative overflow-hidden">
      <div className="grid grid-cols-12 min-h-[500px]">
        {/* Left Column - Text and Button (1/3 width) */}
        <div className="col-span-12 pr-4 lg:col-span-4 flex flex-col relative">
          {/* Text Area - White Background */}
          <div className="bg-white py-12 flex-1">
            <h1 className="text-4xl md:text-5xl pb-4 lg:text-5xl font-bold mb-6 leading-tight">
              {slides[0].title}
            </h1>
            <p className="text-gray-700">
              {slides[0].description}
            </p>
          </div>
          
          {/* Button Area - Light Gray Background */}
          <div className="bg-light-gray py-10 lg:py-12 flex-1 relative">
            {/* Gray background that extends full width */}
            <div className="absolute top-0 right-0 bottom-0 bg-light-gray w-screen" style={{ left: '-100vw' }}></div>
            
            {/* Button content */}
            <div className="relative z-10">
              <HoleButton 
                href={slides[0].buttonLink}
                bgColorClass="bg-brand-orange"
              >
                <span className="mr-4">{slides[0].buttonText}</span>
              </HoleButton>
            </div>
          </div>
        </div>
        
        {/* Right Column - Image Carousel (2/3 width) */}
        <div className="col-span-12 lg:col-span-8 h-[500px] lg:h-full relative">
          {/* Image Carousel */}
          <div className="h-full w-full relative overflow-hidden">
            {slides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="object-cover object-center w-full h-full rounded-lg"
                  fill
                  priority={index === 0}
                />
              </div>
            ))}
            
            {/* Target element for focus animation */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-16 h-16 bg-transparent border border-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 