import React, { Suspense } from 'react';
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
      <main>
        <PageHeader 
          title="About Us" 
          image={aboutImage}
          breadcrumbs={breadcrumbs}
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-700 mb-6">
                  At our coaching practice, we are dedicated to helping individuals unlock their full potential and achieve meaningful personal and professional growth. We believe that everyone has the capacity to transform their lives with the right guidance and support.
                </p>
                <p className="text-gray-700 mb-6">
                  Our mission is to provide personalized coaching services that empower our clients to overcome obstacles, gain clarity on their goals, and develop the skills and mindset needed for lasting success.
                </p>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Approach</h2>
                <p className="text-gray-700 mb-6">
                  We take a holistic approach to coaching, recognizing that success in one area of life often depends on balance and fulfillment in others. Our coaches work closely with clients to understand their unique challenges, aspirations, and circumstances.
                </p>
                <p className="text-gray-700 mb-6">
                  Through a combination of evidence-based techniques, practical strategies, and compassionate support, we help our clients navigate change, build resilience, and create sustainable results that align with their values and vision.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section with Suspense for improved loading experience */}
        <Suspense fallback={<TeamSectionLoading />}>
          <TeamSection />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage; 