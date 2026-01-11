import React from 'react';

export default function EventPageLoading() {
  return (
    <div>
      {/* PageHeader Skeleton */}
      <div className="h-[300px] md:h-[400px] bg-gray-300 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <div className="h-12 w-3/4 bg-gray-400 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Event Details Skeleton */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-6 mb-8">
              {/* Date and Time Skeletons */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                <div className="h-5 w-32 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                <div className="h-5 w-40 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            <div className="mb-12">
              {/* Title Skeleton */}
              <div className="h-8 w-64 bg-gray-300 rounded mb-6 animate-pulse"></div>
              
              {/* Description Skeleton */}
              <div className="space-y-3">
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-11/12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-4/5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Content Skeletons */}
              <div className="mt-8 space-y-6">
                <div className="h-7 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-11/12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-48 bg-gray-300 rounded animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-11/12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="h-7 w-48 bg-gray-300 rounded animate-pulse mb-6"></div>
              
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-24 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-32 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-28 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-36 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-32 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-12 w-full bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 