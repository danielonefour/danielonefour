'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import HoleButton from '@/components/ui/HoleButton';
import coachingImage from '@/assets/images/coaching.png';
import { useAllServices } from '@/hooks/use-contentful';
import { Service } from '@/lib/contentful';
import { FiAlertTriangle, FiStar, FiHeart, FiCoffee, FiZap } from 'react-icons/fi';
import Link from 'next/link';

interface ServicesProps {
  initialServices?: Service[];
}

const icons = [FiStar, FiHeart, FiCoffee, FiZap];

const GenZCoachingSection = ({ initialServices }: ServicesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: servicesData = [], isLoading, error, refetch } = useAllServices({
    initialData: initialServices,
    enabled: !initialServices,
  });

  const services = servicesData || initialServices || [];

  if (isLoading && !initialServices) {
    return (
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 py-20 text-center">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-8">Loading the Fun...</h2>
      </section>
    );
  }

  if ((error || services.length === 0) && !initialServices) {
    return (
      <section className="bg-red-50 py-20 text-center">
        <FiAlertTriangle className="text-red-500 h-12 w-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-red-600 mb-4">Oops! No services loaded</h3>
        <button
          onClick={() => refetch()}
          className="bg-pink-500 text-white px-6 py-3 rounded-full hover:scale-105 transition-transform"
        >
          Try Again
        </button>
        <Link href="/services" className="block mt-4 text-purple-600 font-bold hover:underline">
          Browse All Services
        </Link>
      </section>
    );
  }

  return (
<section className="pt-16 pb-8 md:pt-20 md:pb-20 lg:pt-32 bg-brand-yellow">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase text-pink-500 mb-2 tracking-wide">Our Services</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-800 mb-2">Level Up With Us!</h2>
          <p className="text-gray-700 max-w-xl mx-auto">Interactive coaching experiences made for you</p>
        </div>

        {/* Services Carousel */}
        <div className="flex overflow-x-auto space-x-6 py-6 scrollbar-hide">
          {services.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`flex-shrink-0 w-72 md:w-80 p-6 rounded-2xl shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 ${
                  activeIndex === index ? 'bg-orange-100 shadow-2xl' : 'bg-white'
                }`}
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <div className="text-3xl text-orange-500 mb-3">
                  <Icon />
                </div>
                <h3 className="font-bold text-xl text-zinc-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                <HoleButton
                  href={`/services/${service.slug}`}
                  bgColorClass="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <span>Peep This! <br /></span>
                </HoleButton>
              </div>
            );
          })}
        </div>

        {/* Featured Service Image */}
        {services[activeIndex] && (
          <div
            className="relative mt-12 rounded-3xl overflow-hidden shadow-2xl group"
            data-aos="zoom-in"
          >
            <Image
              src={coachingImage}
              alt={services[activeIndex].title}
              className="h-80 md:h-[400px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              fill
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 bg-white p-6 rounded-tr-2xl shadow-lg max-w-xs md:max-w-sm">
              <h3 className="font-bold text-xl text-purple-800">{services[activeIndex].title}</h3>
              <p className="text-gray-700 text-sm line-clamp-2">{services[activeIndex].description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GenZCoachingSection;
