import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  width = 120, 
  height = 40 
}) => {
  return (
    <div className={className}>
      {/* 
        Replace '/logo.png' with your actual logo file path once you add it to the public folder
        or use the new app directory asset handling with the import statement below
      */}
      {/* 
        import logoImage from '@/assets/images/logo.png';
        <Image src={logoImage} alt="Logo" width={width} height={height} />
      */}
      <Image 
        src="/logo.png" 
        alt="Logo" 
        width={width} 
        height={height} 
        priority
      />
    </div>
  );
};

export default Logo; 