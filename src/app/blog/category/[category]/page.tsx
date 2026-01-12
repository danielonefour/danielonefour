import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostsByCategory, getBlogCategories } from '@/lib/contentful';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import aboutImage from '@/assets/images/about.png';
import ClientCategoryPage from '@/components/blog/ClientCategoryPage';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  
  if (!category) {
    return {
      title: 'Category Not Found | Daniel One Four Coaching',
      description: 'The requested blog category could not be found.',
    };
  }
  
  // Format the category name for display
  const categoryTitle = category
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return {
    title: `${categoryTitle} Articles | Daniel One Four Coaching`,
    description: `Explore our articles about ${categoryTitle} and discover insights that can help your professional development.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const awaitedSearchParams = await searchParams;
  
  if (!category) {
    console.error('Category parameter is missing in CategoryPage');
    return notFound();
  }
  
  const pageParam = awaitedSearchParams?.page;
  const currentPage = pageParam 
    ? parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam) 
    : 1;
  const perPage = 9;
  
  console.log('Server-side category param:', category);

  try {
    
    // Create breadcrumbs for the category page
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { 
        label: category
          .replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '), 
        href: `/blog/category/${category}` 
      },
    ];
    
    // Format the category name for display
    const categoryTitle = category
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

      console.log('category in categoryTitle ...', categoryTitle)

      // Fetch initial blog data on the server for SEO and initial load
      const [initialBlogData, categories] = await Promise.all([
        getBlogPostsByCategory(categoryTitle, currentPage, perPage),
        getBlogCategories()
      ]);

    return (
      <>
        <Header />
        <main>
          <PageHeader 
            title={`${categoryTitle} Articles`}
            image="/images/author/leader-chess.jpg"
            breadcrumbs={breadcrumbs}
            titleClassName="text-3xl md:text-5xl lg:text-6xl"
          />
          
          <ClientCategoryPage 
            initialBlogData={initialBlogData} 
            initialCategories={categories}
            category={category}
            currentPage={currentPage}
            perPage={perPage}
          />
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    return notFound();
  }
}

export const revalidate = 3600; // Revalidate every hour

export const dynamicParams = true;

// Generate static params for all categories at build time
export async function generateStaticParams() {
  try {
    const categories = await getBlogCategories();
    console.log(`Generating static params for ${categories.length} blog categories`);
    
    return categories.map((category) => ({
      category: category.name.toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch (error) {
    console.error('Error generating static params for blog categories:', error);
    return [];
  }
} 