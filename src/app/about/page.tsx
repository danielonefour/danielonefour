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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
                <p className="text-gray-700 mb-6">
                At Daniel One Four...; we are global social interaction enthusiast and leadership skills promoter, possessing a unique blend of expertise to guide you through the intricate pathways of social and professional development. With years of experience in teaching leadership skills, training individuals to engage comfortably in diverse environments, and mastering the art of etiquette, we have refined methodologies that empowers individuals like you. We specialize in identifying potential strengths, helping you harness these capabilities to elevate your self-confidence and self-esteem across social, academic, and professional landscapes.
                </p>
                <p className="text-gray-700 mb-6">
                In today’s interconnected world, it is essential to understand both individual and collective potential. By developing these critical skills, you will not only learn how to navigate global social circles with ease but also foster leadership qualities that will set you apart. Imagine a future where you are equipped to seize opportunities and build meaningful relationships, transforming challenges into triumphs.
                </p>
                <p className="text-gray-700 mb-6">
                We invite you to connect with us on social media, where we share valuable insights and resources tailored to your growth. Join our community of like-minded individuals dedicated to unlocking their leadership potential and mastering the art of global interaction. Together, we will embark on a journey to redefine your capabilities and expand your horizons.
                </p>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">What We Do</h2>
                <p className="text-gray-700 mb-6">
                We empower you to harness your unique strengths, boosting confidence and leadership skills for success in global social circles.
                </p>
                <p className="text-gray-700 mb-6">
                We empower you to unlock your potential and confidently connect globally through tailored leadership training and etiquette refinement.
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