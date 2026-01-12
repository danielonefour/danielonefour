'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import { FiChevronRight, FiChevronLeft, FiMail, FiPhone, FiDownload, FiFilePlus, FiMessageCircle, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { BlogPost } from '@/lib/contentful';
import { remark } from 'remark';
import html from 'remark-html';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

// Import fallback image
import fallbackImage from '@/assets/images/blogs/blog-1.png';
import aboutImage from '@/assets/images/about.png';

interface ClientBlogPostPageProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  categories: {name: string; count: number}[];
  navPosts: {prev: BlogPost | null, next: BlogPost | null};
}

const ClientBlogPostPage = ({ post, relatedPosts, categories, navPosts }: ClientBlogPostPageProps) => {
  const router = useRouter();
  const [contentHtml, setContentHtml] = useState('');
  const { data: companyDetails } = useCompanyDetails();
  
  // Process Markdown to HTML
  useEffect(() => {
    const processContent = async () => {
      if (post?.content) {
        const processedContent = await remark()
          .use(html)
          .process(post.content);
        
        setContentHtml(processedContent.toString());
      }
    };
    
    processContent();
  }, [post]);
  
  // Create breadcrumbs
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  // Format the date
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title={post.title} 
          image="/images/author/leader-chess.jpg"
          breadcrumbs={breadcrumbs}
          titleClassName="text-3xl md:text-5xl lg:text-6xl"
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Left Column - Blog Post Content */}
              <div className="lg:w-2/3">
                <div className="relative mb-10 rounded-3xl overflow-hidden shadow-2xl">
                  <Image 
                    src={post.featuredImage || fallbackImage} 
                    alt={post.title}
                    width={800}
                    height={500} 
                    className="w-full h-[450px] object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                     <span className="px-4 py-1.5 bg-brand-orange text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                        {post.category}
                     </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                  <div className="flex items-center text-slate-500 font-medium">
                    <FiCalendar className="mr-2 text-brand-orange" />
                    <span>{formattedDate}</span>
                  </div>
                  
                  <div className="flex items-center text-slate-500 font-medium">
                    <FiUser className="mr-2 text-brand-orange" />
                    <span>By <span className="text-slate-900 font-bold">{post.author}</span></span>
                  </div>
                </div>

                <div 
                  className="prose prose-lg prose-slate max-w-none mb-12 prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-brand-blue prose-img:rounded-2xl"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
                
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-12">
                    {post.tags.map((tag, index) => (
                      <Link 
                        key={index}
                        href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="px-5 py-2 bg-slate-50 hover:bg-brand-blue hover:text-white text-slate-600 rounded-full text-sm font-medium transition-all duration-300 border border-slate-100"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Author Bio */}
                <div className="bg-slate-50 p-8 rounded-3xl mb-12 border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex-shrink-0 overflow-hidden">
                      {/* Placeholder for author image */}
                      <div className="w-full h-full flex items-center justify-center bg-brand-blue text-white text-2xl font-bold">
                        {post.author.split(' ').map(name => name[0]).join('')}
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <span className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1 block">About The Author</span>
                      <h4 className="text-2xl font-black text-slate-900 mb-3">{post.author}</h4>
                      <p className="text-slate-600 leading-relaxed">
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
                        <Link href={`/blog/${navPosts.prev.slug}`} className="group flex items-center text-slate-800 hover:text-brand-blue transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center mr-4 group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:-translate-x-1">
                             <FiChevronLeft className="text-xl" />
                          </div>
                          <div>
                             <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Previous Article</span>
                             <span className="text-lg font-bold line-clamp-1">{navPosts.prev.title}</span>
                          </div>
                        </Link>
                      </div>
                    )}
                    
                    {navPosts.prev && navPosts.next && (
                      <div className="h-10 w-px bg-gray-300 mx-4"></div>
                    )}
                    
                    {navPosts.next && (
                      <div className="w-1/2 flex items-center justify-end text-right">
                        <Link href={`/blog/${navPosts.next.slug}`} className="group flex items-center justify-end text-slate-800 hover:text-brand-blue transition-colors">
                          <div>
                             <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next Article</span>
                             <span className="text-lg font-bold line-clamp-1">{navPosts.next.title}</span>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center ml-4 group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:translate-x-1">
                             <FiChevronRight className="text-xl" />
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Categories & Contact */}
              <div className="lg:w-1/3">
                {/* Blog Categories */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-brand-orange rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-900">Categories</h3>
                  </div>
                  <ul className="space-y-3">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <Link 
                          href={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                          className={`flex justify-between items-center group py-2 border-b border-transparent hover:border-slate-100 transition-all ${
                            post.category === category.name ? 'text-brand-orange font-bold' : 'text-slate-600 hover:text-brand-blue'
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                             post.category === category.name ? 'bg-brand-orange/10 text-brand-orange' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-blue/10 group-hover:text-brand-blue'
                          }`}>{category.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Posts */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-brand-orange rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-900">Related Posts</h3>
                  </div>
                  {relatedPosts.length === 0 ? (
                    <p className="text-slate-500 text-center py-4 italic">No related posts found</p>
                  ) : (
                    <div className="space-y-6">
                      {relatedPosts.map((relatedPost, index) => (
                        <div key={index} className="flex gap-4 group">
                          <div className="w-20 h-20 flex-shrink-0 relative overflow-hidden rounded-xl">
                            <Image 
                              src={relatedPost.featuredImage || fallbackImage} 
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          
                          <div>
                            <Link href={`/blog/${relatedPost.slug}`} className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 leading-tight mb-1">
                              {relatedPost.title}
                            </Link>
                            <p className="text-xs text-slate-500 font-medium">
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
                        <p className="pl-7 text-white/90 text-sm break-all">{companyDetails?.primaryEmail || 'info@danielonefour.com'}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-1 text-brand-yellow font-medium">
                          <FiPhone className="mr-3" />
                          <span>Call Us</span>
                        </div>
                        <p className="pl-7 text-white/90 text-sm">{companyDetails?.primaryPhoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Buttons */}
                
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
      </main>
      <Footer />
    </>
  );
};

export default ClientBlogPostPage; 