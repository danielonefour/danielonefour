'use client';

import React from 'react';
import Link from 'next/link';

interface HoleButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  primaryColor?: string;
  bgColorClass?: string;
}

const HoleButton: React.FC<HoleButtonProps> = ({
  children,
  href,
  className = '',
  onClick,
  primaryColor,
  bgColorClass = 'bg-brand-orange',
}) => {
  // Base styles for the button with the hole effect
  const baseStyles = 'hole-button inline-flex items-center px-6 py-2.5 bg-brand-blue text-white font-medium relative';
  
  // Apply custom styles
  const buttonStyle: React.CSSProperties = {
    '--primary-color': primaryColor || 'var(--header-bg-color)',
    '--hole-bg-color': `var(--${bgColorClass.replace('bg-', '')}-color)`,
  } as React.CSSProperties;
  
  // Add custom CSS for the hole effect
  React.useEffect(() => {
    // Only add the style once
    if (!document.getElementById('hole-button-style')) {
      const style = document.createElement('style');
      style.id = 'hole-button-style';
      style.innerHTML = `
        :root {
          --light-gray-color: #f8f8f8;
          --header-bg-color: #e0f2fe;
        }
        .hole-button::after {
          background-color: var(--hole-bg-color, #f8f8f8) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${className}`} style={buttonStyle} prefetch={true}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={`${baseStyles} ${className}`} onClick={onClick} style={buttonStyle}>
      {children}
    </button>
  );
};

export default HoleButton; 