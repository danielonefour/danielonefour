import { createClient, Entry } from 'contentful';

// Slider interface
export interface Slide {
  id: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  image: string;
  order: number;
  active: boolean;
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Map Contentful response to Slide objects
function mapContentfulSlides(entries: any): Slide[] {
  if (!entries?.items?.length) return [];
  
  return entries.items.map((item: Entry<any>) => {
    const fields = item.fields;
    const imageUrl = fields.image?.fields?.file?.url 
      ? `https:${fields.image.fields.file.url}` 
      : '';
    
    return {
      id: item.sys.id,
      title: fields.title || '',
      description: fields.description || '',
      buttonText: fields.buttonText || undefined,
      buttonLink: fields.buttonLink || undefined,
      image: imageUrl,
      order: fields.order || 999,
      active: fields.active !== undefined ? fields.active : true,
    };
  }).sort((a: Slide, b: Slide) => a.order - b.order);
}

// Get all slides
export async function getAllSlides(): Promise<Slide[]> {
  try {
    const response = await client.getEntries({
      content_type: 'slider',
      order: 'fields.order',
    });
    
    return mapContentfulSlides(response);
  } catch (error) {
    console.error('Error fetching slides from Contentful:', error);
    return [];
  }
}

// Get active slides only
export async function getActiveSlides(): Promise<Slide[]> {
  try {
    const response = await client.getEntries({
      content_type: 'slider',
      'fields.active': true,
      order: 'fields.order',
    });
    
    return mapContentfulSlides(response);
  } catch (error) {
    console.error('Error fetching active slides from Contentful:', error);
    return [];
  }
}

// Get a specific slide by ID
export async function getSlideById(id: string): Promise<Slide | null> {
  try {
    const response = await client.getEntry(id);
    
    if (!response) return null;
    
    const slides = mapContentfulSlides({ items: [response] });
    return slides.length > 0 ? slides[0] : null;
  } catch (error) {
    console.error(`Error fetching slide with ID ${id} from Contentful:`, error);
    return null;
  }
}

// Cache for slides to avoid repeated API calls
let slidesCache: Slide[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Get active slides with caching
export async function getActiveSlidesCached(): Promise<Slide[]> {
  const now = Date.now();
  
  // If we have cached data and it's not expired, return it
  if (slidesCache && (now - lastFetchTime < CACHE_DURATION)) {
    return slidesCache;
  }
  
  // Otherwise fetch fresh data
  try {
    const slides = await getActiveSlides();
    
    // Update cache
    if (slides.length > 0) {
      slidesCache = slides;
      lastFetchTime = now;
    }
    
    return slides;
  } catch (error) {
    console.error('Error fetching cached slides:', error);
    
    // If we have cached data, return it even if expired
    if (slidesCache) {
      return slidesCache;
    }
    
    return [];
  }
} 