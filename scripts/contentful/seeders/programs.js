require('dotenv').config();
const contentful = require('contentful-management');
const fs = require('fs');
const path = require('path');

// Read the programs data from the JSON file
const programsData = require('../../../src/data/programs.json');

// Initialize the contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function seedPrograms() {
    try {
        console.log('Starting to seed programs...');

        // Get the space
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);

        // Get the environment
        const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

        // Loop through the programs data and create entries
        for (const program of programsData) {
            console.log(`Creating/updating program: ${program.title}`);

            try {
                // Check if the program already exists
                const entries = await environment.getEntries({
                    content_type: 'program',
                    'fields.slug': program.slug,
                });

                if (entries.items.length > 0) {
                    console.log(`Program '${program.title}' already exists. Updating...`);

                    // Get the existing entry
                    const entry = entries.items[0];

                    // Update fields
                    updateProgramFields(entry, program);

                    // Save the changes
                    await entry.update();

                    // Publish the entry
                    await entry.publish();

                    console.log(`Program '${program.title}' updated successfully`);
                } else {
                    console.log(`Creating new program: ${program.title}`);

                    // Create a new entry
                    const entry = await environment.createEntry('program', {
                        fields: createProgramFields(program),
                    });

                    // Publish the entry
                    await entry.publish();

                    console.log(`Program '${program.title}' created successfully`);
                }
            } catch (error) {
                console.error(`Error processing program '${program.title}':`, error);
            }
        }

        console.log('Program seeding completed successfully');
    } catch (error) {
        console.error('Error seeding programs:', error);
        process.exit(1);
    }
}

// Helper function to create program fields
function createProgramFields(program) {
    // Convert testimonials from objects to strings
    const testimonialStrings = program.testimonials ?
        program.testimonials.map(t => `"${t.quote}" — ${t.author}`) :
        [];

    return {
        title: {
            'en-US': program.title,
        },
        slug: {
            'en-US': program.slug,
        },
        shortDescription: {
            'en-US': program.shortDescription,
        },
        fullDescription: {
            'en-US': program.fullDescription,
        },
        duration: {
            'en-US': program.duration,
        },
        sessions: {
            'en-US': program.sessions,
        },
        benefits: {
            'en-US': program.benefits,
        },
        features: {
            'en-US': program.features,
        },
        testimonials: {
            'en-US': testimonialStrings,
        },
        pricing: {
            'en-US': program.pricing,
        },
        featured: {
            'en-US': program.featured,
        },
        order: {
            'en-US': program.order,
        },
    };
}

// Helper function to update program fields
function updateProgramFields(entry, program) {
    // Convert testimonials from objects to strings
    const testimonialStrings = program.testimonials ?
        program.testimonials.map(t => `"${t.quote}" — ${t.author}`) :
        [];

    entry.fields.title['en-US'] = program.title;
    entry.fields.slug['en-US'] = program.slug;
    entry.fields.shortDescription['en-US'] = program.shortDescription;
    entry.fields.fullDescription['en-US'] = program.fullDescription;
    // Skip updating the image field if it already exists
    entry.fields.duration['en-US'] = program.duration;
    entry.fields.sessions['en-US'] = program.sessions;
    entry.fields.benefits['en-US'] = program.benefits;
    entry.fields.features['en-US'] = program.features;
    entry.fields.testimonials['en-US'] = testimonialStrings;
    entry.fields.pricing['en-US'] = program.pricing;
    entry.fields.featured['en-US'] = program.featured;
    entry.fields.order['en-US'] = program.order;
}

// Run the seeder
seedPrograms().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 