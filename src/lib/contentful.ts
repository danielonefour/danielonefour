import { createClient } from 'contentful';

// Team Member interface
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  shortBio: string;
  photo?: string;
  email: string | null;
  phone: string | null;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
  };
  slug: string;
  featured?: boolean;
}

// Blog Post interface
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
}

// Pagination response interface
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

// Service model
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage?: string;
  benefits: string[];
  faqs: { question: string; answer: string }[];
  order: number;
  featured: boolean;
}

// Log environment variable status for debugging
const logEnvironmentStatus = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment Variables Status:');
    console.log('- CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID ? '✅' : '❌');
    console.log('- NEXT_PUBLIC_CONTENTFUL_SPACE_ID:', process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ? '✅' : '❌');
    console.log('- CONTENTFUL_ACCESS_TOKEN:', process.env.CONTENTFUL_ACCESS_TOKEN ? '✅' : '❌');
    console.log('- NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN:', process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ? '✅' : '❌');
    console.log('- CONTENTFUL_PREVIEW_ACCESS_TOKEN:', process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ? '✅' : '❌');
    console.log('- NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN:', process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN ? '✅' : '❌');
    console.log('- CONTENTFUL_PREVIEW:', process.env.CONTENTFUL_PREVIEW);
    console.log('- NEXT_PUBLIC_CONTENTFUL_PREVIEW:', process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW);
  }
};

// Log environment status on module load
logEnvironmentStatus();

// Initialize Contentful client
const createContentfulClient = () => {
  // Look for regular and NEXT_PUBLIC_ variables
  const spaceId = process.env.CONTENTFUL_SPACE_ID || process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN || process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';
  
  if (!spaceId || !accessToken) {
    console.error('Contentful environment variables missing:',
      !spaceId ? 'CONTENTFUL_SPACE_ID/NEXT_PUBLIC_CONTENTFUL_SPACE_ID' : '',
      !accessToken ? 'CONTENTFUL_ACCESS_TOKEN/NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN' : '');
    
    // Return a mock client for development to prevent crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock Contentful client for development');
      return {
        getEntries: () => Promise.resolve({ items: [] })
      } as any;
    }
    
    throw new Error('Contentful configuration is missing. Please check your environment variables.');
  }
  
  try {
    return createClient({
      space: spaceId,
      accessToken: accessToken,
      environment: environment,
    });
  } catch (error) {
    console.error('Error creating Contentful client:', error);
    
    // Return a mock client for development to prevent crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error creating client, using mock Contentful client for development');
      return {
        getEntries: () => Promise.resolve({ items: [] })
      } as any;
    }
    
    throw error;
  }
};

const client = createContentfulClient();

// Initialize preview client (for draft content)
const createPreviewClient = () => {
  // Look for regular and NEXT_PUBLIC_ variables
  const spaceId = process.env.CONTENTFUL_SPACE_ID || process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const previewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT || process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master';
  
  if (!spaceId || !previewToken) {
    console.error('Contentful preview environment variables missing:',
      !spaceId ? 'CONTENTFUL_SPACE_ID/NEXT_PUBLIC_CONTENTFUL_SPACE_ID' : '',
      !previewToken ? 'CONTENTFUL_PREVIEW_ACCESS_TOKEN/NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN' : '');
    
    // Return a mock client for development to prevent crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock Contentful preview client for development');
      return {
        getEntries: () => Promise.resolve({ items: [] })
      } as any;
    }
    
    // Fallback to regular client if available
    if (client) {
      console.warn('Falling back to regular Contentful client');
      return client;
    }
    
    throw new Error('Contentful preview configuration is missing. Please check your environment variables.');
  }
  
  try {
    return createClient({
      space: spaceId,
      accessToken: previewToken,
      environment: environment,
      host: 'preview.contentful.com',
    });
  } catch (error) {
    console.error('Error creating Contentful preview client:', error);
    
    // Fallback to regular client if available
    if (client) {
      console.warn('Error creating preview client, falling back to regular Contentful client');
      return client;
    }
    
    // Return a mock client for development to prevent crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error creating client, using mock Contentful preview client for development');
      return {
        getEntries: () => Promise.resolve({ items: [] })
      } as any;
    }
    
    throw error;
  }
};

const previewClient = createPreviewClient();

// Get the appropriate client based on environment
const getClient = () => {
  const isPreview = 
    process.env.CONTENTFUL_PREVIEW === 'true' || 
    process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW === 'true';
  
  // Check if preview mode is requested but preview client is not available
  if (isPreview && !previewClient) {
    console.warn('Preview mode requested but preview client not available. Using regular client.');
    return client;
  }
  
  return isPreview ? previewClient : client;
};

// TEAM MEMBER FUNCTIONS

/**
 * Fetches all team members from Contentful
 */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const entries = await getClient().getEntries({
      content_type: 'teamMember',
      order: 'fields.name',
    });

    if (!entries.items || entries.items.length === 0) {
      return [];
    }

    return entries.items.map((item: any) => {
      const fields = item.fields;
      const photoUrl = fields.photo?.fields?.file?.url;

      return {
        id: item.sys.id,
        name: fields.name || '',
        role: fields.role || '',
        bio: fields.bio || '',
        shortBio: fields.shortBio || '',
        ...(photoUrl && { photo: `https:${photoUrl}` }),
        email: fields.email || null,
        phone: fields.phone || null,
        socialLinks: {
          linkedin: fields.linkedinProfile || null,
          twitter: fields.twitterProfile || null,
        },
        slug: fields.slug || '',
        featured: fields.featured || false,
      };
    });
  } catch (error) {
    console.error('Error fetching team members from Contentful:', error);
    throw new Error('Failed to fetch team members from Contentful');
  }
}

/**
 * Fetches a single team member by slug
 */
export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const entries = await getClient().getEntries({
      content_type: 'teamMember',
      'fields.slug': slug,
      limit: 1,
    });

    if (!entries.items || entries.items.length === 0) {
      return null;
    }

    const item = entries.items[0];
    const fields = item.fields;
    const photoUrl = fields.photo?.fields?.file?.url;

    return {
      id: item.sys.id,
      name: fields.name || '',
      role: fields.role || '',
      bio: fields.bio || '',
      shortBio: fields.shortBio || '',
      ...(photoUrl && { photo: `https:${photoUrl}` }),
      email: fields.email || null,
      phone: fields.phone || null,
      socialLinks: {
        linkedin: fields.linkedinProfile || null,
        twitter: fields.twitterProfile || null,
      },
      slug: fields.slug || '',
      featured: fields.featured || false,
    };
  } catch (error) {
    console.error('Error fetching team member from Contentful:', error);
    throw new Error('Failed to fetch team member from Contentful');
  }
}

/**
 * Fetches only featured team members
 */
export async function getFeaturedTeamMembers(): Promise<TeamMember[]> {
  try {
    const entries = await getClient().getEntries({
      content_type: 'teamMember',
      'fields.featured': true,
      order: 'fields.name',
    });

    if (!entries.items || entries.items.length === 0) {
      return [];
    }

    return entries.items.map((item: any) => {
      const fields = item.fields;
      const photoUrl = fields.photo?.fields?.file?.url;

      return {
        id: item.sys.id,
        name: fields.name || '',
        role: fields.role || '',
        bio: fields.bio || '',
        shortBio: fields.shortBio || '',
        ...(photoUrl && { photo: `https:${photoUrl}` }),
        email: fields.email || null,
        phone: fields.phone || null,
        socialLinks: {
          linkedin: fields.linkedinProfile || null,
          twitter: fields.twitterProfile || null,
        },
        slug: fields.slug || '',
        featured: true,
      };
    });
  } catch (error) {
    console.error('Error fetching featured team members from Contentful:', error);
    throw new Error('Failed to fetch featured team members from Contentful');
  }
}

// BLOG POST FUNCTIONS

/**
 * Fetches all blog posts from Contentful
 */
export async function getAllBlogPosts(page = 1, perPage = 9): Promise<PaginatedResponse<BlogPost>> {
  try {
    const skip = (page - 1) * perPage;
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?content_type=blogPost&order=-fields.date&skip=${skip}&limit=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status}`);
    }

    const data = await response.json();
    const blogPosts = mapContentfulBlogPosts(data);

    return {
      items: blogPosts,
      total: data.total,
      skip: data.skip,
      limit: data.limit
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
}

/**
 * Fetches a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const entries = await getClient().getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    });

    if (!entries.items || entries.items.length === 0) {
      return null;
    }

    const item = entries.items[0];
    const fields = item.fields;
    const imageUrl = fields.featuredImage?.fields?.file?.url;

    return {
      id: item.sys.id,
      title: fields.title || '',
      slug: fields.slug || '',
      excerpt: fields.excerpt || '',
      content: fields.content || '',
      ...(imageUrl && { featuredImage: `https:${imageUrl}` }),
      date: fields.date || '',
      author: fields.author || '',
      category: fields.category || '',
      tags: fields.tags || [],
      featured: fields.featured || false,
    };
  } catch (error) {
    console.error('Error fetching blog post from Contentful:', error);
    throw new Error('Failed to fetch blog post from Contentful');
  }
}

/**
 * Fetches only featured blog posts
 */
export async function getFeaturedBlogPosts(page = 1, perPage = 9): Promise<PaginatedResponse<BlogPost>> {
  try {
    const skip = (page - 1) * perPage;
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?content_type=blogPost&fields.featured=true&order=-fields.date&skip=${skip}&limit=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status}`);
    }

    const data = await response.json();
    const blogPosts = mapContentfulBlogPosts(data);

    return {
      items: blogPosts,
      total: data.total,
      skip: data.skip,
      limit: data.limit
    };
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    throw new Error('Failed to fetch featured blog posts');
  }
}

/**
 * Fetches blog posts by category
 */
export async function getBlogPostsByCategory(categorySlug: string, page = 1, perPage = 9): Promise<PaginatedResponse<BlogPost>> {
  try {
    const skip = (page - 1) * perPage;
    
    // Convert the slug format to the actual category name format
    // Example: "leadership-development" -> "Leadership Development"
    const categoryName = categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    console.log('Fetching blog posts for category:', categorySlug);
    console.log('Using category name format:', categoryName);
    
    // Use content type filtering with fields.category using the properly formatted category name
    const response = await client.getEntries({
      content_type: 'blogPost',
      'fields.category': categoryName, // Use the converted category name
      order: '-fields.date',
      skip: skip,
      limit: perPage,
    });
    
    // Log response for debugging
    console.log(`Found ${response.total} posts for category "${categoryName}"`);
    
    const blogPosts = mapContentfulBlogPosts(response);
    
    return {
      items: blogPosts,
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return {
      items: [],
      total: 0,
      skip: (page - 1) * perPage,
      limit: perPage,
    };
  }
}

/**
 * Get all blog categories with counts
 */
export async function getBlogCategories(): Promise<{ name: string; count: number }[]> {
  try {
    const entries = await getClient().getEntries({
      content_type: 'blogPost',
    });

    if (!entries.items || entries.items.length === 0) {
      return [];
    }

    // Extract categories and count occurrences
    const categoryMap = new Map<string, number>();
    
    entries.items.forEach((item: any) => {
      const category = item.fields.category;
      if (category) {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      }
    });

    // Convert to array and sort
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching blog categories from Contentful:', error);
    throw new Error('Failed to fetch blog categories from Contentful');
  }
}

// Helper function to map Contentful response to BlogPost objects
function mapContentfulBlogPosts(data: any): BlogPost[] {
  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item: any) => {
    const fields = item.fields;
    
    // Find the image asset if it exists
    let imageUrl = undefined;
    if (fields.featuredImage) {
      const assetId = fields.featuredImage.sys?.id;
      const asset = data.includes?.Asset?.find((a: any) => a.sys.id === assetId);
      if (asset && asset.fields.file) {
        imageUrl = `https:${asset.fields.file.url}`;
      }
    }

    return {
      id: item.sys.id,
      title: fields.title || '',
      slug: fields.slug || '',
      excerpt: fields.excerpt || '',
      content: fields.content || '',
      featuredImage: imageUrl,
      date: fields.date || '',
      author: fields.author || '',
      category: fields.category || '',
      tags: fields.tags || [],
      featured: fields.featured || false,
    };
  });
}

// SERVICE FUNCTIONS

// Function to get all services
export async function getAllServices(): Promise<Service[]> {
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?content_type=service&order=fields.order&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status}`);
    }

    const data = await response.json();
    return mapContentfulServices(data);
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

// Function to get a service by slug
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?content_type=service&fields.slug=${slug}&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.status}`);
    }

    const data = await response.json();
    const services = mapContentfulServices(data);
    
    return services.length > 0 ? services[0] : null;
  } catch (error) {
    console.error(`Error fetching service with slug ${slug}:`, error);
    throw error;
  }
}

// Function to get featured services
export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?content_type=service&fields.featured=true&order=fields.order&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch featured services: ${response.status}`);
    }

    const data = await response.json();
    return mapContentfulServices(data);
  } catch (error) {
    console.error('Error fetching featured services:', error);
    throw error;
  }
}

// Helper function to map Contentful response to Service objects
function mapContentfulServices(data: any): Service[] {
  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item: any) => {
    // Find the featured image if it exists
    let featuredImageUrl;
    if (item.fields.featuredImage) {
      const imageId = item.fields.featuredImage.sys.id;
      const asset = data.includes?.Asset?.find((a: any) => a.sys.id === imageId);
      if (asset) {
        featuredImageUrl = asset.fields.file.url;
        // Add https: if the URL starts with //
        if (featuredImageUrl.startsWith('//')) {
          featuredImageUrl = `https:${featuredImageUrl}`;
        }
      }
    }

    // Parse FAQs from JSON string
    let faqs = [];
    try {
      if (item.fields.faqsJson) {
        faqs = JSON.parse(item.fields.faqsJson);
      }
    } catch (error) {
      console.error('Error parsing FAQs JSON:', error);
    }

    return {
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      description: item.fields.description,
      content: item.fields.content,
      featuredImage: featuredImageUrl,
      benefits: item.fields.benefits || [],
      faqs: faqs,
      order: item.fields.order || 999,
      featured: !!item.fields.featured
    };
  });
} 