#!/usr/bin/env node

require('dotenv').config();
const { runMigration } = require('contentful-migration');
const path = require('path');
const { LiaTerminalSolid } = require('react-icons/lia');

// List of migrations to run in order
const migrations = [
    // '01-create-author',
    // '02-create-category',
    // '03-create-blog-post',
    // '04-create-service',
    // '05-create-program',
    // '06-create-why-choose-us',
    // '07-create-testimonial',
    // '08-create-event',
    // '08-create-result',
    // '09-create-client',
    // '10-create-company-details',
    // '11-create-slider',
    // '12-create-contact-submissions',
    // '13-create-newsletter-subscribers',
    '14-create-event-registrations',
];

// Configuration options
const options = {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    environmentId: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    yes: true, // Skip confirmation prompt
};

// Run migrations in sequence
async function runMigrations() {
    for (const migration of migrations) {
        console.log(`Running migration: ${migration}`);

        try {
            await runMigration({
                ...options,
                filePath: `${__dirname}/migrations/${migration}.js`,
            });
            console.log(`Migration complete: ${migration}`);
        } catch (error) {
            console.error(`Error running migration ${migration}:`, error);
            process.exit(1);
        }
    }

    console.log('All migrations completed successfully!');
}

runMigrations(); 