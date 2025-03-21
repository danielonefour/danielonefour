'use client';

import React from 'react';

interface FlatIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

/**
 * FlatIcon component for using Flaticon UI icons
 * 
 * @param icon - The icon name, e.g., 'home', 'user', 'settings'
 * @param size - The size of the icon: 'sm', 'md', 'lg', 'xl', '2xl', '3xl'
 * @param className - Additional CSS classes
 * 
 * @example
 * // Regular style icon
 * <FlatIcon icon="home" size="lg" />
 * 
 * // Solid style icon
 * <FlatIcon icon="home-s" size="lg" />
 * 
 * // Brand icon
 * <FlatIcon icon="github-brand" size="lg" />
 */
const FlatIcon: React.FC<FlatIconProps> = ({ 
  icon, 
  size = 'md', 
  className = '' 
}) => {
  // Determine the size class
  const sizeClass = {
    'sm': 'fi-size-sm',
    'md': 'fi-size-md',
    'lg': 'fi-size-lg',
    'xl': 'fi-size-xl',
    '2xl': 'fi-size-2xl',
    '3xl': 'fi-size-3xl',
  }[size];

  // Determine the icon class
  let iconClass = '';
  
  // Regular icons
  if (icon.includes('-r') || (!icon.includes('-s') && !icon.includes('-brand'))) {
    iconClass = `fi fi-rr-${icon.replace('-r', '')}`;
  }
  // Solid icons
  else if (icon.includes('-s')) {
    iconClass = `fi fi-sr-${icon.replace('-s', '')}`;
  }
  // Brand icons
  else if (icon.includes('-brand')) {
    iconClass = `fi fi-brands-${icon.replace('-brand', '')}`;
  }

  return (
    <i className={`${iconClass} ${sizeClass} ${className}`}></i>
  );
};

export default FlatIcon; 