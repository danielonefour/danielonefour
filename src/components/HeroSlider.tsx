import React, { useState, useEffect } from 'react';
import { useSliders } from '@/hooks/useSliders';

export default function HeroSlider() {
  const { data: slides, isLoading } = useSliders();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides every 5 seconds
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

  const nextSlide = () => {
    if (!slides) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (!slides) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 10 : 0,
            visibility: index === currentSlide ? 'visible' : 'hidden',
          }}
        >
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white opacity-90 mb-8">
                  {slide.description}
                </p>
                {slide.buttonText && slide.buttonLink && (
                  <a
                    href={slide.buttonLink}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-colors"
                  >
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 