import { createClient, Entry } from 'contentful';

// CompanyDetails interface
export interface CompanyDetails {
  id: string;
  companyName: string;
  heroTitle: string;
  heroDescription: string;
  introTitle: string;
  introDescription: string;
  introTagLine?: string;
  primaryPhoneNumber: string;
  primaryEmail: string;
  secondaryPhoneNumbers?: string[];
  secondaryEmails?: string[];
  streetAddress: string;
  country: string;
  postCode: string;
  socialMedias?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    [key: string]: string | undefined;
  };
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Map Contentful response to CompanyDetails object
function mapContentfulCompanyDetails(entry: Entry<any>): CompanyDetails {
  if (!entry) {
    throw new Error('Company details entry not found');
  }

  const fields = entry.fields;
  
  return {
    id: entry.sys.id,
    companyName: fields.companyName || '',
    heroTitle: fields.heroTitle || '',
    heroDescription: fields.heroDescription || '',
    introTitle: fields.introTitle || '',
    introDescription: fields.introDescription || '',
    introTagLine: fields.introTagLine || undefined,
    primaryPhoneNumber: fields.primaryPhoneNumber || '',
    primaryEmail: fields.primaryEmail || '',
    secondaryPhoneNumbers: fields.secondaryPhoneNumbers || undefined,
    secondaryEmails: fields.secondaryEmails || undefined,
    streetAddress: fields.streetAddress || '',
    country: fields.country || '',
    postCode: fields.postCode || '',
    socialMedias: fields.socialMedias || undefined
  };
}

// Get company details
export async function getCompanyDetails(): Promise<CompanyDetails | null> {
  try {
    const response = await client.getEntries({
      content_type: 'companyDetails',
      limit: 1
    });
    
    if (!response.items.length) {
      console.warn('No company details found in Contentful');
      return null;
    }
    
    return mapContentfulCompanyDetails(response.items[0]);
  } catch (error) {
    console.error('Error fetching company details from Contentful:', error);
    return null;
  }
}

// Cache for company details to avoid repeated API calls
let companyDetailsCache: CompanyDetails | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Get company details with caching
export async function getCompanyDetailsCached(): Promise<CompanyDetails | null> {
  const now = Date.now();
  
  // If we have cached data and it's not expired, return it
  if (companyDetailsCache && (now - lastFetchTime < CACHE_DURATION)) {
    return companyDetailsCache;
  }
  
  // Otherwise fetch fresh data
  try {
    const details = await getCompanyDetails();
    
    // Update cache
    if (details) {
      companyDetailsCache = details;
      lastFetchTime = now;
    }
    
    return details;
  } catch (error) {
    console.error('Error fetching cached company details:', error);
    
    // If we have cached data, return it even if expired
    if (companyDetailsCache) {
      return companyDetailsCache;
    }
    
    return null;
  }
} 