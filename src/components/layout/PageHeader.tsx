import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  image: StaticImageData;
  breadcrumbs?: { label: string; href: string }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, image, breadcrumbs = [] }) => {
  return (
    <div className="relative">
      {/* Background section */}
      <div className="bg-header-bg pt-16 pb-8 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 relative z-[5]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Left Content */}
            <div className="pt-4 sm:pt-8 max-w-full pr-[10%] sm:pr-[20%] md:pr-[15%] lg:pr-0">
              {/* Title with improved mobile styling */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 break-words hyphens-auto w-full" 
                  style={{ 
                    overflowWrap: 'break-word', 
                    wordWrap: 'break-word',
                    maxWidth: '100%',
                    wordBreak: 'break-word'
                  }}>
                {title}
              </h1>
              
              {/* Breadcrumbs with improved mobile styling */}
              {breadcrumbs.length > 0 && (
                <div className="flex flex-wrap items-center text-gray-600 max-w-full text-sm sm:text-base">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <Link 
                        href={crumb.href} 
                        className="hover:text-black truncate max-w-[80px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-xs"
                      >
                        {crumb.label?.length > 15 ? `${crumb.label.slice(0, 15)}...` : crumb.label}
                      </Link>
                      {index < breadcrumbs.length - 1 && (
                        <span className="mx-1 sm:mx-2 flex-shrink-0">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Black Rectangle - positioned to overlap the background bottom edge */}
      <div className="ml-4 sm:ml-6 md:ml-12 lg:ml-20 absolute left-0 transform translate-y-[-50%] w-[40%] h-6 sm:h-8 bg-black z-[4]"></div>
      
      {/* Image Container - positioned to overlap the background bottom edge */}
      <div className="absolute right-0 transform translate-y-[-70%] w-[40%] h-[250px] sm:h-[300px] mr-4 sm:mr-6 md:mr-12 lg:mr-20 z-[4]">
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
      </div>
      
      {/* Spacer to account for the image height below the background */}
      <div className="h-[80px] sm:h-[100px] md:h-[120px] lg:h-[150px]"></div>
    </div>
  );
};

export default PageHeader; 