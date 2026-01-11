import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBlogPosts } from '@/lib/contentful';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';

import ClientBlogPage from '@/components/blog/ClientBlogPage';

export const metadata: Metadata = {
  title: 'Blog | Daniel One Four Coaching',
  description: 'Explore our coaching insights and professional development articles.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const awaitedSearchParams = await searchParams;
  // Get the current page from the URL
  const pageParam = awaitedSearchParams?.page;
  const currentPage = pageParam 
    ? parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam) 
    : 1;
  const perPage = 9;
  
  // Fetch initial blog data on the server for SEO and initial load
  const initialBlogData = await getAllBlogPosts(currentPage, perPage);
  
  if (!initialBlogData) {
    notFound();
  }
  
  // Create breadcrumbs for the blog page
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title="Our Blog" 
          image="/images/author/leader-chess.jpg"
          breadcrumbs={breadcrumbs}
        />
        
        <ClientBlogPage 
          initialBlogData={initialBlogData} 
          currentPage={currentPage} 
          perPage={perPage} 
        />
      </main>
      <Footer />
    </>
  );
} 