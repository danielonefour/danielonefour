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

// Replace module-level client initialization with a singleton lazy getter
let contentfulClient: any = null;

function getClient() {
  if (!contentfulClient) {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    
    if (!spaceId || !accessToken) {
      console.error('Contentful environment variables missing in contentful-testimonials.ts');
      return {
        getEntries: () => Promise.resolve({ items: [], total: 0, skip: 0, limit: 0 }),
        getEntry: () => Promise.resolve(null)
      } as any;
    }

    contentfulClient = createClient({
      space: spaceId,
      accessToken: accessToken,
    });
  }
  return contentfulClient;
}

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
    const response = await getClient().getEntries({
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
    const response = await getClient().getEntries({
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
    const response = await getClient().getEntry(id);
    
    if (!response) return null;
    
    const testimonials = mapContentfulTestimonials({ items: [response] });
    return testimonials.length > 0 ? testimonials[0] : null;
  } catch (error) {
    console.error('Error fetching testimonial by ID from Contentful:', error);
    return null;
  }
} 