import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Post | Daniel One Four',
  description: 'Read our detailed articles about coaching and personal development.',
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 