'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFeaturedBlogPosts } from '@/hooks/use-contentful';
import { Oval } from 'react-loader-spinner';
import { PaginatedResponse, BlogPost } from '@/lib/contentful';

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
      <section className="py-24 md:py-36 bg-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
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
      <section className="py-24 md:py-36 bg-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
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
<section className="py-12 md:py-20 bg-brand-yellow">
  <div className="container mx-auto px-6 max-w-7xl">
    <div className="flex flex-col md:flex-row justify-between items-start mb-8">
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
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex-shrink-0 w-80 lg:w-auto flex flex-col rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 snap-center"
            >
              <div className="relative h-60 w-full overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600">No image available</span>
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="text-sm font-medium text-gray-500 mb-2">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                <h3 className="text-2xl font-semibold mb-4 line-clamp-2 text-gray-900 hover:text-indigo-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-gray-600 mb-6 flex-grow overflow-hidden line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center px-6 py-3 rounded-full border-2 border-brand-blue text-brand-blue font-medium transition-all duration-300 hover:bg-brand-blue hover:text-white hover:shadow-lg group"
                  >
                    <span className="relative z-10">Read More</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-3 transition-transform duration-300 ease-in-out group-hover:translate-x-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default BlogSection;