require('dotenv').config();
const contentful = require('contentful-management');

// Initialize the contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// Sample clients data (without logo references - would need to upload assets first)
const clientsData = [
    {
        name: 'Acme Corporation',
        website: 'https://example.com/acme',
        featured: true,
        order: 1
    },
    {
        name: 'TechStart Inc.',
        website: 'https://example.com/techstart',
        featured: true,
        order: 2
    },
    {
        name: 'Global Solutions Ltd.',
        website: 'https://example.com/globalsolutions',
        featured: true,
        order: 3
    },
    {
        name: 'Innovative Partners',
        website: 'https://example.com/innovative',
        featured: false,
        order: 4
    },
    {
        name: 'Strategic Ventures',
        website: 'https://example.com/strategic',
        featured: false,
        order: 5
    },
    {
        name: 'Elite Enterprises',
        website: 'https://example.com/elite',
        featured: false,
        order: 6
    }
];

async function seedClients() {
    try {
        console.log('Starting to seed clients...');

        // Get space and environment
        const space = await client.getSpace(spaceId);
        const environment = await space.getEnvironment(environmentId);

        // Create entries
        for (const clientData of clientsData) {
            const entry = await environment.createEntry('client', {
                fields: {
                    name: {
                        'en-US': clientData.name
                    },
                    website: {
                        'en-US': clientData.website
                    },
                    featured: {
                        'en-US': clientData.featured
                    },
                    order: {
                        'en-US': clientData.order
                    }
                    // Note: logo field is not included here as it requires asset upload
                    // In a real scenario, you would need to upload the assets first
                    // and then reference them here
                }
            });

            // Publish entry
            await entry.publish();
            console.log(`Created and published client: ${clientData.name}`);
        }

        console.log('Clients seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding clients:', error);
    }
}

// Execute the seeder function
seedClients(); 