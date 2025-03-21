'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import logoBlack from '@/assets/images/logo-black.png';

interface LogoWithFallbackProps {
  width?: number;
  height?: number;
  className?: string;
}

const LogoWithFallback: React.FC<LogoWithFallbackProps> = ({
  width = 112,
  height = 40,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`relative h-10 w-28 ${className}`}>
      {!imageError ? (
        <Image
          src={logoBlack}
          alt="Dasan Logo"
          fill
          style={{ objectFit: 'contain', objectPosition: 'left' }}
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex items-center justify-start h-full">
          <span className="text-xl font-bold text-black">Dasan</span>
        </div>
      )}
    </div>
  );
};

export default LogoWithFallback; 