import { createClient, Entry } from 'contentful';

// Event interface
export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  content: any;
  image?: string;
  category?: string;
  featured: boolean;
}

// Response interface
export interface EventsResponse {
  items: Event[];
  total: number;
  skip: number;
  limit: number;
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Map Contentful response to Event objects
function mapContentfulEvents(entries: any): Event[] {
  if (!entries?.items?.length) return [];
  
  return entries.items.map((item: Entry<any>) => {
    const fields = item.fields;
    const imageUrl = fields.image?.fields?.file?.url 
      ? `https:${fields.image.fields.file.url}` 
      : undefined;

      console.log('imageUrl...', imageUrl)
    
    return {
      id: item.sys.id,
      title: fields.title || '',
      slug: fields.slug || '',
      date: fields.date || new Date().toISOString(),
      time: fields.time || undefined,
      location: fields.location || undefined,
      description: fields.description || '',
      content: fields.content || {},
      image: imageUrl,
      category: fields.category || undefined,
      featured: !!fields.featured,
    };
  });
}

// Get all events with pagination
export async function getAllEvents(
  page: number = 1,
  perPage: number = 6
): Promise<EventsResponse> {
  const skip = (page - 1) * perPage;
  
  try {
    const response = await client.getEntries({
      content_type: 'event',
      order: 'fields.date',
      limit: perPage,
      skip,
    });
    
    return {
      items: mapContentfulEvents(response),
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  } catch (error) {
    console.error('Error fetching events from Contentful:', error);
    return { items: [], total: 0, skip: 0, limit: perPage };
  }
}

// Get upcoming events (limit by count)
export async function getUpcomingEvents(count: number = 3): Promise<Event[]> {
  const now = new Date().toISOString();
  
  try {
    const response = await client.getEntries({
      content_type: 'event',
      // Order by date ascending to get the closest upcoming events first
      order: 'fields.date',
      limit: count * 2, // Fetch more than needed to ensure we have enough after filtering
      'fields.endDate[gte]': now,
    });
    
    // Map the events and then sort them by date (closest first)
    const events = mapContentfulEvents(response);
    
    // Sort events by date in ascending order (closest first)
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Return only the requested number of events
    return events.slice(0, count);
  } catch (error) {
    console.error('Error fetching upcoming events from Contentful:', error);
    return [];
  }
}

// Get featured events
export async function getFeaturedEvents(count: number = 3): Promise<Event[]> {
  try {
    const response = await client.getEntries({
      content_type: 'event',
      order: 'fields.date',
      limit: count,
      'fields.featured': true,
    });
    
    return mapContentfulEvents(response);
  } catch (error) {
    console.error('Error fetching featured events from Contentful:', error);
    return [];
  }
}

// Get event by slug
export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const response = await client.getEntries({
      content_type: 'event',
      'fields.slug': slug,
      limit: 1,
    });
    
    const events = mapContentfulEvents(response);
    return events.length > 0 ? events[0] : null;
  } catch (error) {
    console.error('Error fetching event by slug from Contentful:', error);
    return null;
  }
} 