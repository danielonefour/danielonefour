'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HoleButton from '@/components/ui/HoleButton';
import aboutImage from '@/assets/images/about.png';
import { getFeaturedClients, Client } from '@/lib/contentful-clients';
import { getAllResults, Result } from '@/lib/contentful-results';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

const ClientsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [errorClients, setErrorClients] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [errorResults, setErrorResults] = useState<string | null>(null);
  const { data: companyDetails, isLoading } = useCompanyDetails();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoadingResults(true);
        const data = await getAllResults();
        setResults(data);
        setErrorResults(null);
      } catch (err) {
        console.error('Error fetching results:', err);
        setErrorResults('Failed to load results. Please try again later.');
      } finally {
        setIsLoadingResults(false);
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoadingClients(true);
        const data = await getFeaturedClients();
        setClients(data);
        setErrorClients(null);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setErrorClients('Failed to load clients. Please try again later.');
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Calculate total slides based on showing 2 at a time
  const totalSlides = Math.max(1, Math.ceil(results.length / 2));

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
    if (totalSlides <= 1) return; // Don't auto-scroll if there's only one slide
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section className="py-16 md:py-24 bg-light-gray">
      {/* About Section */}
      <div className="container mx-auto px-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            {companyDetails ? (
            <>
            <div className="mb-4 uppercase tracking-wider text-sm font-medium">
              ABOUT US
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Hello,<br />
              {companyDetails?.introTitle}
            </h2>
            <div className="mb-8">
              <p className="text-gray-600">
                {companyDetails?.introDescription}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mb-12">
              <HoleButton 
                href="/contact"
                bgColorClass="bg-brand-orange"
              >
                <span className="mr-4">Book Appointment</span>
              </HoleButton>
            </div>
            </>
            ) : (
              // Add a loading skeleton
              <div className="py-4 text-gray-500">
                <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-full"></div>
              </div>
            )}
            
            {/* Results section moved up beside the image */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Our Results</h3>
                <div className="flex space-x-4">
                  <button 
                    onClick={prevSlide}
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center"
                    aria-label="Previous slide"
                    disabled={totalSlides <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center"
                    aria-label="Next slide"
                    disabled={totalSlides <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="h-px bg-gray-300 w-full mb-8"></div>
              
              <div className="relative overflow-hidden">
                {isLoadingResults ? (
                  <div className="py-8">
                    <div className="grid grid-cols-2 gap-8">
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div 
                    className="flex transition-transform duration-500 ease-in-out" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {/* Create slides by grouping results in pairs */}
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                      <div key={slideIndex} className="w-full flex-shrink-0 flex gap-8">
                        {/* First item in the pair */}
                        {slideIndex * 2 < results.length && (
                          <div className="w-1/2">
                            <div className="mb-4">
                              <h2 className="text-5xl font-bold mb-2">{results[slideIndex * 2].number}</h2>
                              <h3 className="text-xl font-medium mb-4">{results[slideIndex * 2].title}</h3>
                              <p className="text-gray-600">{results[slideIndex * 2].description}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Second item in the pair */}
                        {slideIndex * 2 + 1 < results.length && (
                          <div className="w-1/2">
                            <div className="mb-4">
                              <h2 className="text-5xl font-bold mb-2">{results[slideIndex * 2 + 1].number}</h2>
                              <h3 className="text-xl font-medium mb-4">{results[slideIndex * 2 + 1].title}</h3>
                              <p className="text-gray-600">{results[slideIndex * 2 + 1].description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-gray-500">No results available</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Content - Image with overlay */}
          <div className="relative flex items-end" style={{ minHeight: '500px' }}>
            <div className="relative h-[500px] w-full">
              <Image
                src={aboutImage}
                alt="Life Coach"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-sm"
              />
              
              {/* Action overlay - offset from the image */}
              <div className="absolute bottom-0 left-0 transform translate-y-8 translate-x-[-20px] bg-header-bg p-6 max-w-[250px]">
                <h3 className="text-xl font-bold">
                  {companyDetails?.introTagLine}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trusted By Companies - full width with light gray background */}
      <div className="bg-light-gray">
        <div className="container mx-auto px-6 mb-8">
          <h3 className="text-xl font-medium mb-8">Trusted By Organizations</h3>
        </div>
        
        <div className="w-full border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {clients.map((client, index) => (
              <div 
                key={index} 
                className={`flex justify-center items-center py-8 px-4 ${
                  index < clients.length - 1 ? 'border-r border-gray-200' : ''
                }`}
              >
                <div className="text-xl font-bold text-gray-800">{client.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection; 