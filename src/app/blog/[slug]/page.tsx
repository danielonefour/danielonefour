'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { FiChevronRight, FiChevronLeft, FiMail, FiPhone, FiDownload, FiFilePlus, FiMessageCircle, FiCalendar, FiUser, FiTag, FiAlertTriangle } from 'react-icons/fi';
import { Oval } from 'react-loader-spinner';
import { getBlogPostBySlug, getAllBlogPosts, getBlogCategories, BlogPost } from '@/lib/contentful';
import { remark } from 'remark';
import html from 'remark-html';

// Import fallback image
import fallbackImage from '@/assets/images/blogs/blog-1.png';
import aboutImage from '@/assets/images/about.png';

// Loading state component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <Oval
      height={60}
      width={60}
      color="#1699C1"
      secondaryColor="#e0f2fe"
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
    <p className="mt-4 text-gray-600">Loading blog post...</p>
  </div>
);

// Error state component
const ErrorState = ({ error }: { error: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-red-500 mb-4">
      <FiAlertTriangle size={48} />
    </div>
    <h3 className="text-xl font-bold mb-2">Error Loading Blog Post</h3>
    <p className="text-gray-600 mb-6">{error}</p>
    <Link 
      href="/blog"
      className="bg-brand-blue text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
    >
      Back to Blog
    </Link>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-gray-400 mb-4">
      <FiMessageCircle size={48} />
    </div>
    <h3 className="text-xl font-bold mb-2">Blog Post Not Found</h3>
    <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or may have been removed.</p>
    <Link 
      href="/blog"
      className="bg-brand-blue text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
    >
      Back to Blog
    </Link>
  </div>
);

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{name: string; count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentHtml, setContentHtml] = useState('');
  const [navPosts, setNavPosts] = useState<{prev: BlogPost | null, next: BlogPost | null}>({
    prev: null,
    next: null
  });
  
  // Fetch blog post data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the blog post by slug
        const blogPost = await getBlogPostBySlug(slug);
        
        if (!blogPost) {
          setIsLoading(false);
          return; // Post not found will show empty state
        }
        
        // Process Markdown to HTML
        const processedContent = await remark()
          .use(html)
          .process(blogPost.content);
        
        setContentHtml(processedContent.toString());
        setPost(blogPost);
        
        // Fetch all posts and categories concurrently for related posts and navigation
        const [allPosts, allCategories] = await Promise.all([
          getAllBlogPosts(),
          getBlogCategories()
        ]);
        
        // Set the categories
        setCategories(allCategories);
        
        // Find related posts (same category, excluding current post)
        const related = allPosts?.items?.filter(p => p.category === blogPost.category && p.id !== blogPost.id)
          .slice(0, 2);
        
        setRelatedPosts(related);
        
        // Set up navigation posts
        const currentPostIndex = allPosts?.items?.findIndex(p => p.slug === slug);
        
        if (currentPostIndex !== -1) {
          setNavPosts({
            prev: currentPostIndex > 0 ? allPosts?.items[currentPostIndex - 1] : allPosts?.items[allPosts?.items?.length - 1],
            next: currentPostIndex < allPosts?.items?.length - 1 ? allPosts?.items[currentPostIndex + 1] : allPosts?.items[0]
          });
        }
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchData();
    }
  }, [slug]);
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post?.title || 'Blog Post', href: `/blog/${slug}` },
  ];

  // Render content based on loading/error/empty state
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState error={error} />;
    }
    
    if (!post) {
      return <EmptyState />;
    }
    
    // Format the date
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <>
        <div className="relative mb-8">
          <Image 
            src={post.featuredImage || fallbackImage} 
            alt={post.title}
            width={800}
            height={500} 
            className="w-full h-[400px] object-cover rounded-md"
            priority
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center">
            <FiCalendar className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center">
            <FiUser className="mr-2" />
            <span>By {post.author}</span>
          </div>
          
          <div className="flex items-center">
            <FiTag className="mr-2" />
            <span>{post.category}</span>
          </div>
        </div>

        <div 
          className="prose prose-lg max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag, index) => (
              <Link 
                key={index}
                href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Author Bio */}
        <div className="bg-gray-50 p-6 rounded-md mb-10">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
              {/* Placeholder for author image */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                {post.author.split(' ').map(name => name[0]).join('')}
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-2">{post.author}</h4>
              <p className="text-gray-700">
                Professional coach and writer with expertise in {post.category.toLowerCase()}. 
                Committed to helping professionals achieve their full potential through 
                practical guidance and strategic insights.
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {(navPosts.prev || navPosts.next) && (
          <div className="flex items-center mt-16 py-8 border-t border-gray-200">
            {navPosts.prev && (
              <div className="w-1/2 flex items-center">
                <Link href={`/blog/${navPosts.prev.slug}`} className="group flex items-center">
                  <FiChevronLeft className="mr-2 text-xl" />
                  <span className="text-xl font-medium">{navPosts.prev.title}</span>
                </Link>
              </div>
            )}
            
            {navPosts.prev && navPosts.next && (
              <div className="h-10 w-px bg-gray-300 mx-4"></div>
            )}
            
            {navPosts.next && (
              <div className="w-1/2 flex items-center justify-end">
                <Link href={`/blog/${navPosts.next.slug}`} className="group flex items-center">
                  <span className="text-xl font-medium">{navPosts.next.title}</span>
                  <FiChevronRight className="ml-2 text-xl" />
                </Link>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  // Render categories based on loading state
  const renderCategories = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-4">
          <Oval
            height={30}
            width={30}
            color="#1699C1"
            secondaryColor="#e0f2fe"
            strokeWidth={4}
            strokeWidthSecondary={4}
          />
        </div>
      );
    }
    
    if (categories.length === 0) {
      return <p className="text-gray-600 text-center py-2">No categories found</p>;
    }
    
    return (
      <ul className="space-y-4">
        {categories.map((category, index) => (
          <li key={index} className="flex justify-between items-center">
            <Link 
              href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
              className={`hover:font-bold transition-all ${
                post?.category === category.name ? 'font-bold' : ''
              }`}
            >
              {category.name}
            </Link>
            <span className="text-gray-700">{category.count}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Render related posts based on loading state
  const renderRelatedPosts = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-4">
          <Oval
            height={30}
            width={30}
            color="#1699C1"
            secondaryColor="#e0f2fe"
            strokeWidth={4}
            strokeWidthSecondary={4}
          />
        </div>
      );
    }
    
    if (relatedPosts.length === 0) {
      return <p className="text-gray-600 text-center py-2">No related posts found</p>;
    }
    
    return (
      <div className="space-y-6">
        {relatedPosts.map((relatedPost, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-20 h-20 flex-shrink-0">
              <Image 
                src={relatedPost.featuredImage || fallbackImage} 
                alt={relatedPost.title}
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div>
              <Link href={`/blog/${relatedPost.slug}`} className="font-medium hover:text-primary transition-colors">
                {relatedPost.title}
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(relatedPost.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title={post?.title || 'Blog Post'} 
          image={aboutImage}
          breadcrumbs={breadcrumbs}
        />

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Column - Blog Post Content */}
              <div className="lg:w-2/3">
                {renderContent()}
              </div>

              {/* Right Column - Categories & Contact */}
              <div className="lg:w-1/3">
                {/* Blog Categories */}
                <div className="bg-header-bg p-8 mb-8">
                  <h3 className="text-xl font-bold mb-6">Blog Categories</h3>
                  {renderCategories()}
                </div>

                {/* Related Posts */}
                <div className="bg-gray-50 p-8 mb-8">
                  <h3 className="text-xl font-bold mb-6">Related Posts</h3>
                  {renderRelatedPosts()}
                </div>

                {/* Contact Info */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-6">Get In Touch With Us</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <FiMail className="mr-2" />
                        <span className="font-medium">Info@Example.Com</span>
                      </div>
                      <p className="text-gray-600 pl-6">Contact@Example.Com</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <FiPhone className="mr-2" />
                        <span className="font-medium">+668 66 448 6452 99</span>
                      </div>
                      <p className="text-gray-600 pl-6">+7896 875 987 54</p>
                    </div>
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="space-y-4 mb-8">
                  <Link href="#" className="flex items-center justify-between p-6 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <FiDownload className="mr-4 text-xl" />
                      <div>
                        <p className="font-medium">Download</p>
                        <p>Brochure</p>
                      </div>
                    </div>
                    <div className="text-3xl">↓</div>
                  </Link>
                  
                  <Link href="#" className="flex items-center justify-between p-6 bg-black text-white">
                    <div className="flex items-center">
                      <FiFilePlus className="mr-4 text-xl" />
                      <div>
                        <p className="font-medium">Latest</p>
                        <p>Articles</p>
                      </div>
                    </div>
                    <div className="text-3xl">↓</div>
                  </Link>
                </div>
                
                {/* How to Contact Section */}
                <Link href="/contact" className="block bg-header-bg p-8 hover:bg-header-bg/80 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                      <FiMessageCircle className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-bold">How can I contact<br />Daniel-One-Four</h3>
                  </div>
                  <p className="text-gray-700">
                    Get in touch with our team today to discuss your coaching needs and discover how we can help you achieve your goals.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 