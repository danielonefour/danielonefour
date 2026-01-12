'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Oval } from 'react-loader-spinner';
import { FiChevronRight, FiChevronLeft, FiMail, FiPhone, FiDownload, FiFilePlus, FiMessageCircle, FiAlertTriangle, FiCalendar, FiUser } from 'react-icons/fi';
import { BlogPost, PaginatedResponse } from '@/lib/contentful';
import { useBlogPostsByCategory, Category } from '@/hooks/use-contentful';

// Import fallback image
import fallbackImage from '@/assets/images/blogs/blog-1.png';

interface ClientCategoryPageProps {
  initialBlogData: PaginatedResponse<BlogPost>;
  initialCategories: Category[];
  category: string;
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
const EmptyState = ({ categoryDisplay }: { categoryDisplay: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-gray-400 mb-4">
      <FiMessageCircle size={48} />
    </div>
    <h3 className="text-xl font-bold mb-2">No Blog Posts Found</h3>
    <p className="text-gray-600 mb-4">
      We couldn't find any blog posts in the category "{categoryDisplay}".
    </p>
    <Link 
      href="/blog"
      className="inline-block mt-4 bg-brand-blue text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
    >
      View All Blog Posts
    </Link>
  </div>
);

export default function ClientCategoryPage({ 
  initialBlogData,
  initialCategories,
  category,
  currentPage,
  perPage
}: ClientCategoryPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Format the category for display and for query
  const categoryDisplay = category
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  console.log('Client-side category param:', category);
  console.log('Formatted for display:', categoryDisplay);
  
  // Use React Query with initialData for instant loading
  const { 
    data: blogResponse = initialBlogData,
    error: blogError,
    isLoading: isBlogLoading,
    refetch: refetchBlog
  } = useBlogPostsByCategory(category, currentPage, perPage);
  
  // Calculate total pages
  const totalPages = Math.ceil(blogResponse.total / perPage);
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    router.push(`/blog/category/${category}?${params.toString()}`);
    
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
    router.push(`/blog/category/${category}?${params.toString()}`);
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
      return <EmptyState categoryDisplay={categoryDisplay} />;
    }
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column - Blog Posts */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold mb-8">
              Blog Posts in {categoryDisplay}
            </h2>
            {renderBlogContent()}
          </div>

          {/* Right Column - Categories & Contact */}
          <div className="lg:w-1/3">
            {/* Blog Categories */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-brand-orange rounded-full"></div>
                <h3 className="text-xl font-bold text-slate-900">Categories</h3>
              </div>
              
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
              ) : initialCategories.length === 0 ? (
                <p className="text-slate-500 text-center py-2 italic">No categories found</p>
              ) : (
                <ul className="space-y-3">
                  {initialCategories.map((cat: Category, index: number) => (
                    <li key={index}>
                      <Link 
                        href={`/blog/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} 
                        className={`flex justify-between items-center group py-2 border-b border-transparent hover:border-slate-100 transition-all ${
                          cat.name.toLowerCase() === categoryDisplay.toLowerCase() ? 'text-brand-orange font-bold' : 'text-slate-600 hover:text-brand-blue'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                           cat.name.toLowerCase() === categoryDisplay.toLowerCase() ? 'bg-brand-orange/10 text-brand-orange' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-blue/10 group-hover:text-brand-blue'
                        }`}>{cat.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-brand-orange rounded-full"></div>
                <h3 className="text-xl font-bold text-slate-900">Popular Tags</h3>
              </div>
              
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
                      className="px-4 py-2 bg-slate-50 hover:bg-brand-blue hover:text-white text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 border border-slate-100"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-brand-blue p-8 rounded-3xl shadow-lg mb-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
               <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">Get In Touch</h3>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center mb-1 text-brand-yellow font-medium">
                      <FiMail className="mr-3" />
                      <span>Email Us</span>
                    </div>
                    <p className="pl-7 text-white/90 text-sm break-all">info@danielonefour.com</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1 text-brand-yellow font-medium">
                      <FiPhone className="mr-3" />
                      <span>Call Us</span>
                    </div>
                    <p className="pl-7 text-white/90 text-sm">+668 66 448 6452 99</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-4 mb-8">
              <Link href="#" className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                     <FiDownload className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Download</p>
                    <p className="font-bold text-slate-900">Brochure</p>
                  </div>
                </div>
              </Link>
              
              <Link href="#" className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:bg-brand-yellow group-hover:text-slate-900 transition-colors">
                    <FiFilePlus className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Latest</p>
                    <p className="font-bold">Articles</p>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* How to Contact Section */}
            <Link href="/contact" className="block bg-brand-yellow p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiMessageCircle className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">Start Your<br />Journey</h3>
              </div>
              <p className="text-slate-800 font-medium text-sm leading-relaxed mb-4">
                Ready to transform your leadership skills? Get in touch with our team today.
              </p>
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-0.5">
                Contact Us <FiChevronRight className="ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 