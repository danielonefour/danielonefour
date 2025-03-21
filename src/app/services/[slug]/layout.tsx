import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Details | Life Coach',
  description: 'Learn more about our personalized coaching services designed to help you achieve your goals and transform your life.',
};

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 