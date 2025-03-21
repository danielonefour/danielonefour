'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HoleButton from '@/components/ui/HoleButton';
import whyImage from '@/assets/images/why.png';
import { getAllWhyChooseUsItems, WhyChooseUsItem } from '@/lib/contentful-why-choose-us';


const WhyChooseSection = () => {
  const [items, setItems] = useState<WhyChooseUsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await getAllWhyChooseUsItems();
        // select ONLY the first 2 items
        const firstTwoItems = response?.slice(0, 2);
        setItems(firstTwoItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching Why Choose Us items:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);
  
  return (
    <section className="py-16 md:py-24 bg-header-bg">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why You Need A Life Coach
            </h2>
            
            <p className="text-gray-600 mb-12">
              Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat 
              Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident
            </p>
            
            {/* Gain Clarity And Focus */}
            {items.map((item, index) => (
            <div className="mb-10" key={item.title}>
              <h3 className="text-2xl font-bold mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {item.content}
              </p>
              {index !== items.length - 1 && (
                <div className="w-full h-px bg-gray-800 my-6"></div>
              )}
            </div>
            ))}
            
            <HoleButton 
              href="/about"
              bgColorClass="bg-brand-orange"
            >
              <span className="mr-4">Discover More</span>
            </HoleButton>
          </div>
          
          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative h-[600px] w-full">
              <Image
                src={whyImage}
                alt="Why Choose a Life Coach"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection; 