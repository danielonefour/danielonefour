import React from 'react';
import { useCompanyDetails } from '@/hooks/useCompanyDetails';

export default function CompanyContactInfo() {
  const { data: companyDetails, isLoading, error } = useCompanyDetails();

  if (isLoading) {
    return <div className="p-4">Loading company information...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading company information</div>;
  }

  if (!companyDetails) {
    return <div className="p-4">No company information available</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{companyDetails.companyName}</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Contact</h3>
          <p className="mt-1">
            <strong>Phone:</strong> {companyDetails.primaryPhoneNumber}
          </p>
          <p className="mt-1">
            <strong>Email:</strong> {companyDetails.primaryEmail}
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Address</h3>
          <p className="mt-1 whitespace-pre-line">
            {companyDetails.streetAddress}<br />
            {companyDetails.country}, {companyDetails.postCode}
          </p>
        </div>
        
        {companyDetails.socialMedias && Object.keys(companyDetails.socialMedias).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4 mt-2">
              {Object.entries(companyDetails.socialMedias).map(([platform, url]) => (
                url && (
                  <a 
                    key={platform}
                    href={url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 