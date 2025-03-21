'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiArrowUpRight, FiX, FiChevronLeft, FiChevronRight, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { getAllTeamMembers, TeamMember } from '@/lib/contentful';

// Fallback placeholder images (used when Contentful images are not available)
import placeholderImage1 from '@/assets/images/team/coach-1.png';
import placeholderImage2 from '@/assets/images/team/coach-2.png';
import placeholderImage3 from '@/assets/images/team/coach-3.png';
import placeholderImage4 from '@/assets/images/team/coach-4.png';

// Array of placeholder images to rotate through
const placeholderImages = [
  placeholderImage1,
  placeholderImage2,
  placeholderImage3,
  placeholderImage4
];

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to get a placeholder image based on member index
  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  // Fetch team members from Contentful
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        const members = await getAllTeamMembers();
        setTeamMembers(members);
        setError(null);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members. Please try again later.');
        
        // For development, fallback to hardcoded data if Contentful is not set up
        if (process.env.NODE_ENV === 'development') {
          setTeamMembers([
            {
              id: '1',
              name: 'Sarah Johnson',
              role: 'Executive Coach',
              bio: 'Sarah is an experienced executive coach with over 15 years of experience working with C-suite executives across various industries.',
              shortBio: 'Expert in executive leadership and career transitions',
              photo: `/assets/images/team/coach-1.png`,
              email: 'sarah@example.com',
              phone: null,
              socialLinks: {
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com'
              },
              slug: 'sarah-johnson'
            },
            {
              id: '2',
              name: 'Michael Chen',
              role: 'Leadership Coach',
              bio: 'Michael specializes in leadership development and team dynamics, helping professionals maximize their potential and impact.',
              shortBio: 'Specializes in team dynamics and leadership development',
              photo: `/assets/images/team/coach-2.png`,
              email: 'michael@example.com',
              phone: null,
              socialLinks: {
                linkedin: 'https://linkedin.com'
              },
              slug: 'michael-chen'
            },
            {
              id: '3',
              name: 'Jessica Rodriguez',
              role: 'Career Coach',
              bio: 'Jessica helps professionals navigate career transitions and find fulfilling paths aligned with their values and strengths.',
              shortBio: 'Expert in career transitions and personal branding',
              photo: `/assets/images/team/coach-3.png`,
              email: 'jessica@example.com',
              phone: null,
              socialLinks: {
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com'
              },
              slug: 'jessica-rodriguez'
            },
            {
              id: '4',
              name: 'David Wilson',
              role: 'Business Coach',
              bio: 'David partners with entrepreneurs and business leaders to develop strategies for sustainable growth and success.',
              shortBio: 'Strategic advisor for entrepreneurs and business leaders',
              photo: `/assets/images/team/coach-4.png`,
              email: 'david@example.com',
              phone: null,
              socialLinks: {
                linkedin: 'https://linkedin.com'
              },
              slug: 'david-wilson'
            }
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleSelectMember = (id: string) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedMember(id);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleClose = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setSelectedMember(null);
      setIsAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    if (!selectedMember || isAnimating || teamMembers.length <= 1) return;
    
    const currentIndex = teamMembers.findIndex(member => member.id === selectedMember);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % teamMembers.length;
    handleSelectMember(teamMembers[nextIndex].id);
  };

  const handlePrevious = () => {
    if (!selectedMember || isAnimating || teamMembers.length <= 1) return;
    
    const currentIndex = teamMembers.findIndex(member => member.id === selectedMember);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + teamMembers.length) % teamMembers.length;
    handleSelectMember(teamMembers[prevIndex].id);
  };

  return (
    <section className="py-16 md:py-24 bg-light-gray overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative">
          <div className="flex justify-center items-center mb-4">
            <button 
              onClick={selectedMember ? handlePrevious : undefined} 
              className={`w-10 h-10 flex items-center justify-center transform transition-transform ${
                selectedMember ? 'opacity-100 cursor-pointer' : 'opacity-0 cursor-default'
              }`}
              aria-label="Previous team member"
            >
              <FiChevronLeft size={24} className="text-gray-400" />
            </button>
            
            <h2 className="text-4xl md:text-5xl font-bold px-6">Our Expert Team</h2>
            
            <button 
              onClick={selectedMember ? handleNext : undefined} 
              className={`w-10 h-10 flex items-center justify-center transform transition-transform ${
                selectedMember ? 'opacity-100 cursor-pointer' : 'opacity-0 cursor-default'
              }`}
              aria-label="Next team member"
            >
              <FiChevronRight size={24} className="text-gray-400" />
            </button>
          </div>
          
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our team of experienced coaches brings diverse expertise and a shared commitment to helping our clients achieve extraordinary results.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && teamMembers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-black text-white hover:bg-gray-800"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Full Team Grid or Selected Member Detail */}
        {!isLoading && teamMembers.length > 0 && (
          <>
            {selectedMember === null ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <div 
                    key={member.id} 
                    className="group cursor-pointer transition-all duration-300"
                    onClick={() => handleSelectMember(member.id)}
                  >
                    <div className="relative overflow-hidden">
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={member.photo || getPlaceholderImage(index)}
                          alt={member.name}
                          className="object-cover w-full h-full"
                          width={600}
                          height={800}
                          priority
                        />
                      </div>
                    
                      <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 group-hover:bg-white group-hover:border border-black bg-black text-white group-hover:text-black`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p>{member.role}</p>
                          </div>
                          <div className="transition-transform transform duration-300 group-hover:translate-x-0 translate-x-4 opacity-0 group-hover:opacity-100">
                            <FiArrowUpRight size={24} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {teamMembers.filter(member => member.id === selectedMember).map((member, index) => (
                  <div 
                    key={member.id}
                    className={`bg-white shadow-xl rounded-lg overflow-hidden animate-fade-in transition-all duration-500`}
                  >
                    <div className="relative">
                      <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Close details"
                      >
                        <FiX size={20} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                        <div className="md:col-span-5 relative h-64 md:h-auto">
                          <Image
                            src={member.photo || getPlaceholderImage(index)}
                            alt={member.name}
                            className="object-cover object-top"
                            fill
                            priority
                          />
                        </div>
                        
                        <div className="md:col-span-7 p-8">
                          <h3 className="text-3xl font-bold mb-2 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>{member.name}</h3>
                          <p className="text-primary font-medium mb-6 animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>{member.role}</p>
                          
                          <div className="mb-6 animate-fade-slide-up" style={{ animationDelay: '0.3s' }}>
                            <h4 className="font-bold mb-2">Bio</h4>
                            <p className="text-gray-700">{member.bio}</p>
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-slide-up" style={{ animationDelay: '0.6s' }}>
                            <div className="flex flex-wrap gap-4">
                              {member.email && (
                                <a 
                                  href={`mailto:${member.email}`} 
                                  className="flex items-center text-gray-700 hover:text-black"
                                  aria-label={`Email ${member.name}`}
                                >
                                  <FiMail className="mr-2" />
                                  <span>{member.email}</span>
                                </a>
                              )}
                              
                              {member.socialLinks?.linkedin && (
                                <a 
                                  href={member.socialLinks.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center text-gray-700 hover:text-black"
                                  aria-label={`LinkedIn profile of ${member.name}`}
                                >
                                  <FiLinkedin className="mr-2" />
                                  <span>LinkedIn</span>
                                </a>
                              )}
                              
                              {member.socialLinks?.twitter && (
                                <a 
                                  href={member.socialLinks.twitter} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center text-gray-700 hover:text-black"
                                  aria-label={`Twitter profile of ${member.name}`}
                                >
                                  <FiTwitter className="mr-2" />
                                  <span>Twitter</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TeamSection; 