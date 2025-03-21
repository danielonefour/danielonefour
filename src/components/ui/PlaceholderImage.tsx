import React from 'react';

interface PlaceholderImageProps {
  width?: number | string;
  height?: number | string;
  text?: string;
  className?: string;
  rounded?: boolean;
  bgColor?: string;
  textColor?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = '100%',
  height = '100%',
  text,
  className = '',
  rounded = false,
  bgColor = '#e5e7eb', // gray-200
  textColor = '#6b7280', // gray-500
}) => {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${rounded ? 'rounded-lg' : ''} ${className}`}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        position: 'relative',
      }}
    >
      {text && (
        <span
          className="text-center font-medium px-4"
          style={{ color: textColor }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default PlaceholderImage; 