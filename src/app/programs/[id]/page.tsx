import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import { getProgramBySlug, getAllPrograms } from '@/lib/contentful-programs';
import Header from '@/components/layout/Header';
import { getCompanyDetailsCached } from '@/lib/contentful-company-details';

// Import a placeholder image for the page header
import headerImage from '@/assets/images/about.png';
import HoleButton from '@/components/ui/HoleButton';
import Footer from '@/components/layout/Footer';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const id = params.id;
  const program = await getProgramBySlug(id);
  
  if (!program) {
    return {
      title: 'Program Not Found | Daniel One Four',
      description: 'The requested program could not be found.',
    };
  }

  return {
    title: `${program.title} | Daniel One Four`,
    description: program.shortDescription,
  };
}

export async function generateStaticParams() {
  const { items: programs } = await getAllPrograms(1, 100);
  
  return programs.map(program => ({
    id: program.slug,
  }));
}

export default async function ProgramPage({ params }: Props) {
  const id = params.id;
  const program = await getProgramBySlug(id);
  const companyDetails = await getCompanyDetailsCached();
  
  if (!program) {
    notFound();
  }

  // Get other programs for the "Other Programs" section
  const { items: allPrograms } = await getAllPrograms();
  
  const otherPrograms = allPrograms
    .filter(p => p.id !== program.id)
    .sort(() => Math.random() - 0.5) // Randomly sort
    .slice(0, 3); // Take up to 3 programs

  return (
    <>
    <Header />
    <main className="flex flex-col min-h-screen">
      <PageHeader
        title={program.title}
        image={headerImage}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Programs', href: '/programs' },
          { label: program.title, href: `/programs/${program.slug}` },
        ]}
      />

      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="relative h-80 w-full">
                <Image
                  src={program.image}
                  alt={program.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{program.title}</h1>
                <p className="text-xl text-gray-700 mb-6">{program.shortDescription}</p>
                <div className="prose max-w-none text-gray-600">
                  <p>{program.fullDescription}</p>
                </div>

                <div className="mt-8">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center px-4 py-2 bg-blue-50 rounded-md">
                      <span className="font-semibold text-blue-800">Duration:</span>
                      <span className="ml-2 text-gray-700">{program.duration}</span>
                    </div>
                    <div className="flex items-center px-4 py-2 bg-blue-50 rounded-md">
                      <span className="font-semibold text-blue-800">Sessions:</span>
                      <span className="ml-2 text-gray-700">{program.sessions}</span>
                    </div>
                    <div className="flex items-center px-4 py-2 bg-blue-50 rounded-md">
                      <span className="font-semibold text-blue-800">Pricing:</span>
                      <span className="ml-2 text-gray-700">{program.pricing}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Program Benefits</h2>
                  <ul className="space-y-2">
                    {program.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-brand-orange mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">What&apos;s Included</h2>
                  <ul className="space-y-2">
                    {program.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-brand-orange mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {program.testimonials && program.testimonials.length > 0 && (
                  <div className="mt-12 bg-gray-50 p-6 rounded-lg border-l-4 border-brand-orange italic">
                    <p className="text-gray-700 mb-4">{program.testimonials[0]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ready to Transform?</h2>
              <p className="text-gray-600 mb-6">
                Take the first step towards your goals by enrolling in our {program.title} program today.
              </p>
              <HoleButton 
              href="/contact" 
              className="w-full justify-center"
              bgColorClass="bg-brand-orange"
            >
              <span className="mr-4">Enroll Now</span>
            </HoleButton>
              
              <div className="mt-4">
                <Link 
                  href="/contact" 
                  className="block text-center bg-white hover:bg-gray-100 text-brand-blue font-semibold py-3 px-6 rounded-md border border-brand-orange transition duration-300 w-full"
                >
                  Request More Information
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Have Questions?</h3>
                <p className="text-gray-600 mb-4">
                  Our team is here to help you choose the right program for your needs.
                </p>
                <a 
                  href={`tel:${companyDetails?.primaryPhoneNumber || '+11234567890'}`} 
                  className="flex items-center text-brand-blue font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {companyDetails?.primaryPhoneNumber || '(123) 456-7890'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Other Programs Section */}
        {otherPrograms.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Other Programs You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherPrograms.map((program) => (
                <Link 
                  href={`/programs/${program.slug}`} 
                  key={program.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-200"
                >
                  <div className="relative h-48">
                    <Image
                      src={program.image}
                      alt={program.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{program.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{program.shortDescription}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-gray-700 font-medium text-sm">{program.pricing}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue text-brand-orange">
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
    <Footer />
    </>
  );
} 