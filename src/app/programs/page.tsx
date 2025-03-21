import React from 'react';
import Image from 'next/image';
import PageHeader from '@/components/layout/PageHeader';
import { getAllPrograms, Program } from '@/lib/contentful-programs';
import HoleButton from '@/components/ui/HoleButton';
import Header from '@/components/layout/Header';

// Import a placeholder image for the page header
import headerImage from '@/assets/images/about.png';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Our Programs | Daniel One Four',
  description: 'Explore our range of coaching and training programs designed to help you reach your full potential.'
};

const cardHeight = 'h-[350px]';

const getLayout = (index: number) => {
  // Even indices (0, 2, 4...) will have text on top
  // Odd indices (1, 3, 5...) will have image on top
  return index % 2 === 0 ? 'text-top' : 'image-top';
};

export default async function ProgramsPage() {
  // Fetch programs from Contentful
  const response = await getAllPrograms();
  
  // Sort programs to show featured first, then by order
  const sortedPrograms = [...response.items].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.order - b.order;
  });

  return (
    <>
    <Header />
    <main className="flex flex-col min-h-screen">
      <PageHeader
        title="Our Programs"
        image={headerImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Programs', href: '/programs' }
        ]}
      />

      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Transform Your Potential
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our programs are designed to help individuals and organizations develop the skills, 
            mindset, and strategies needed to thrive in today&apos;s challenging environment.
          </p>
        </div>

        {sortedPrograms.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow">
            <h3 className="text-xl text-gray-700 mb-2">No Programs Available</h3>
            <p className="text-gray-600">
              We're currently updating our program offerings. Please check back soon or 
              <a href="/contact" className="text-brand-blue ml-1">contact us</a> for more information.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPrograms.map((program, index) => {
              const layout = getLayout(index);
              
              return (
                <div key={program.id} className="flex flex-col h-full">
                  {/* For text-top layout */}
                  {layout === 'text-top' && (
                    <>
                      {/* Text Card */}
                      <div className={`bg-white p-8 md:p-10 mb-8 flex flex-col ${cardHeight}`}>
                        <h3 className="text-xl md:text-2xl font-bold mb-6">{program.title}</h3>
                        <p className="text-gray-600 mb-8 flex-grow overflow-hidden text-sm">{program.fullDescription}</p>
                        <div className="mt-auto">
                          <HoleButton 
                            href={`programs/${program.slug}`}
                            bgColorClass="bg-brand-orange"
                          >
                            <span className="mr-4">More Details</span>
                          </HoleButton>
                        </div>
                      </div>
                      
                      {/* Image Card */}
                      <div className={`relative ${cardHeight} w-full`}>
                        <Image
                          src={program.image}
                          alt={program.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </>
                  )}
                  
                  {/* For image-top layout */}
                  {layout === 'image-top' && (
                    <>
                      {/* Image Card */}
                      <div className={`relative mb-8 ${cardHeight} w-full`}>
                        <Image
                          src={program.image}
                          alt={program.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      
                      {/* Text Card */}
                      <div className={`bg-white p-8 md:p-10 flex flex-col ${cardHeight}`}>
                        <h3 className="text-xl md:text-2xl font-bold mb-6">{program.title}</h3>
                        <p className="text-gray-600 mb-8 flex-grow overflow-hidden text-sm">{program.fullDescription}</p>
                        <div className="mt-auto">
                          <HoleButton 
                            href={`programs/${program.slug}`}
                            bgColorClass="bg-brand-orange"
                          >
                            <span className="mr-4">More Details</span>
                          </HoleButton>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
    <Footer />
    </>
  );
} 