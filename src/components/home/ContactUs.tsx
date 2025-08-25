// components/ContactUs.js
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
  return (
    <div className="bg-[#f8f9fc] rounded-3xl p-10 md:p-16 flex flex-col lg:flex-row justify-between items-start gap-12">
      {/* Left side: Heading and Description */}
      <div className="lg:w-1/2">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Start Your Success Journey</h1>
        <p className="text-gray-600 max-w-lg leading-relaxed">
          Start your success journey with expert guidance and strategic solutions. Let us help you achieve your business goals and reach new heights.
        </p>
      </div>

      {/* Right side: Contact Platform Card */}
      <div className="lg:w-1/2 bg-white text-gray-900 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Contact Platform</h2>
        <p className="text-sm text-gray-600 mb-6">
          Our contact platform makes it easy to connect with us for inquiries, support, and collaborations. Reach out anytime, and let's build success together.
        </p>
        <ul className="space-y-4">
          <li className="flex items-center gap-4">
            <FaPhoneAlt className="text-indigo-500 text-lg" />
            <span>(201) 555-0124</span>
          </li>
          <li className="flex items-center gap-4">
            <FaEnvelope className="text-indigo-500 text-lg" />
            <span>stratify12@example.com</span>
          </li>
          <li className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-indigo-500 text-lg" />
            <span>4140 Parker Rd. Allentown, New Mexico 31134</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUs;