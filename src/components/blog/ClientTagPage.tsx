'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Oval } from 'react-loader-spinner';
import { FiChevronRight, FiChevronLeft, FiMail, FiPhone, FiDownload, FiFilePlus, FiMessageCircle, FiAlertTriangle, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { BlogPost } from '@/lib/contentful';

// Import fallback image
import fallbackImage from '@/assets/images/blogs/blog-1.png';

interface ClientTagPageProps {
  initialPosts: BlogPost[];
  initialCategories: {name: string; count: number}[];
  tagName: string;
  tagSlug: string;
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

// Empty state component
const EmptyState = ({ tagName }: { tagName: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-gray-400 mb-4">
      <FiMessageCircle size={48} />
    </div>
    <h3 className="text-xl font-bold mb-2">No Blog Posts Found</h3>
    <p className="text-gray-600 mb-4">
      We couldn't find any blog posts with the tag "#{tagName}".
    </p>
    <Link 
      href="/blog"
      className="inline-block mt-4 bg-brand-blue text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
    >
      View All Blog Posts
    </Link>
  </div>
);

export default function ClientTagPage({ 
  initialPosts,
  initialCategories,
  tagName,
  tagSlug
}: ClientTagPageProps) {
  const router = useRouter();
  
  // If no posts found
  if (!initialPosts || initialPosts.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <EmptyState tagName={tagName} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog Posts Grid - Takes 3/4 of the space */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
          
          {/* Sidebar - Takes 1/4 of the space */}
          <div className="lg:col-span-1">
            {/* Blog Categories */}
            <div className="bg-gray-50 p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">Blog Categories</h3>
              <ul className="space-y-4">
                {initialCategories.map((category, index) => (
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
            </div>
            
            {/* Tags cloud */}
            <div className="bg-gray-50 p-8 mb-8">
              <h3 className="text-xl font-bold mb-6">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {initialPosts
                  .flatMap(post => post.tags || [])
                  .filter((tag, index, self) => self.indexOf(tag) === index)
                  .slice(0, 10)
                  .map((tag, index) => (
                    <Link 
                      key={index}
                      href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm transition-colors ${
                        tag.toLowerCase() === tagName.toLowerCase() ? 'bg-black text-white hover:bg-gray-800' : ''
                      }`}
                    >
                      #{tag}
                    </Link>
                  ))
                }
              </div>
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
            
            {/* How to Contact Section */}
            <Link href="/contact" className="block bg-gray-50 p-8 hover:bg-gray-100 transition-colors">
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