'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import HoleButton from '@/components/ui/HoleButton';
import aboutImage from '@/assets/images/about.jpg';
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
    <section className="bg-brand-orange py-16 md:py-24">
      {/* About Section */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Content - Image */}
          <div className="relative flex-1 w-full lg:w-1/2">
            <div className="group relative h-96 sm:h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={aboutImage}
                alt="Life Coach"
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
        
          </div>
          
          {/* Right Content - Text */}
          <div className="flex-1 w-full lg:w-1/2 lg:mt-0 text-white">
            {companyDetails ? (
            <>
            <span className="inline-block px-3 py-1 mb-4 text-xs sm:text-sm font-semibold tracking-wide text-zinc-700 bg-brand-orange/10 rounded-full uppercase">
              About Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-zinc-700 leading-tight mb-6">
              {companyDetails?.introTitle}
            </h2>
            <div className="mb-8 text-lg text-zinc-700 space-y-4">
              <p>
                {companyDetails?.introDescription}
              </p>
            </div>
            
            <HoleButton 
              href="/contact"
              bgColorClass="bg-brand-orange"
            >
              <span className="mr-4">Get in touch</span>
            </HoleButton>
            </>
            ) : (
              // Add a loading skeleton
              <div className="animate-pulse py-4 text-gray-500">
                <div className="h-4 w-24 mb-4 bg-neutral-700 rounded-full"></div>
                <div className="h-10 w-2/3 mb-2 bg-neutral-700 rounded-md"></div>
                <div className="h-6 w-3/4 mb-4 bg-neutral-700 rounded-md"></div>
                <div className="h-4 w-full bg-neutral-700 rounded-md"></div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;