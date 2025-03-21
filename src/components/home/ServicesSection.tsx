'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HoleButton from '@/components/ui/HoleButton';
import coachingImage from '@/assets/images/coaching.png';
import { useAllServices } from '@/hooks/use-contentful';
import { Oval } from 'react-loader-spinner';

const CoachingExperienceSection = () => {
  // State to track the active experience
  const [activeExperience, setActiveExperience] = useState(0);
  
  // Fetch services from Contentful
  const { data: services = [], isLoading, error } = useAllServices();

  // Function to format the count number with leading zero
  const formatCount = (index: number): string => {
    return `${index + 1}`.padStart(2, '0');
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="uppercase tracking-wider text-sm font-medium mb-4">
              SERVICES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Offer Exceptional Coaching Experiences
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <Oval
              height={60}
              width={60}
              color="#1699C1"
              secondaryColor="#e0f2fe"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        </div>
      </section>
    );
  }

  // If there's an error loading the services, display some fallback
  if (error || services.length === 0) {
    // Keep the original static data as fallback
    const fallbackExperiences = [
      {
        title: 'Personal Development Coaching',
        subtitle: 'Coaching',
        description: 'Duis Vel Tincidunt Est. Proin Eget Nisl Sit Amet Magna Efficitur Rutrum Sit Amet At Urna. Sed Cursus, Ligula Eget Ultrices Tristique, Nibh Augue Molestie Nulla, Ut Auctor Felis Neque Sed Tellus. Ut In Metus Mi. Vivamus Quis Sapien Fringilla, Sagittis Est Fermentum, Volutpat Metus. Mauris Efficitur Tincidunt Leo A Tincidunt.',
        link: '/services/personal-development',
      },
      {
        title: 'Executive Coaching',
        subtitle: 'Executive Coaching',
        description: 'Duis Vel Tincidunt Est. Proin Eget Nisl Sit Amet Magna Efficitur Rutrum Sit Amet At Urna. Sed Cursus, Ligula Eget Ultrices Tristique, Nibh Augue Molestie Nulla, Ut Auctor Felis Neque Sed Tellus. Ut In Metus Mi. Vivamus Quis Sapien Fringilla, Sagittis Est Fermentum, Volutpat Metus. Mauris Efficitur Tincidunt Leo A Tincidunt.',
        link: '/services/executive-coaching',
      },
      {
        title: 'Coaching Businessmen Since Day One',
        subtitle: 'Business Coaching',
        description: 'Duis Vel Tincidunt Est. Proin Eget Nisl Sit Amet Magna Efficitur Rutrum Sit Amet At Urna. Sed Cursus, Ligula Eget Ultrices Tristique, Nibh Augue Molestie Nulla, Ut Auctor Felis Neque Sed Tellus. Ut In Metus Mi. Vivamus Quis Sapien Fringilla, Sagittis Est Fermentum, Volutpat Metus. Mauris Efficitur Tincidunt Leo A Tincidunt.',
        link: '/services/business-coaching',
      },
      {
        title: 'The Custom Clarity Coaching',
        subtitle: 'Clarity Coaching',
        description: 'Duis Vel Tincidunt Est. Proin Eget Nisl Sit Amet Magna Efficitur Rutrum Sit Amet At Urna. Sed Cursus, Ligula Eget Ultrices Tristique, Nibh Augue Molestie Nulla, Ut Auctor Felis Neque Sed Tellus. Ut In Metus Mi. Vivamus Quis Sapien Fringilla, Sagittis Est Fermentum, Volutpat Metus. Mauris Efficitur Tincidunt Leo A Tincidunt.',
        link: '/services/clarity-coaching',
      },
    ];
    return renderContent(fallbackExperiences);
  }

  // Map Contentful services to the format expected by the UI
  const experiences = services.map(service => ({
    title: service.title,
    subtitle: service.title,
    description: service.description,
    link: `/services/${service.slug}`,
  }));

  return renderContent(experiences);

  // Helper function to render the content with either real or fallback data
  function renderContent(experiencesData: any[]) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="uppercase tracking-wider text-sm font-medium mb-4">
              SERVICES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Offer Exceptional Coaching Experiences
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column - Numbers List */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {experiencesData.map((exp, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 cursor-pointer"
                    onClick={() => setActiveExperience(index)}
                  >
                    <div className={`text-2xl font-bold ${activeExperience === index ? 'text-black' : 'text-gray-400'}`}>
                      {formatCount(index)}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${activeExperience === index ? 'underline' : ''}`}>
                        {exp.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Middle Column - Content */}
            <div className="lg:col-span-4 border-l border-gray-200 pl-8">
              <h3 className="text-3xl font-bold mb-6">
                {experiencesData[activeExperience]?.subtitle}
              </h3>
              
              <p className="text-gray-600 mb-8">
                {experiencesData[activeExperience]?.description}
              </p>
              
              <HoleButton 
                href={experiencesData[activeExperience]?.link}
                bgColorClass="bg-white"
              >
                <span className="mr-4">Discover More</span>
              </HoleButton>
            </div>
            
            {/* Right Column - Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[500px] w-full">
                <Image
                  src={coachingImage}
                  alt="Coaching Experience"
                  fill
                  style={{ objectFit: 'cover' }}
                />
                
                {/* Overlay text */}
                <div className="absolute bottom-0 left-0 transform translate-y-8 translate-x-[-20px] bg-header-bg p-6 max-w-[250px]">
                  <h3 className="text-xl font-bold">
                    Friendly And Efficient Business Coaches
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default CoachingExperienceSection; 