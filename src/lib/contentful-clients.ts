import { createClient, Entry } from 'contentful';

// Client interface
export interface Client {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  featured: boolean;
  order: number;
}

// Replace module-level client initialization with a singleton lazy getter
let contentfulClient: any = null;

function getClient() {
  if (!contentfulClient) {
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    
    if (!spaceId || !accessToken) {
      console.error('Contentful environment variables missing in contentful-clients.ts');
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

// Map Contentful response to Client objects
function mapContentfulClients(entries: any): Client[] {
  if (!entries?.items?.length) return [];
  
  return entries.items.map((item: Entry<any>) => {
    const fields = item.fields;
    const logoUrl = fields.logo?.fields?.file?.url 
      ? `https:${fields.logo.fields.file.url}` 
      : undefined;
    
    return {
      id: item.sys.id,
      name: fields.name || '',
      logo: logoUrl,
      website: fields.website || undefined,
      featured: !!fields.featured,
      order: fields.order || 999,
    };
  });
}

// Get all clients
export async function getAllClients(): Promise<Client[]> {
  try {
    const response = await getClient().getEntries({
      content_type: 'client',
      order: 'fields.order',
    });
    
    return mapContentfulClients(response);
  } catch (error) {
    console.error('Error fetching clients from Contentful:', error);
    return [];
  }
}

// Get featured clients
export async function getFeaturedClients(): Promise<Client[]> {
  try {
    const response = await getClient().getEntries({
      content_type: 'client',
      'fields.featured': true,
      order: 'fields.order',
    });
    
    return mapContentfulClients(response);
  } catch (error) {
    console.error('Error fetching featured clients from Contentful:', error);
    return [];
  }
}

// Get specific client by ID
export async function getClientById(id: string): Promise<Client | null> {
  try {
    const response = await getClient().getEntry(id);
    
    if (!response) return null;
    
    const clients = mapContentfulClients({ items: [response] });
    return clients.length > 0 ? clients[0] : null;
  } catch (error) {
    console.error('Error fetching client by ID from Contentful:', error);
    return null;
  }
} 