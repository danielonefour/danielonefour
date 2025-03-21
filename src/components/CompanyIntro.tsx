import React from 'react';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

export default function CompanyIntro() {
  const { data: companyDetails, isLoading } = useCompanyDetails();

  if (isLoading || !companyDetails) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="h-8 w-40 bg-gray-300 animate-pulse rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6">
            {companyDetails.introTitle}
          </h2>
          
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p className="whitespace-pre-line">{companyDetails.introDescription}</p>
          </div>
          
          {companyDetails.introTagLine && (
            <div className="mt-8 text-xl font-medium text-blue-700 border-l-4 border-blue-700 pl-4 py-2">
              {companyDetails.introTagLine}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 