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
                At Daniel One Four; we are global social interaction enthusiast and leadership skills promoter, possessing a unique blend of expertise to guide you through the intricate pathways of social and professional development. With years of experience in teaching leadership skills, training individuals to engage comfortably in diverse environments, and mastering the art of etiquette, we have refined methodologies that empowers individuals like you. We specialize in identifying potential strengths, helping you harness these capabilities to elevate your self-confidence and self-esteem across social, academic, and professional landscapes.
                </p>
                <p className="text-gray-700 mb-6">
                In today’s interconnected world, it is essential to understand both individual and collective potential. By developing these critical skills, you will not only learn how to navigate global social circles with ease but also foster leadership qualities that will set you apart. Imagine a future where you are equipped to seize opportunities and build meaningful relationships, transforming challenges into triumphs.
                </p>
                <p className="text-gray-700 mb-6">
                We invite you to connect with us on social media, where we share valuable insights and resources tailored to your growth. Join our community of like-minded individuals dedicated to unlocking their leadership potential and mastering the art of global interaction. Together, we will embark on a journey to redefine your capabilities and expand your horizons.
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">What We Do</h2>
                <p className="text-gray-700 mb-6">
                We empower you to harness your unique strengths, boosting confidence and leadership skills for success in global social circles.
                </p>

                <p className="text-gray-700 mb-6">
                We empower you to unlock your potential and confidently connect globally through tailored leadership training and etiquette refinement.
                </p>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Global Social Interactions and Leadership?</h2>
                <p className="text-gray-700 mb-6">
                At the age of eight, I found myself standing on the grand arena of the state government house, surrounded by officials and dignitaries. It was December 1992, and I had been given the opportunity to attend the end of year celebrations as a special guest. The invitation had come from the state government, and my father, a senior civil servant, had graciously offered the children’s invite to me.
                </p>
                <p className='text-gray-700 mb-6'>
                Growing up as the child of a single parent, I had faced numerous challenges that had shaken my self-esteem and confidence. My parents had separated when I was just two years old, and the absence of my father had left a void in my life. As I stood in that grand arena, I couldn't help but feel a surge of uncertainty and anxiety. How was I to act in such an environment? What was I to wear? How was I to speak and behave in the presence of such esteemed individuals?
                </p>
                <p className="text-gray-700 mb-6">
                My mother had carefully chosen a white shoe and a flowery gown for me, and with a motherly counsel, she had dropped me off at the government house. As I watched the officials roam from booth to booth, selecting children for various activities, one of them pointed in my direction. Before I knew it, I was being crowned the queen of the event, a moment that would forever change the course of my life.
                </p>
                <p className='text-gray-700 mb-6'>
                From that day forward, I found myself in countless leadership positions, from being head girl in primary school to a house captain in secondary. I continued to take on various roles, including choir coordinator, voiceover artist, youth librarian, vice president of a Drug-Free club, and even a lecturer. Each of these experiences pushed me to upgrade my social skills and to prepare myself for interacting with people on high platforms.
                </p>
                <p className='text-gray-700 mb-6'>
                Although my initial learnings were informal, I eventually recognized the need to formalize my education and help others who, like me, desired to cultivate the same level of skill and poise. I delved into the importance of leadership, global social interactions, and the value of empowering oneself to be comfortable in any circumstance. As I pursued my personal growth journey, I also found love, got married, and raised award-winning children.
                </p>
                <p className='text-gray-700 mb-6'>
                Today, I stand on global platforms, meeting with icons and making a difference in the world. Throughout my journey, I have learned that no matter the adversities of the past, with self-awareness and dedication, one can prepare for a bright and prosperous future. My experience has taught me that leadership requires continual growth and development, and that regardless of our backgrounds, we all possess the power to become valuable individuals who inspire and uplift those around us.
                </p>
                <p className='text-gray-700 mb-6'>
                In conclusion, my story serves as a testament to the idea that when we know ourselves, we can truly grow ourselves. We have the capacity to lead, to connect, and to add value to the lives of others. No matter where we come from, we can prepare for a future filled with hope and possibility. It will be my pleasure to walk that journey with individuals, institutions, organisations, teams, families. This is the Daniel one four legacy!

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