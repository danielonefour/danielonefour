import React from 'react';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

export default function CompanyHero() {
  const { data: companyDetails, isLoading } = useCompanyDetails();

  if (isLoading || !companyDetails) {
    return (
      <div className="bg-gray-100 min-h-[30vh] flex items-center justify-center">
        <div className="text-center p-4">
          <div className="h-8 w-48 bg-gray-300 animate-pulse rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-gray-300 animate-pulse rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {companyDetails.heroTitle}
          </h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed">
            {companyDetails.heroDescription}
          </p>
          <div className="mt-8">
            <a 
              href="#contact" 
              className="inline-block bg-white text-blue-900 font-semibold px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 