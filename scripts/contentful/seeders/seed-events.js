require('dotenv').config();
const contentful = require('contentful-management');
const fs = require('fs');
const path = require('path');

// Read the events data from the JSON file
const eventsData = require('../../../src/data/events.json');

// Initialize the contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function seedEvents() {
    try {
        console.log('Starting to seed events...');

        // Get the space
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);

        // Get the environment
        const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

        // Loop through the events data and create entries
        for (const event of eventsData) {
            console.log(`Creating/updating event: ${event.title}`);

            try {
                // Check if the event already exists
                const entries = await environment.getEntries({
                    content_type: 'event',
                    'fields.slug': event.slug,
                });

                // Initialize imageAsset as null
                let imageAsset = null;

                // Only process image if it exists
                if (event.image) {
                    // Image path is relative to public directory
                    const imagePath = path.join(process.cwd(), 'public', event.image);
                    const fileName = path.basename(event.image);

                    // Check if image file exists
                    if (fs.existsSync(imagePath)) {
                        console.log(`Uploading image: ${fileName}`);

                        // Create asset
                        const asset = await environment.createAsset({
                            fields: {
                                title: {
                                    'en-US': `${event.title} Image`,
                                },
                                description: {
                                    'en-US': `Event image for ${event.title}`,
                                },
                                file: {
                                    'en-US': {
                                        contentType: `image/${path.extname(fileName).substring(1)}`,
                                        fileName: fileName,
                                        upload: fs.readFileSync(imagePath),
                                    },
                                },
                            },
                        });

                        // Process and publish the asset
                        const processedAsset = await asset.processForAllLocales();
                        imageAsset = await processedAsset.publish();

                        console.log(`Image uploaded and published: ${fileName}`);
                    } else {
                        console.log(`Warning: Image file not found: ${imagePath}`);
                    }
                }

                if (entries.items.length > 0) {
                    console.log(`Event '${event.title}' already exists. Updating...`);

                    // Get the existing entry
                    const entry = entries.items[0];

                    // Update fields
                    updateEventFields(entry, event, imageAsset);

                    // Save the changes
                    await entry.update();

                    // Publish the entry
                    await entry.publish();

                    console.log(`Event '${event.title}' updated successfully`);
                } else {
                    console.log(`Creating new event: ${event.title}`);

                    // Create a new entry
                    const entry = await environment.createEntry('event', {
                        fields: createEventFields(event, imageAsset),
                    });

                    // Publish the entry
                    await entry.publish();

                    console.log(`Event '${event.title}' created successfully`);
                }
            } catch (error) {
                console.error(`Error processing event '${event.title}':`, error);
            }
        }

        console.log('Event seeding completed successfully');
    } catch (error) {
        console.error('Error seeding events:', error);
        process.exit(1);
    }
}

// Helper function to create event fields
function createEventFields(event, imageAsset) {
    const fields = {
        title: {
            'en-US': event.title,
        },
        slug: {
            'en-US': event.slug,
        },
        description: {
            'en-US': event.description,
        },
        content: {
            'en-US': event.content,
        },
        date: {
            'en-US': event.date,
        },
        location: {
            'en-US': event.location,
        },
        featured: {
            'en-US': event.featured || false,
        },
        order: {
            'en-US': event.order || 999,
        },
    };

    // Add optional fields if they exist
    if (event.time) {
        fields.time = {
            'en-US': event.time,
        };
    }

    if (event.registrationLink) {
        fields.registrationLink = {
            'en-US': event.registrationLink,
        };
    }

    // Add image field if an asset was uploaded
    if (imageAsset) {
        fields.image = {
            'en-US': {
                sys: {
                    type: 'Link',
                    linkType: 'Asset',
                    id: imageAsset.sys.id,
                },
            },
        };
    }

    return fields;
}

// Helper function to update event fields
function updateEventFields(entry, event, imageAsset) {
    entry.fields.title['en-US'] = event.title;
    entry.fields.slug['en-US'] = event.slug;
    entry.fields.description['en-US'] = event.description;
    entry.fields.content['en-US'] = event.content;
    entry.fields.date['en-US'] = event.date;
    entry.fields.location['en-US'] = event.location;

    // Update optional fields if they exist
    if (event.time) {
        if (!entry.fields.time) {
            entry.fields.time = { 'en-US': event.time };
        } else {
            entry.fields.time['en-US'] = event.time;
        }
    }

    if (event.registrationLink) {
        if (!entry.fields.registrationLink) {
            entry.fields.registrationLink = { 'en-US': event.registrationLink };
        } else {
            entry.fields.registrationLink['en-US'] = event.registrationLink;
        }
    }

    // Only update the image if a new one was uploaded
    if (imageAsset) {
        entry.fields.image = {
            'en-US': {
                sys: {
                    type: 'Link',
                    linkType: 'Asset',
                    id: imageAsset.sys.id,
                },
            },
        };
    }

    entry.fields.featured['en-US'] = event.featured || false;
    entry.fields.order['en-US'] = event.order || 999;
}

// Run the seeder
seedEvents().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 