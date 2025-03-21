import { createClient, Entry } from 'contentful';

// WhyChooseUsItem interface
export interface WhyChooseUsItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  order: number;
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Map Contentful response to WhyChooseUsItem objects
function mapContentfulWhyChooseUsItems(entries: any): WhyChooseUsItem[] {
  if (!entries?.items?.length) return [];
  
  return entries.items.map((item: Entry<any>) => {
    const fields = item.fields;
    const iconUrl = fields.icon?.fields?.file?.url 
      ? `https:${fields.icon.fields.file.url}` 
      : undefined;
    
    return {
      id: item.sys.id,
      title: fields.title || '',
      content: fields.content || '',
      icon: iconUrl,
      order: fields.order || 999,
    };
  });
}

// Get all WhyChooseUs items
export async function getAllWhyChooseUsItems(): Promise<WhyChooseUsItem[]> {
  try {
    const response = await client.getEntries({
      content_type: 'whyChooseUs',
      order: 'fields.order',
    });
    
    return mapContentfulWhyChooseUsItems(response);
  } catch (error) {
    console.error('Error fetching WhyChooseUs items from Contentful:', error);
    return [];
  }
}

// Get WhyChooseUs item by ID
export async function getWhyChooseUsItemById(id: string): Promise<WhyChooseUsItem | null> {
  try {
    const response = await client.getEntry(id);
    
    if (!response) return null;
    
    const items = mapContentfulWhyChooseUsItems({ items: [response] });
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error('Error fetching WhyChooseUs item by ID from Contentful:', error);
    return null;
  }
} 