'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFeaturedBlogPosts } from '@/hooks/use-contentful';
import { Oval } from 'react-loader-spinner';

// Custom HoleButton component with hover effect
const HoleButton = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link 
      href={href} 
      className="hole-button-blog inline-flex items-center px-8 py-2.5 border border-black text-black font-medium relative hover:bg-black hover:text-white transition-colors group w-[180px]"
    >
      {children}
      <span className="absolute top-1/2 right-4 w-3 h-3 rounded-full bg-black transform -translate-y-1/2 group-hover:bg-[#f1f1f1] transition-colors"></span>
    </Link>
  );
};

const BlogSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState<number[]>([0, 1, 2]);
  const postsPerPage = 3; // Show 3 posts at a time
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch blog posts from Contentful - explicitly getting only featured posts
  const { data: blogData, isLoading, error } = useFeaturedBlogPosts(1, 6); // Get up to 6 featured posts
  
  const posts = blogData?.items?.length ? 
    // Make sure we only include posts that are marked as featured
    blogData.items
      .filter(post => post.featured)
      .map((post, index) => {
        // For the image, use the featuredImage from Contentful or a fallback
        const imageUrl = post.featuredImage;
        
        return {
          title: post.title,
          excerpt: post.excerpt,
          image: imageUrl,
          date: new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          slug: post.slug,
        };
      }) : 
    [];
  
  const totalPosts = posts.length;
  
  // Calculate total slides based on posts per page
  const totalSlides = Math.max(1, Math.ceil(totalPosts / postsPerPage));

  // Handle next slide
  const nextSlide = () => {
    if (totalSlides <= 1) return; // Don't slide if we only have one slide
    
    const newSlide = (currentSlide + 1) % totalSlides;
    setCurrentSlide(newSlide);
    updateVisiblePosts(newSlide);
  };

  // Handle previous slide
  const prevSlide = () => {
    if (totalSlides <= 1) return; // Don't slide if we only have one slide
    
    const newSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    setCurrentSlide(newSlide);
    updateVisiblePosts(newSlide);
  };

  // Update visible posts based on current slide
  const updateVisiblePosts = (slideIndex: number) => {
    if (totalPosts === 0) return;
    
    const startIndex = slideIndex * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, totalPosts);
    const newVisiblePosts = [];
    
    // If we're showing the last slide and it's not full
    if (endIndex - startIndex < postsPerPage) {
      // Fill the visible posts with what we have
      for (let i = startIndex; i < endIndex; i++) {
        newVisiblePosts.push(i);
      }
      
      // Pad with posts from the beginning if needed
      const remaining = postsPerPage - (endIndex - startIndex);
      for (let i = 0; i < remaining; i++) {
        newVisiblePosts.push(i);
      }
    } else {
      // Normal case: just show the next 3 posts
      for (let i = startIndex; i < endIndex; i++) {
        newVisiblePosts.push(i);
      }
    }
    
    setVisiblePosts(newVisiblePosts);
  };

  // Auto-scroll carousel
  useEffect(() => {
    // Only set auto-scroll if we have more than one slide
    if (totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 15000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentSlide, totalSlides]);

  // Initialize visible posts
  useEffect(() => {
    updateVisiblePosts(currentSlide);
  }, [totalPosts]);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-[#f1f1f1]">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="uppercase tracking-wider text-sm font-medium mb-4">
                LATEST UPDATES
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Blog & Articles
              </h2>
            </div>
          </div>
          <div className="flex justify-center items-center py-20">
            <Oval
              height={60}
              width={60}
              color="#1699C1"
              secondaryColor="#e0f2fe"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-[#f1f1f1]">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="uppercase tracking-wider text-sm font-medium mb-4">
              LATEST UPDATES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Blog & Articles
            </h2>
          </div>
          
          {/* Carousel indicators - only show if we have more than one slide */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    updateVisiblePosts(index);
                  }}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-black' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visiblePosts.map((postIndex, i) => {
            const post = posts[postIndex];
            return (
              <div key={`${postIndex}-${i}`} className="flex flex-col h-[550px]">
                <div className="relative h-[240px] w-full mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={typeof post.image === 'string' && post.image.startsWith('https://')}
                  />
                </div>
                
                <div className="mb-4 text-gray-600">
                  {post.date}
                </div>
                
                <h3 className="text-xl font-bold mb-4 line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-gray-600 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-6 flex-grow overflow-hidden line-clamp-4">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <HoleButton href={`/blog/${post.slug}`}>
                    <span>All Reviews</span>
                  </HoleButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 