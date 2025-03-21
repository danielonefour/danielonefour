import { createClient } from 'contentful';

// Define types
export interface Program {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  duration: string;
  sessions: string;
  benefits: string[];
  features: string[];
  testimonials: string[];
  pricing: string;
  price: number;
  currency: string;
  featured: boolean;
  order: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

// Initialize the Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

/**
 * Fetch all programs with optional pagination
 */
export async function getAllPrograms(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Program>> {
  try {
    const skip = (page - 1) * perPage;
    const response = await client.getEntries({
      content_type: 'program',
      order: ['fields.order', 'fields.title'],
      skip,
      limit: perPage,
    });

    return {
      items: mapContentfulPrograms(response),
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  } catch (error) {
    console.error('Error fetching programs from Contentful:', error);
    throw error;
  }
}

/**
 * Fetch a single program by slug
 */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    const response = await client.getEntries({
      content_type: 'program',
      'fields.slug': slug,
      limit: 1,
    });

    const programs = mapContentfulPrograms(response);
    return programs.length > 0 ? programs[0] : null;
  } catch (error) {
    console.error(`Error fetching program with slug "${slug}" from Contentful:`, error);
    throw error;
  }
}

/**
 * Fetch featured programs
 */
export async function getFeaturedPrograms(page: number = 1, perPage: number = 3): Promise<PaginatedResponse<Program>> {
  try {
    const skip = (page - 1) * perPage;
    const response = await client.getEntries({
      content_type: 'program',
      'fields.featured': true,
      order: ['fields.order', 'fields.title'],
      skip,
      limit: perPage,
    });

    return {
      items: mapContentfulPrograms(response),
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  } catch (error) {
    console.error('Error fetching featured programs from Contentful:', error);
    throw error;
  }
}

/**
 * Helper function to map Contentful response to Program objects
 */
function mapContentfulPrograms(data: any): Program[] {
  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item: any) => ({
    id: item.sys.id,
    slug: item.fields.slug,
    title: item.fields.title,
    shortDescription: item.fields.shortDescription,
    fullDescription: item.fields.fullDescription,
    image: item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : '',
    duration: item.fields.duration,
    sessions: item.fields.sessions,
    benefits: item.fields.benefits || [],
    features: item.fields.features || [],
    testimonials: item.fields.testimonials || [],
    pricing: item.fields.pricing,
    price: item.fields.price || 0,
    currency: item.fields.currency || 'USD',
    featured: item.fields.featured || false,
    order: item.fields.order || 999,
  }));
} 