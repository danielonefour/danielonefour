'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HoleButton from '../ui/HoleButton';
import { Program, getFeaturedPrograms } from '@/lib/contentful-programs';
import Link from 'next/link';

const ProgramsSection = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        const response = await getFeaturedPrograms(1, 3);
        setPrograms(response.items);
        setError(null);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const getLayout = (index: number) => {
    // Even indices (0, 2, 4...) will have text on top
    // Odd indices (1, 3, 5...) will have image on top
    return index % 2 === 0 ? 'text-top' : 'image-top';
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Programs</h2>
          <p className="text-center text-gray-600 mb-12">Loading programs...</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white p-8 animate-pulse h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Programs</h2>
          <p className="text-center text-red-500 mb-12">{error}</p>
        </div>
      </section>
    );
  }

  if (programs.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Programs</h2>
          <p className="text-center text-gray-600 mb-12">No programs available at the moment. Please check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Programs</h2>
        <p className="text-center text-gray-600 mb-12">
          Explore our range of specialized coaching and training programs
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => {
            const layout = getLayout(index);
            
            return (
              <div key={program.id} className="flex flex-col h-full">
                {/* For text-top layout */}
                {layout === 'text-top' && (
                  <>
                    {/* Text Card */}
                    <div className="bg-white p-8 md:p-10 mb-8 flex flex-col h-[350px]">
                      <h3 className="text-xl md:text-2xl font-bold mb-6">{program.title}</h3>
                      <p className="text-gray-600 mb-8 flex-grow overflow-hidden text-sm">{program.shortDescription}</p>
                      <div className="mt-auto">
                        <HoleButton 
                          href={`/programs/${program.slug}`}
                          bgColorClass="bg-brand-orange"
                        >
                          <span className="mr-4">More Details</span>
                        </HoleButton>
                      </div>
                    </div>
                    
                    {/* Image Card */}
                    <div className="relative h-[350px] w-full">
                      <Image
                        src={program.image || '/placeholder-program.jpg'}
                        alt={program.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </>
                )}
                
                {/* For image-top layout */}
                {layout === 'image-top' && (
                  <>
                    {/* Image Card */}
                    <div className="relative mb-8 h-[350px] w-full">
                      <Image
                        src={program.image || '/placeholder-program.jpg'}
                        alt={program.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Text Card */}
                    <div className="bg-white p-8 md:p-10 flex flex-col h-[350px]">
                      <h3 className="text-xl md:text-2xl font-bold mb-6">{program.title}</h3>
                      <p className="text-gray-600 mb-8 flex-grow overflow-hidden text-sm">{program.shortDescription}</p>
                      <div className="mt-auto">
                        <HoleButton 
                          href={`/programs/${program.slug}`}
                          bgColorClass="bg-brand-orange"
                        >
                          <span className="mr-4">More Details</span>
                        </HoleButton>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection; 