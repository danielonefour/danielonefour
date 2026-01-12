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
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-slate-100 flex flex-col h-full transform hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block relative h-64 w-full overflow-hidden">
        <Image 
          src={post.featuredImage || fallbackImage} 
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
         <div className="absolute top-4 left-4">
           <span className="bg-white/90 backdrop-blur-sm text-brand-blue px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
             {post.category}
           </span>
         </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4 uppercase tracking-wide">
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-brand-orange" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center">
            <FiUser className="mr-2 text-brand-orange" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <Link href={`/blog/${post.slug}`} className="block mb-3">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors leading-tight">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center bg-white">
          <Link 
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-brand-blue font-bold hover:text-brand-orange transition-colors gap-2 group/link"
          >
            Read Article
             <FiChevronRight className="transition-transform group-hover/link:translate-x-1" />
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
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
            {renderBlogContent()}
          </div>

            {/* Right Column - Categories & Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Blog Categories */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
                Categories
              </h3>
              
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
                    <li key={index}>
                      <Link 
                        href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                        className="flex justify-between items-center group py-2 border-b border-transparent hover:border-slate-100 transition-all"
                      >
                        <span className="text-slate-600 group-hover:text-brand-blue group-hover:font-semibold transition-colors">
                          {category.name}
                        </span>
                        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <span className="w-8 h-1 bg-brand-blue rounded-full"></span>
                 Popular Tags
              </h3>
              
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
                      className="px-4 py-2 bg-slate-50 hover:bg-brand-blue hover:text-white text-slate-600 rounded-xl text-sm font-medium transition-all duration-300"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Downloads / CTA */}
            <div className="grid grid-cols-1 gap-4">
              <Link href="#" className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl hover:bg-brand-blue transition-colors group shadow-lg">
                <div className="flex items-center">
                  <div className="p-3 bg-white/10 rounded-2xl mr-4 group-hover:bg-white/20 transition-colors">
                     <FiDownload className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-bold">Download</p>
                    <p className="font-bold text-lg">Our Brochure</p>
                  </div>
                </div>
                <div className="text-2xl opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</div>
              </Link>
            </div>
            
            {/* Contact CTA */}
            <div className="bg-brand-orange p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-2">Have Questions?</h3>
                 <p className="text-white/90 mb-6 text-sm leading-relaxed">
                   Get in touch with our team today to discuss your coaching needs.
                 </p>
                 <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-brand-orange px-6 py-3 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all shadow-md">
                   Contact Us
                   <FiMessageCircle />
                 </Link>
               </div>
               {/* Decorative background circles */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 