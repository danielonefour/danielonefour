'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFeaturedBlogPosts } from '@/hooks/use-contentful';
import { Oval } from 'react-loader-spinner';
import { PaginatedResponse, BlogPost } from '@/lib/contentful';

import { FiCalendar, FiUser, FiChevronRight } from 'react-icons/fi';
import fallbackImage from '@/assets/images/about.png';

// Custom HoleButton component with a modern hover effect
const HoleButton = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-8 py-3 border-2 border-slate-900 text-slate-900 font-medium relative overflow-hidden transition-all duration-300 group hover:bg-slate-900 hover:text-white rounded-full"
    >
      <span className="relative z-10">{children}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 ml-3 transition-transform duration-300 ease-in-out group-hover:translate-x-1 relative z-10 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </Link>
  );
};

interface BlogSectionProps {
  initialPosts?: PaginatedResponse<BlogPost>;
}

const BlogSection = ({ initialPosts }: BlogSectionProps) => {
  const { data: blogData, isLoading, error } = useFeaturedBlogPosts(1, 6, {
    initialData: initialPosts,
    enabled: !initialPosts,
  });

  const posts = blogData?.items?.filter((post) => post.featured) || [];

  if (isLoading && !initialPosts) {
    return (
     <section className="py-24 md:py-36 bg-brand-yellow">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div>
              <div className="uppercase tracking-widest text-sm font-medium text-gray-500 mb-2">
                LATEST UPDATES
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                Blog & Articles
              </h2>
            </div>
          </div>
          <div className="flex justify-center items-center py-20">
            <Oval
              height={60}
              width={60}
              color="#3B82F6"
              secondaryColor="#BFDBFE"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        </div>
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section className="py-24 md:py-36 bg-brand-yellow">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div>
              <div className="uppercase tracking-widest text-sm font-medium text-gray-500 mb-2">
                LATEST UPDATES
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                Blog & Articles
              </h2>
            </div>
          </div>
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No featured blog posts available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16" data-aos="fade-up">
          <div>
            <div className="uppercase tracking-widest text-xs md:text-sm font-semibold text-gray-500 mb-3">
              LATEST UPDATES
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-brand-blue">
              Blog & Articles
            </h2>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-x-auto lg:overflow-visible scrollbar-hide -mx-6 md:-mx-8 lg:-mx-0 snap-x snap-mandatory">
            <div className="flex flex-nowrap lg:grid lg:grid-cols-3 gap-8 px-6 md:px-8 lg:px-0">
              {posts.map((post, index) => {
                 const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });

                 return (
                  <div
                    key={post.slug}
                    className="flex-shrink-0 w-80 lg:w-auto bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-slate-100 flex flex-col h-full transform hover:-translate-y-1 snap-center"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Link href={`/blog/${post.slug}`} className="block relative h-64 w-full overflow-hidden">
                      <Image 
                        src={post.featuredImage || fallbackImage} 
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors leading-tight line-clamp-2">
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
              })}
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default BlogSection;