require('dotenv').config();
const contentful = require('contentful-management');
const fs = require('fs');
const path = require('path');

// Read the testimonials data from the JSON file
const testimonialsData = require('../../../src/data/testimonials.json');

// Initialize the contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function seedTestimonials() {
    try {
        console.log('Starting to seed testimonials...');

        // Get the space
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);

        // Get the environment
        const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

        // Loop through the testimonials data and create entries
        for (const testimonial of testimonialsData) {
            console.log(`Creating/updating testimonial: ${testimonial.name}`);

            try {
                // Check if the testimonial already exists
                const entries = await environment.getEntries({
                    content_type: 'testimonial',
                    'fields.name': testimonial.name,
                });

                // Initialize imageAsset as null
                let imageAsset = null;

                // Only process image if it exists
                if (testimonial.image) {
                    // Image path is relative to public directory
                    const imagePath = path.join(process.cwd(), 'public', testimonial.image);
                    const fileName = path.basename(testimonial.image);

                    // Check if image file exists
                    if (fs.existsSync(imagePath)) {
                        console.log(`Uploading image: ${fileName}`);

                        // Create asset
                        const asset = await environment.createAsset({
                            fields: {
                                title: {
                                    'en-US': `${testimonial.name} Image`,
                                },
                                description: {
                                    'en-US': `Testimonial image for ${testimonial.name}`,
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
                    console.log(`Testimonial '${testimonial.name}' already exists. Updating...`);

                    // Get the existing entry
                    const entry = entries.items[0];

                    // Update fields
                    updateTestimonialFields(entry, testimonial, imageAsset);

                    // Save the changes
                    await entry.update();

                    // Publish the entry
                    await entry.publish();

                    console.log(`Testimonial '${testimonial.name}' updated successfully`);
                } else {
                    console.log(`Creating new testimonial: ${testimonial.name}`);

                    // Create a new entry
                    const entry = await environment.createEntry('testimonial', {
                        fields: createTestimonialFields(testimonial, imageAsset),
                    });

                    // Publish the entry
                    await entry.publish();

                    console.log(`Testimonial '${testimonial.name}' created successfully`);
                }
            } catch (error) {
                console.error(`Error processing testimonial '${testimonial.name}':`, error);
            }
        }

        console.log('Testimonial seeding completed successfully');
    } catch (error) {
        console.error('Error seeding testimonials:', error);
        process.exit(1);
    }
}

// Helper function to create testimonial fields
function createTestimonialFields(testimonial, imageAsset) {
    const fields = {
        name: {
            'en-US': testimonial.name,
        },
        quote: {
            'en-US': testimonial.quote,
        },
        featured: {
            'en-US': testimonial.featured || false,
        },
        order: {
            'en-US': testimonial.order || 999,
        },
    };

    // Add optional fields if they exist
    if (testimonial.role) {
        fields.role = {
            'en-US': testimonial.role,
        };
    }

    if (testimonial.company) {
        fields.company = {
            'en-US': testimonial.company,
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

// Helper function to update testimonial fields
function updateTestimonialFields(entry, testimonial, imageAsset) {
    entry.fields.name['en-US'] = testimonial.name;
    entry.fields.quote['en-US'] = testimonial.quote;

    // Update optional fields if they exist
    if (testimonial.role) {
        if (!entry.fields.role) {
            entry.fields.role = { 'en-US': testimonial.role };
        } else {
            entry.fields.role['en-US'] = testimonial.role;
        }
    }

    if (testimonial.company) {
        if (!entry.fields.company) {
            entry.fields.company = { 'en-US': testimonial.company };
        } else {
            entry.fields.company['en-US'] = testimonial.company;
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

    entry.fields.featured['en-US'] = testimonial.featured || false;
    entry.fields.order['en-US'] = testimonial.order || 999;
}

// Run the seeder
seedTestimonials().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 