import React from 'react';
import Image from 'next/image';
import Button from './Button';

interface CardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt = 'Card image',
  buttonText,
  buttonHref,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {imageSrc && (
        <div className="relative h-48 w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        {buttonText && buttonHref && (
          <Button href={buttonHref} variant="outline" size="sm">
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card; 