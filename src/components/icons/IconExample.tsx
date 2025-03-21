import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// This is an example of how you can use Flat Icons in your project
// Replace the SVG path with your actual Flat Icon SVG path
export const IconExample: React.FC<IconProps> = ({ 
  className = '', 
  size = 24, 
  color = 'currentColor' 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Replace this with your Flat Icon SVG path */}
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
};

export default IconExample; 