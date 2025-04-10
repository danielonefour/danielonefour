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
                <span className="mr-4">Get in touch</span>
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
    </section>
  );
};

export default ClientsSection; 