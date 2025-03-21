import { createClient } from 'contentful';

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
        getEntries: () => Promise.resolve({ items: [] }),
        getEntry: () => Promise.resolve({ sys: { id: 'mock' }, fields: {} })
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
        getEntries: () => Promise.resolve({ items: [] }),
        getEntry: () => Promise.resolve({ sys: { id: 'mock' }, fields: {} })
      } as any;
    }
    
    throw error;
  }
};

const client = createContentfulClient();

export interface TeamMemberPhoto {
  url: string;
  width: number;
  height: number;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo?: TeamMemberPhoto;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

interface TeamMemberFields {
  name: string;
  position: string;
  bio: string;
  photo?: {
    fields: {
      file: {
        url: string;
        details: {
          image: {
            width: number;
            height: number;
          };
        };
      };
    };
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const entries = await client.getEntries({
      content_type: 'teamMember',
    });

    return entries.items.map((entry: any) => {
      const { fields } = entry;
      
      const photo = fields.photo 
        ? {
            url: `https:${fields.photo.fields.file.url}`,
            width: fields.photo.fields.file.details.image.width,
            height: fields.photo.fields.file.details.image.height,
          }
        : undefined;

      return {
        id: entry.sys.id,
        name: fields.name,
        position: fields.position,
        bio: fields.bio,
        photo,
        socialLinks: fields.socialLinks,
      };
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  try {
    const entry = await client.getEntry(id);
    
    const { fields } = entry;
      
    const photo = fields.photo 
      ? {
          url: `https:${fields.photo.fields.file.url}`,
          width: fields.photo.fields.file.details.image.width,
          height: fields.photo.fields.file.details.image.height,
        }
      : undefined;

    return {
      id: entry.sys.id,
      name: fields.name,
      position: fields.position,
      bio: fields.bio,
      photo,
      socialLinks: fields.socialLinks,
    };
  } catch (error) {
    console.error(`Error fetching team member with ID ${id}:`, error);
    return null;
  }
} 