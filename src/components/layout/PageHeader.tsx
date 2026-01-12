import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

interface PageHeaderProps {
  title: string;
  image: string | StaticImageData;
  breadcrumbs?: { label: string; href: string }[];
  titleClassName?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, image, breadcrumbs = [], titleClassName }) => {
  return (
    <div className="relative h-[60vh] min-h-[500px] flex items-end pt-24 md:pt-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <div className="relative w-full h-full lg:hidden">
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Modern Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
          <div className="absolute inset-0 bg-brand-blue/10 mix-blend-multiply"></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-6 pb-20 md:pb-32 max-w-7xl mx-auto">
        <div className="max-w-4xl" data-aos="fade-up">
          {/* Breadcrumbs - Top accent */}
          {breadcrumbs.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm font-bold tracking-widest uppercase text-brand-orange">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {crumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <FaChevronRight className="text-[10px] text-white/40" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Title - Massive & Bold */}
          <h1 className={`font-black text-white tracking-tight leading-none mb-6 ${titleClassName || 'text-5xl md:text-7xl lg:text-8xl'}`}>
            {title}
            <span className="text-brand-orange">.</span>
          </h1>
          
          {/* Decorative Line */}
          <div className="h-2 w-24 bg-brand-orange rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;