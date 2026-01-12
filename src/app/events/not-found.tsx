import React from 'react';
import Link from 'next/link';

export default function EventNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Event Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          We couldn't find the event you're looking for. It may have been removed or the URL might be incorrect.
        </p>
        <div className="space-y-4">
          <Link 
            href="/events" 
            className="inline-block bg-blue-600 text-white py-3 px-8 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            View All Events
          </Link>
          <p className="text-gray-500">
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 