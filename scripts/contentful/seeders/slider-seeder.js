require('dotenv').config();
const contentful = require('contentful-management');

// Initialize the contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// Function to create and upload an image asset
async function createImageAsset(environment, name, description, imageUrl) {
    try {
        // For demo purposes, we'll use a placeholder image
        const publicImageUrl = imageUrl || 'https://via.placeholder.com/1920x1080/007bff/ffffff?text=Slider+Image';

        // Create the asset
        const asset = await environment.createAsset({
            fields: {
                title: {
                    'en-US': name
                },
                description: {
                    'en-US': description
                },
                file: {
                    'en-US': {
                        contentType: 'image/jpeg',
                        fileName: `${name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
                        upload: publicImageUrl
                    }
                }
            }
        });

        // Process and publish the asset
        const processedAsset = await asset.processForAllLocales();
        await processedAsset.publish();

        return processedAsset;
    } catch (error) {
        console.error(`Error creating image asset: ${error.message}`);
        throw error;
    }
}

// Sample slider data
const slidersData = [
    {
        title: 'The Best Business Solution Providers',
        description: 'The Majority Have Suffered Alteration In Some Form, By Injected Humour Duis Aute. We Will Take You Anywhere Small Activities Are What We Do Whatever You\'re Into, Get Into Coach. Jesus Loves Coach.',
        buttonText: 'Book Appointment',
        buttonLink: '/contact',
        order: 1,
        active: true,
        imageAsset: {
            name: 'Slider Image 1',
            description: 'Hero slider background image'
        }
    },
    {
        title: 'Professional Business Consulting Services',
        description: 'The Majority Have Suffered Alteration In Some Form, By Injected Humour Duis Aute. We Will Take You Anywhere Small Activities Are What We Do Whatever You\'re Into, Get Into Coach. Jesus Loves Coach.',
        buttonText: 'Book Appointment',
        buttonLink: '/contact',
        order: 2,
        active: true,
        imageAsset: {
            name: 'Slider Image 2',
            description: 'Hero slider background image'
        }
    },
    {
        title: 'Strategic Planning & Business Growth',
        description: 'The Majority Have Suffered Alteration In Some Form, By Injected Humour Duis Aute. We Will Take You Anywhere Small Activities Are What We Do Whatever You\'re Into, Get Into Coach. Jesus Loves Coach.',
        buttonText: 'Book Appointment',
        buttonLink: '/contact',
        order: 3,
        active: true,
        imageAsset: {
            name: 'Slider Image 3',
            description: 'Hero slider background image'
        }
    }
];

async function seedSliders() {
    try {
        console.log('Starting to seed sliders...');

        // Get space and environment
        const space = await client.getSpace(spaceId);
        const environment = await space.getEnvironment(environmentId);

        // Create each slider entry with its image
        for (const sliderData of slidersData) {
            console.log(`Creating slider: ${sliderData.title}`);

            // First create the image asset
            // const imageAsset = await createImageAsset(
            //     environment,
            //     sliderData.imageAsset?.name,
            //     sliderData.imageAsset?.description
            // );

            // Create the slider entry
            const entry = await environment.createEntry('slider', {
                fields: {
                    title: { 'en-US': sliderData.title },
                    description: { 'en-US': sliderData.description },
                    buttonText: { 'en-US': sliderData.buttonText },
                    buttonLink: { 'en-US': sliderData.buttonLink },
                    // image: {
                    //     'en-US': {
                    //         sys: {
                    //             type: 'Link',
                    //             linkType: 'Asset',
                    //             id: imageAsset.sys.id
                    //         }
                    //     }
                    // },
                    order: { 'en-US': sliderData.order },
                    active: { 'en-US': sliderData.active }
                }
            });

            // Publish the entry
            await entry.publish();
            console.log(`Created and published slider: ${sliderData.title}`);
        }

        console.log('Sliders seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding sliders:', error);
    }
}

// Execute the seeder function
seedSliders(); 