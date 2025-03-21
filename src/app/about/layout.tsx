import React from 'react';

export const metadata = {
  title: 'About Us | Life Coach',
  description: 'Learn more about our coaching practice and our approach to helping clients achieve their goals.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 