'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/layout/PageHeader';
import aboutImage from '@/assets/images/about.png';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';
import { remark } from 'remark';
import html from 'remark-html';

const ClientPolicyPage = () => {
    const { data: companyDetails, isLoading } = useCompanyDetails();
    const [policyContent, setPolicyContent] = useState('');
  
    // Process the policy content with remark-html
    useEffect(() => {
      const processContent = async () => {
        // This is a placeholder - in a real implementation, you would fetch this content from Contentful
        const rawContent = `
# Our Commitment to Privacy

At Daniel One Four, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.

This privacy policy was last updated on March 20, 2025.

# Information We Collect

We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:

- **Identity Data** includes first name, last name, username or similar identifier.
- **Contact Data** includes email address, telephone numbers, and physical address.
- **Technical Data** includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.
- **Usage Data** includes information about how you use our website, products, and services.
- **Marketing and Communications Data** includes your preferences in receiving marketing from us and our third parties and your communication preferences.

# How We Use Your Information

We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:

- Where we need to perform the contract we are about to enter into or have entered into with you.
- Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
- Where we need to comply with a legal obligation.
- Where you have provided consent for us to process your personal data for a specific purpose.

# Cookies

We use cookies to distinguish you from other users of our website, remember your preferences, and to help us analyze how our website is being used. Cookies are small text files that are placed on your device when you visit a website.

You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.

# Data Security

We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.

# Your Legal Rights

Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:

- Request access to your personal data.
- Request correction of your personal data.
- Request erasure of your personal data.
- Object to processing of your personal data.
- Request restriction of processing your personal data.
- Request transfer of your personal data.
- Right to withdraw consent.

You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive. Alternatively, we could refuse to comply with your request in these circumstances.
        `;
        
        const processedContent = await remark()
          .use(html)
          .process(rawContent);
        
        setPolicyContent(processedContent.toString());
      };
      
      processContent();
    }, []);
    
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy', href: '/policy' },
  ];

  return (
    <>
      <Header />
      <main>
        <PageHeader 
          title="Privacy Policy" 
          image={aboutImage}
          breadcrumbs={breadcrumbs}
        />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {/* Render the policy content using dangerouslySetInnerHTML */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: policyContent }}
              />

              <div className="mt-12 mb-12">
                <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                </p>
                <div className="bg-header-bg p-6 rounded-md">
                  <p className="mb-2"><strong>Email:</strong> {companyDetails?.primaryEmail}</p>
                  <p className="mb-2"><strong>Phone:</strong> {companyDetails?.primaryPhoneNumber}</p>
                  <p><strong>Address:</strong> {companyDetails?.streetAddress}, {companyDetails?.postCode}, {companyDetails?.country}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ClientPolicyPage; 