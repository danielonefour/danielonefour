import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts, getBlogCategories } from '@/lib/contentful';
import dynamic from 'next/dynamic';

// Dynamic import of the client component
const ClientBlogPostPage = dynamic(() => import('@/components/blog/ClientBlogPostPage'), {
  ssr: true,
  loading: () => (
    <div className="flex justify-center items-center min-h-[500px]">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

// Define revalidation period for ISR
export const revalidate = 3600; // Revalidate every hour

// Enable dynamic params for routes not generated at build time
export const dynamicParams = true;

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  try {
    const allPosts = await getAllBlogPosts();
    console.log(`Generating static params for ${allPosts.items.length} blog posts`);
    
    return allPosts.items.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }
  
  return {
    title: `${post.title} | Daniel One Four Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
    },
  };
}

// Server component that passes data to the client component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    
    // Fetch all required data on the server
    const [post, allPosts, categories] = await Promise.all([
      getBlogPostBySlug(slug),
      getAllBlogPosts(),
      getBlogCategories()
    ]);
    
    if (!post) {
      notFound();
    }
    
    // Find related posts (same category, excluding current post)
    const relatedPosts = allPosts.items.filter(p => 
      p.category === post.category && p.id !== post.id
    ).slice(0, 2);
    
    // Set up navigation posts
    const currentPostIndex = allPosts.items.findIndex(p => p.slug === slug);
    const navPosts = {
      prev: currentPostIndex > 0 ? allPosts.items[currentPostIndex - 1] : null,
      next: currentPostIndex < allPosts.items.length - 1 ? allPosts.items[currentPostIndex + 1] : null
    };
    
    // Pass all data to the client component
    return (
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <ClientBlogPostPage 
          post={post} 
          relatedPosts={relatedPosts} 
          categories={categories} 
          navPosts={navPosts} 
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in BlogPostPage:', error);
    notFound();
  }
} 