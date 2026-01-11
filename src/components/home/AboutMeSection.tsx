'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutMeSection = () => {
  return (
    <section id="about-me" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Side - 3 Image Collage */}
          <div className="w-full lg:w-1/2 relative min-h-[500px] flex items-center justify-center" data-aos="fade-right">
            {/* Main Center Image */}
            <div className="relative z-20 w-2/3 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
              <Image
                src="/images/author/portrait-red.png" 
                alt="Oyinkansola Adedapo Main"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 to-transparent"></div>
            </div>

            {/* Top Right Image */}
            <div className="absolute top-0 right-4 z-30 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-xl transform translate-x-4 -translate-y-4 border-4 border-white hover:scale-110 transition-transform duration-500">
              <Image
                src="/images/author/portrait-white.png" 
                alt="Oyinkansola Adedapo White"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Bottom Left Image */}
            <div className="absolute bottom-0 left-4 z-30 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-xl transform -translate-x-4 translate-y-4 border-4 border-white hover:scale-110 transition-transform duration-500">
              <Image
                src="/images/author/leader-chess.jpg" 
                alt="Leadership"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Decorative element */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-orange rounded-full -z-10 blur-3xl opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-blue rounded-full -z-10 blur-3xl opacity-20"></div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 space-y-8" data-aos="fade-left">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-brand-blue/10 text-brand-blue font-bold text-xs tracking-widest uppercase rounded-full">
                The Visionary
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                About <span className="text-brand-orange">Oyinkansola</span> Adedapo
              </h2>
            </div>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Oyinkansola Adedapo is a multi-passionate visionary, leadership coach, and etiquette consultant dedicated to empowering the next generation of global leaders.
              </p>
              <p>
                As the founder of Leagues School of Leadership & Etiquette, she has impacted thousands of young people across the globe, helping them develop the emotional intelligence and social elegance required for 21st-century relevance.
              </p>
              <p>
                Her mission is simple yet profound: to transform potential into performance and lead change through character-driven leadership.
              </p>
            </div>

            <div className="pt-4">
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 bg-brand-blue text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-1 transition-all duration-300"
              >
                Read Full Story
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
