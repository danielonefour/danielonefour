import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Life Coach',
  description: 'Get in touch with our coaching experts. We\'re here to answer your questions and help you achieve your goals.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 