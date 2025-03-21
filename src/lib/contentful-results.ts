import { createClient, Entry } from 'contentful';

// Result interface
export interface Result {
  id: string;
  number: string;
  title: string;
  description: string;
  order: number;
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Map Contentful response to Result objects
function mapContentfulResults(entries: any): Result[] {
  if (!entries?.items?.length) return [];
  
  return entries.items.map((item: Entry<any>) => {
    const fields = item.fields;
    
    return {
      id: item.sys.id,
      number: fields.number || '',
      title: fields.title || '',
      description: fields.description || '',
      order: fields.order || 999,
    };
  });
}

// Get all results
export async function getAllResults(): Promise<Result[]> {
  try {
    const response = await client.getEntries({
      content_type: 'result',
      order: 'fields.order',
    });
    
    return mapContentfulResults(response);
  } catch (error) {
    console.error('Error fetching results from Contentful:', error);
    return [];
  }
}

// Get specific result by ID
export async function getResultById(id: string): Promise<Result | null> {
  try {
    const response = await client.getEntry(id);
    
    if (!response) return null;
    
    const results = mapContentfulResults({ items: [response] });
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error fetching result by ID from Contentful:', error);
    return null;
  }
} 