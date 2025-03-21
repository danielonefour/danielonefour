require('dotenv').config();
const contentful = require('contentful-management');
const fs = require('fs');
const path = require('path');

// Read the whyChooseUs data from the JSON file
const whyChooseUsData = require('../../../src/data/why-choose-us.json');

// Initialize the contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function seedWhyChooseUs() {
    try {
        console.log('Starting to seed Why Choose Us items...');

        // Get the space
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);

        // Get the environment
        const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

        // Loop through the whyChooseUs data and create entries
        for (const item of whyChooseUsData) {
            console.log(`Creating/updating Why Choose Us item: ${item.title}`);

            try {
                // Check if the item already exists
                const entries = await environment.getEntries({
                    content_type: 'whyChooseUs',
                    'fields.title': item.title,
                });

                if (entries.items.length > 0) {
                    console.log(`Item '${item.title}' already exists. Updating...`);

                    // Get the existing entry
                    const entry = entries.items[0];

                    // Update fields
                    entry.fields.title['en-US'] = item.title;
                    entry.fields.content['en-US'] = item.content;
                    entry.fields.order['en-US'] = item.order;

                    // Save the changes
                    await entry.update();

                    // Publish the entry
                    await entry.publish();

                    console.log(`Item '${item.title}' updated successfully`);
                } else {
                    console.log(`Creating new item: ${item.title}`);

                    // Create a new entry
                    const entry = await environment.createEntry('whyChooseUs', {
                        fields: {
                            title: {
                                'en-US': item.title,
                            },
                            content: {
                                'en-US': item.content,
                            },
                            order: {
                                'en-US': item.order,
                            },
                        },
                    });

                    // Publish the entry
                    await entry.publish();

                    console.log(`Item '${item.title}' created successfully`);
                }
            } catch (error) {
                console.error(`Error processing item '${item.title}':`, error);
            }
        }

        console.log('Why Choose Us seeding completed successfully');
    } catch (error) {
        console.error('Error seeding Why Choose Us items:', error);
        process.exit(1);
    }
}

// Run the seeder
seedWhyChooseUs().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 