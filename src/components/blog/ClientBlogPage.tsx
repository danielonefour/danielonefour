'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Oval } from 'react-loader-spinner';
import { FiChevronRight, FiChevronLeft, FiMail, FiPhone, FiDownload, FiFilePlus, FiMessageCircle, FiAlertTriangle, FiCalendar, FiUser } from 'react-icons/fi';
import { BlogPost, PaginatedResponse } from '@/lib/contentful';
import { useAllBlogPosts, useBlogCategories, Category } from '@/hooks/use-contentful';

// Import fallback image
import fallbackImage from '@/assets/images/blogs/blog-1.png';

interface ClientBlogPageProps {
  initialBlogData: PaginatedResponse<BlogPost>;
  currentPage: number;
  perPage: number;
}

// Blog Post Card Component
const BlogCard = ({ post }: { post: BlogPost }) => {
  // Format the date
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-60 w-full">
          <Image 
            src={post.featuredImage || fallbackImage} 
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <FiCalendar className="mr-2" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center">
            <FiUser className="mr-2" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-3 hover:text-brand-blue transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-block text-brand-blue font-medium hover:underline"
          >
            Read More
          </Link>
          
          <Link
            href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
          >
            {post.category}
          </Link>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ 
  totalPages, 
  currentPage, 
  onPageChange 
}: { 
  totalPages: number; 
  currentPage: number; 
  onPageChange: (page: number) => void 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust start and end to always show 3 pages
      if (start === 2) end = Math.min(4, totalPages - 1);
      if (end === totalPages - 1) start = Math.max(2, totalPages - 3);
      
      // Add ellipsis after first page if needed
      if (start > 2) pages.push(-1); // -1 represents ellipsis
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) pages.push(-2); // -2 represents ellipsis
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-12">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 mr-2 disabled:opacity-50"
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>
      
      {getPageNumbers().map((page, index) => {
        if (page < 0) {
          // Render ellipsis
          return (
            <span key={`ellipsis-${index}`} className="h-10 px-2 flex items-center justify-center mx-1">
              ...
            </span>
          );
        }
        
        return (
          <button 
            key={page} 
            onClick={() => onPageChange(page)}
            className={`h-10 w-10 rounded-full flex items-center justify-center mx-1 ${
              currentPage === page 
                ? 'bg-black text-white' 
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 rounded-full flex items-center justify-center border border-gray-300 ml-2 disabled:opacity-50"
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

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
    <p className="mt-4 text-gray-600">Loading blog posts...</p>
  </div>
);

// Error state component
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-red-500 mb-4">
      <FiAlertTriangle size={48} />
    </div>
    <h3 className="text-xl font-bold mb-2">Error Loading Blog Posts</h3>
    <p className="text-gray-600 mb-6">{error}</p>
    <button 
      onClick={onRetry}
      className="bg-brand-blue text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-gray-400 mb-4">
      <FiMessageCircle size={48} />
    </div>
    <h3 className="text-xl font-bold mb-2">No Blog Posts Found</h3>
    <p className="text-gray-600 mb-4">We haven't published any articles yet.</p>
    <p className="text-gray-600">Check back soon for new content!</p>
  </div>
);

export default function ClientBlogPage({ 
  initialBlogData, 
  currentPage,
  perPage
}: ClientBlogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use React Query with initialData for instant loading
  const { 
    data: blogResponse = initialBlogData,
    error: blogError,
    isLoading: isBlogLoading,
    refetch: refetchBlog
  } = useAllBlogPosts(currentPage, perPage);
  
  const {
    data: categories = [],
    isLoading: isCategoriesLoading
  } = useBlogCategories();
  
  // Calculate total pages
  const totalPages = Math.ceil(blogResponse.total / perPage);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    router.push(`/blog?${params.toString()}`);
    
    // Scroll to top of the blog section
    window.scrollTo({
      top: document.getElementById('blog-section')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };
  
  // Handle retry
  const handleRetry = () => {
    refetchBlog();
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    router.push(`/blog?${params.toString()}`);
  };
  
  // Render blog content based on loading/error state
  const renderBlogContent = () => {
    if (isBlogLoading) {
      return <LoadingState />;
    }
    
    if (blogError) {
      return <ErrorState error={(blogError as Error).message} onRetry={handleRetry} />;
    }
    
    if (blogResponse.items.length === 0) {
      return <EmptyState />;
    }
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogResponse.items.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination 
            totalPages={totalPages} 
            currentPage={currentPage} 
            onPageChange={handlePageChange} 
          />
        )}
      </>
    );
  };

  return (
    <section id="blog-section" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column - Blog Posts */}
          <div className="lg:w-2/3">
            {renderBlogContent()}
          </div>

          {/* Right Column - Categories & Contact */}
          <div className="lg:w-1/3">
            {/* Blog Categories */}
            <div className="bg-header-bg p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">Blog Categories</h3>
              
              {isCategoriesLoading ? (
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
              ) : categories.length === 0 ? (
                <p className="text-gray-600 text-center py-2">No categories found</p>
              ) : (
                <ul className="space-y-4">
                  {categories.map((category: Category, index: number) => (
                    <li key={index} className="flex justify-between items-center">
                      <Link 
                        href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                        className="hover:font-bold transition-all"
                      >
                        {category.name}
                      </Link>
                      <span className="text-gray-700">{category.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Popular Tags */}
            <div className="bg-gray-50 p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">Popular Tags</h3>
              
              {isBlogLoading ? (
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
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(
                      blogResponse.items.flatMap(post => post.tags)
                    )
                  ).slice(0, 10).map((tag, index) => (
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
  );
} 