require('dotenv').config();
const contentful = require('contentful-management');

// Initialize the contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// Sample results data
const resultsData = [
    {
        number: '58+',
        title: 'Satisfied Clients',
        description: 'The Majority Have Suffered Alteration In Some Form, By Injected Humour, Or Randomised Words.',
        order: 1
    },
    {
        number: '97%',
        title: 'Success Rate',
        description: 'We\'ve helped our clients achieve their goals with a success rate of 97% on completed projects.',
        order: 2
    },
    {
        number: '250+',
        title: 'Projects Completed',
        description: 'We\'ve successfully delivered over 250 projects across various industries and domains.',
        order: 3
    },
    {
        number: '24/7',
        title: 'Customer Support',
        description: 'Our dedicated team provides round-the-clock support to ensure your success at every step.',
        order: 4
    }
];

async function seedResults() {
    try {
        console.log('Starting to seed results...');

        // Get space and environment
        const space = await client.getSpace(spaceId);
        const environment = await space.getEnvironment(environmentId);

        // Create entries
        for (const resultData of resultsData) {
            const entry = await environment.createEntry('result', {
                fields: {
                    number: {
                        'en-US': resultData.number
                    },
                    title: {
                        'en-US': resultData.title
                    },
                    description: {
                        'en-US': resultData.description
                    },
                    order: {
                        'en-US': resultData.order
                    }
                }
            });

            // Publish entry
            await entry.publish();
            console.log(`Created and published result: ${resultData.title}`);
        }

        console.log('Results seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding results:', error);
    }
}

// Execute the seeder function
seedResults(); 