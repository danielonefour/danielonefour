import React from 'react';

const DownloadBook = () => {
  return (
    <div className="flex items-center justify-center p-4 md:p-6 pt-16 pb-16 bg-brand-blue min-h-screen">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col md:flex-row bg-brand-blue rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]">

          {/* Image Section */}
          <div className="relative w-full md:w-1/2 flex justify-center items-center p-6 md:p-12">
            <img
              src="/book-cover.png"
              alt="Book cover"
              className="w-64 md:w-64 lg:w-96 h-auto rounded-xl object-cover transform transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
          </div>

          {/* Text & Buttons Section */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center text-center md:text-left text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
              Get Your Free Book
            </h1>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 text-base md:text-lg">
              By following a 7-day fitness routine with a mentor, you can improve your posture, build strength, and reach your fitness goals faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="relative w-full sm:w-auto px-8 py-4 font-bold text-gray-900 bg-teal-400 rounded-full shadow-xl transition-all duration-300 transform hover:bg-teal-500 hover:scale-105">
                <span className="relative z-10">Download Ebook</span>
              </button>
              <button className="relative w-full sm:w-auto px-8 py-4 font-bold text-white bg-transparent border-2 border-gray-600 rounded-full transition-all duration-300 transform hover:bg-gray-700 hover:border-gray-700 hover:scale-105">
                Download Videos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadBook;
