// Declaration file for contentful

declare module 'contentful' {
  export interface ContentfulClientOptions {
    space: string;
    accessToken: string;
    environment?: string;
    host?: string;
  }

  export interface Entry<T> {
    sys: {
      id: string;
      createdAt: string;
      updatedAt: string;
      [key: string]: any;
    };
    fields: T;
  }

  export interface Asset {
    sys: {
      id: string;
      [key: string]: any;
    };
    fields: {
      title: string;
      file: {
        url: string;
        details: {
          size: number;
          image?: {
            width: number;
            height: number;
          };
        };
        fileName: string;
        contentType: string;
      };
    };
  }

  export interface EntryCollection<T> {
    total: number;
    skip: number;
    limit: number;
    items: Entry<T>[];
  }

  export interface ContentfulClient {
    getEntries<T = any>(query?: any): Promise<EntryCollection<T>>;
    getEntry<T = any>(id: string): Promise<Entry<T>>;
    getAsset(id: string): Promise<Asset>;
    getAssets(query?: any): Promise<{ items: Asset[] }>;
  }

  export function createClient(options: ContentfulClientOptions): ContentfulClient;
} 