// PopularDestinations.jsx
import React from 'react';

const categories = ['All', 'Best Seller', 'Nature', 'City', 'Seasonal'];

const PopularDestinations = () => {
  return (
    <div className="bg-white px-4 sm:px-8 py-8">
      <div className="relative text-center mb-8">
        <h1 className="text-gray-200 text-5xl sm:text-8xl font-bold opacity-90 tracking-widest absolute inset-0 flex items-center justify-center pointer-events-none">
          DESTINATION
        </h1>
        <h2 className="text-gray-600 text-xl sm:text-2xl font-semibold relative z-10">
          POPULAR DESTINATIONS
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${category === 'All' 
                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:ring-blue-500' 
                : 'bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 focus:ring-gray-300'}`
            }
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;
