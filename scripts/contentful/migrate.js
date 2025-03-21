#!/usr/bin/env node

require('dotenv').config();
const { runMigration } = require('contentful-migration');
const path = require('path');
const fs = require('fs');

// List of available migrations
const availableMigrations = [
    'create-team-member-content-model',
    'create-blog-post-content-model'
];

// Validate environment variables
const requiredEnvVars = [
    'CONTENTFUL_MANAGEMENT_TOKEN',
    'CONTENTFUL_SPACE_ID',
    'CONTENTFUL_ENVIRONMENT'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Error: Missing required environment variables:');
    missingEnvVars.forEach(envVar => console.error(`- ${envVar}`));
    console.error('Please set these variables in your .env file or environment.');
    process.exit(1);
}

// Get migration name from command line arguments
const args = process.argv.slice(2);
const migrationName = args[0];

// If no migration name is provided, show available migrations
if (!migrationName) {
    console.log('Available migrations:');
    availableMigrations.forEach(migration => console.log(`- ${migration}`));
    console.log('\nUsage: node migrate.js <migration-name>');
    console.log('To run all migrations: node migrate.js all');
    process.exit(0);
}

// Function to run a single migration
async function runSingleMigration(migrationName) {
    if (!availableMigrations.includes(migrationName)) {
        console.error(`Error: Migration "${migrationName}" not found.`);
        console.log('Available migrations:');
        availableMigrations.forEach(migration => console.log(`- ${migration}`));
        return false;
    }

    const migrationFilePath = path.resolve(__dirname, 'migrations', `${migrationName}.js`);

    if (!fs.existsSync(migrationFilePath)) {
        console.error(`Error: Migration file not found at ${migrationFilePath}`);
        return false;
    }

    console.log(`Running migration: ${migrationName}`);

    try {
        await runMigration({
            filePath: migrationFilePath,
            accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
            spaceId: process.env.CONTENTFUL_SPACE_ID,
            environmentId: process.env.CONTENTFUL_ENVIRONMENT,
            yes: true
        });
        console.log(`Migration completed successfully: ${migrationName}`);
        return true;
    } catch (error) {
        console.error(`Error running migration ${migrationName}:`, error);
        return false;
    }
}

// Main function to run migrations
async function runMigrations() {
    if (migrationName === 'all') {
        console.log('Running all migrations...');

        let allSuccessful = true;

        for (const migration of availableMigrations) {
            const success = await runSingleMigration(migration);
            if (!success) {
                allSuccessful = false;
            }
        }

        if (allSuccessful) {
            console.log('All migrations completed successfully!');
        } else {
            console.error('Some migrations failed. Check the logs for details.');
            process.exit(1);
        }
    } else {
        const success = await runSingleMigration(migrationName);
        if (!success) {
            process.exit(1);
        }
    }
}

runMigrations().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
}); 