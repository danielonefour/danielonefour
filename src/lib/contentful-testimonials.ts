import { createClient, Entry } from 'contentful';

// Testimonial interface
export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  role?: string;
  company?: string;
  image?: string;
  featured: boolean;
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Map Contentful response to Testimonial objects
function mapContentfulTestimonials(entries: any): Testimonial[] {
  if (!entries?.items?.length) return [];
  
  return entries.items.map((item: Entry<any>) => {
    const fields = item.fields;
    const imageUrl = fields.image?.fields?.file?.url 
      ? `https:${fields.image.fields.file.url}` 
      : undefined;
    
    return {
      id: item.sys.id,
      name: fields.name || '',
      quote: fields.quote || '',
      role: fields.role || undefined,
      company: fields.company || undefined,
      image: imageUrl,
      featured: !!fields.featured,
    };
  });
}

// Get all testimonials
export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await client.getEntries({
      content_type: 'testimonial',
      order: '-sys.createdAt',
    });
    
    return mapContentfulTestimonials(response);
  } catch (error) {
    console.error('Error fetching testimonials from Contentful:', error);
    return [];
  }
}

// Get featured testimonials
export async function getFeaturedTestimonials(count: number = 3): Promise<Testimonial[]> {
  try {
    const response = await client.getEntries({
      content_type: 'testimonial',
      'fields.featured': true,
      order: '-sys.createdAt',
      limit: count,
    });
    
    return mapContentfulTestimonials(response);
  } catch (error) {
    console.error('Error fetching featured testimonials from Contentful:', error);
    return [];
  }
}

// Get testimonial by ID
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const response = await client.getEntry(id);
    
    if (!response) return null;
    
    const testimonials = mapContentfulTestimonials({ items: [response] });
    return testimonials.length > 0 ? testimonials[0] : null;
  } catch (error) {
    console.error('Error fetching testimonial by ID from Contentful:', error);
    return null;
  }
} 