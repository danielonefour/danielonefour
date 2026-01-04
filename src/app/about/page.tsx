import React, { Suspense } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import TeamSection from '@/components/about/TeamSection';
import aboutImage from '@/assets/images/about.png';

// Loading component for the TeamSection
const TeamSectionLoading = () => (
  <section className="py-16 md:py-24 bg-light-gray">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold animate-pulse">Our Expert Team</h2>
        <div className="h-4 bg-gray-300 rounded max-w-3xl mx-auto mt-4 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-300 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AboutPage = () => {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
  ];

  return (
    <>
      <Header />
      <main className="bg-white">
        <PageHeader 
          title="Our Story" 
          image={aboutImage}
          breadcrumbs={breadcrumbs}
        />
        
        {/* The Visionary Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative" data-aos="fade-right">
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                  <Image
                    src="/images/author/portrait-red.png"
                    alt="Oyinkansola Adedapo"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/30 to-transparent"></div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-orange rounded-full -z-10 blur-2xl opacity-50"></div>
              </div>

              <div className="space-y-8" data-aos="fade-left">
                <div className="space-y-4">
                  <h2 className="text-brand-blue font-bold tracking-widest uppercase text-sm">
                    Who We Are
                  </h2>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                    Driving Global <span className="text-brand-orange">Change</span> Through Leadership
                  </h1>
                </div>

                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                  <p>
                    At Daniel One Four, we are global social interaction enthusiasts and leadership skills promoters, possessing a unique blend of expertise to guide you through the intricate pathways of social and professional development.
                  </p>
                  <p>
                    With years of experience in teaching leadership skills, training individuals to engage comfortably in diverse environments, and mastering the art of etiquette, we have refined methodologies that empower individuals like you.
                  </p>
                  <p>
                    We specialize in identifying potential strengths, helping you harness these capabilities to elevate your self-confidence and self-esteem across social, academic, and professional landscapes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 bg-brand-orange text-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-8" data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
                  Mastering the Art of <span className="text-slate-800">Global Interaction</span>
                </h2>
                <div className="space-y-6 text-slate-800 text-lg">
                  <p>
                    In today’s interconnected world, it is essential to understand both individual and collective potential. By developing these critical skills, you will not only learn how to navigate global social circles with ease but also foster leadership qualities that will set you apart.
                  </p>
                  <p>
                    Imagine a future where you are equipped to seize opportunities and build meaningful relationships, transforming challenges into triumphs.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <span className="block text-4xl font-black text-slate-800">150+</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Workshops Held</span>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <span className="block text-4xl font-black text-slate-800">2k+</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Leaders Trained</span>
                  </div>
                </div>
              </div>

            
            </div>
          </div>
        </section>

  

        {/* Connect Section */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-6 max-w-4xl space-y-8" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Join Our <span className="text-brand-orange">Growth</span> Community
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We invite you to connect with us on social media, where we share valuable insights and resources tailored to your growth. Join our community of like-minded individuals dedicated to unlocking their leadership potential.
            </p>
            <div className="pt-4">
               <button className="bg-brand-blue text-white font-black px-12 py-5 rounded-full shadow-2xl hover:bg-brand-orange hover:text-slate-900 transition-all duration-500 transform hover:scale-105 active:scale-95">
                Connect With Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage; 