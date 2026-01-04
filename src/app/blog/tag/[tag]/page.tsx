import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogCategories } from '@/lib/contentful';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import aboutImage from '@/assets/images/about.png';
import dynamic from 'next/dynamic';

// Dynamic import of client component
const ClientTagPage = dynamic(() => import('@/components/blog/ClientTagPage'), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

// Define revalidation period for ISR
export const revalidate = 3600; // Revalidate every hour

// Enable dynamic params for routes not generated at build time
export const dynamicParams = true;

// Generate static params for all unique tags at build time
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts(1, 100);
    
    // Collect all unique tags
    const allTags = new Set<string>();
    
    posts.items?.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          allTags.add(tag.toLowerCase().replace(/\s+/g, '-'));
        });
      }
    });
    
    console.log(`Generating static params for ${allTags.size} blog tags`);
    
    return Array.from(allTags).map(tag => ({
      tag,
    }));
  } catch (error) {
    console.error('Error generating static params for blog tags:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  
  // Format the tag name for display
  const tagName = tag
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return {
    title: `Posts Tagged: #${tagName} | Daniel One Four Blog`,
    description: `Explore our articles tagged with ${tagName} and discover valuable insights for your professional development.`,
  };
}

// Server component that passes data to the client component
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  try {
    const { tag: tagSlug } = await params;
    
    // Format tag name from slug
    const tagName = tagSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Create breadcrumbs
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: `Tag: ${tagName}`, href: `/blog/tag/${tagSlug}` },
    ];
    
    // Fetch data server-side
    const [allPostsResponse, allCategories] = await Promise.all([
      getAllBlogPosts(1, 100), // Get more posts to ensure we have enough after filtering
      getBlogCategories()
    ]);
    
    // Filter posts by tag
    const allPosts = allPostsResponse.items || [];
    const filteredPosts = allPosts.filter(post => 
      Array.isArray(post.tags) && post.tags.some(tag => 
        tag.toLowerCase().includes(tagName.toLowerCase()) ||
        tagName.toLowerCase().includes(tag.toLowerCase())
      )
    );
    
    return (
      <>
        <Header />
        <main>
          <PageHeader 
            title={`Posts Tagged: #${tagName}`}
            image={aboutImage}
            breadcrumbs={breadcrumbs}
          />
          
          <Suspense fallback={
            <div className="flex justify-center items-center py-16">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <ClientTagPage 
              initialPosts={filteredPosts}
              initialCategories={allCategories}
              tagName={tagName}
              tagSlug={tagSlug}
            />
          </Suspense>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Error in TagPage:', error);
    notFound();
  }
} 