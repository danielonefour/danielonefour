'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TeamMember, getTeamMembers } from '@/lib/contentful-team';
import { Oval } from 'react-loader-spinner';

interface TeamSectionProps {
  initialTeamMembers?: TeamMember[];
}

const TeamSection = ({ initialTeamMembers }: TeamSectionProps) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers || []);
  const [isLoading, setIsLoading] = useState(!initialTeamMembers);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch team members if we don't have initialTeamMembers
    if (!initialTeamMembers) {
      const fetchTeamMembers = async () => {
        try {
          setIsLoading(true);
          const members = await getTeamMembers();
          setTeamMembers(members);
        } catch (err) {
          console.error('Error fetching team members:', err);
          setError('Failed to load team members');
        } finally {
          setIsLoading(false);
        }
      };

      fetchTeamMembers();
    }
  }, [initialTeamMembers]);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our talented team of professionals dedicated to your success.
            </p>
          </div>
          <div className="flex justify-center py-8">
            <Oval
              height={60}
              width={60}
              color="#4338ca"
              visible={true}
              secondaryColor="#c7d2fe"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our talented team of professionals dedicated to your success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <div className="relative h-64 w-full">
                {member.photo ? (
                  <Image
                    src={member.photo.url}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-indigo-600 mb-3">{member.position}</p>
                <p className="text-gray-600 mb-4">{member.bio}</p>
                <div className="flex space-x-4">
                  {/* Add social media links here if available */}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            href="/about" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Meet the Entire Team
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 