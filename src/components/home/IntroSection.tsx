import React from 'react';
import Button from '@/components/ui/Button';
import PlaceholderImage from '@/components/ui/PlaceholderImage';

const IntroSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <PlaceholderImage 
                height="400px" 
                width="100%" 
                text="Life Coach" 
                rounded={true}
                className="shadow-md"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Hello,<br />
              I Am Andrew, Your Life Coach!
            </h2>
            <p className="text-gray-600 mb-8">
              With over 10 years of experience in personal and professional coaching, I help individuals and businesses reach their full potential. My approach combines proven strategies with personalized guidance to ensure lasting results.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">58+</span>
                </div>
                <p className="text-gray-600">Certified Coaches</p>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">13+</span>
                </div>
                <p className="text-gray-600">Years of Experience</p>
              </div>
            </div>
            <Button href="/about">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection; 