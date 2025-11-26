import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

interface PageHeaderProps {
  title: string;
  image: StaticImageData;
  breadcrumbs?: { label: string; href: string }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, image, breadcrumbs = [] }) => {
  return (
    <div className="relative overflow-hidden bg-gray-950 text-white min-h-[500px] flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-4 py-16 text-center md:py-24">
        {/* Title */}
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex flex-wrap items-center justify-center text-sm font-medium text-gray-400 sm:text-base">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-white"
                >
                  {crumb.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <FaChevronRight className="mx-2 text-xs text-gray-600" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Subtle bottom gradient for blending */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
    </div>
  );
};

export default PageHeader;