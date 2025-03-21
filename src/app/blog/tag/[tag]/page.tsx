'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Oval } from 'react-loader-spinner';
import { FiAlertTriangle, FiCalendar, FiUser, FiTag } from 'react-icons/fi';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { getAllBlogPosts, getBlogCategories, BlogPost } from '@/lib/contentful';

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
    <p className="mt-4 text-gray-600">Loading blog posts...</p>
  </div>
);

// Error state component
const ErrorState = ({ error, retry }: { error: string; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-red-500 mb-4">
      <FiAlertTriangle size={48} />
    </div>
    <h3 className="text-xl font-bold mb-2">Error Loading Blog Posts</h3>
    <p className="text-gray-600 mb-6">{error}</p>
    <button 
      onClick={retry}
      className="bg-brand-blue text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Empty state component
const EmptyState = ({ tag }: { tag: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-gray-400 mb-4">
      <FiTag size={48} />
    </div>
    <h3 className="text-xl font-bold mb-2">No Posts Found</h3>
    <p className="text-gray-600 mb-6">
      There are no blog posts with the tag "#{tag}" yet.
    </p>
    <Link 
      href="/blog"
      className="bg-brand-blue text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
    >
      View All Posts
    </Link>
  </div>
);

// Blog card component
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
        
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-block text-brand-blue font-medium hover:underline"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

// Pagination component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-full ${
              currentPage === page
                ? 'bg-brand-blue text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default function TagPage() {
  const router = useRouter();
  const params = useParams();
  const tagSlug = params.tag as string;
  const tagName = tagSlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{name: string; count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Fetch blog posts and categories
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all blog posts and categories concurrently
      const [allPosts, allCategories] = await Promise.all([
        getAllBlogPosts(),
        getBlogCategories()
      ]);
      
      // Filter posts by tag
      const filteredPosts = allPosts.filter(post => 
        post.tags.some(tag => 
          tag.toLowerCase() === tagName.toLowerCase()
        )
      );
      
      setPosts(filteredPosts);
      setCategories(allCategories);
    } catch (err) {
      console.error('Error fetching blog data:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [tagSlug]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: `Tag: ${tagName}`, href: `/blog/tag/${tagSlug}` },
  ];
  
  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title={`Posts Tagged: #${tagName}`}
          image={aboutImage}
          breadcrumbs={breadcrumbs}
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Column - Blog Posts */}
              <div className="lg:w-2/3">
                {isLoading ? (
                  <LoadingState />
                ) : error ? (
                  <ErrorState error={error} retry={fetchData} />
                ) : posts.length === 0 ? (
                  <EmptyState tag={tagName} />
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-8">
                      {currentPosts.map((post, index) => (
                        <BlogCard key={index} post={post} />
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </div>
              
              {/* Right Column - Categories & Contact */}
              <div className="lg:w-1/3">
                {/* Blog Categories */}
                <div className="bg-header-bg p-8 mb-8">
                  <h3 className="text-xl font-bold mb-6">Blog Categories</h3>
                  
                  {isLoading ? (
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
                      {categories.map((category, index) => (
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
                  <h3 className="text-xl font-bold mb-6">Current Tag</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-brand-blue text-white rounded-full text-sm">
                      #{tagName}
                    </span>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-6">Get In Touch With Us</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="mr-2">📧</span>
                        <span className="font-medium">Info@Example.Com</span>
                      </div>
                      <p className="text-gray-600 pl-6">Contact@Example.Com</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="mr-2">📞</span>
                        <span className="font-medium">+668 66 448 6452 99</span>
                      </div>
                      <p className="text-gray-600 pl-6">+7896 875 987 54</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 