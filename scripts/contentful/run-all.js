#!/usr/bin/env node
require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

/**
 * This script runs all Contentful migrations and seeders
 * Note: It assumes you have set up the required environment variables:
 * - CONTENTFUL_SPACE_ID
 * - CONTENTFUL_MANAGEMENT_TOKEN
 * - CONTENTFUL_ENVIRONMENT (optional, defaults to 'master')
 */

const runCommands = () => {
    try {
        // Step 1: Run migrations to create content models
        console.log('📦 Running Contentful migrations...');
        execSync('node scripts/contentful/run-migrations.js', { stdio: 'inherit' });
        console.log('✅ Migrations completed successfully!\n');

        // Step 2: Run seeders to populate data
        console.log('🌱 Running Contentful seeders...');

        // Results seeder
        console.log('\n📊 Seeding Results data...');
        execSync('node scripts/contentful/seeders/results-seeder.js', { stdio: 'inherit' });

        // Clients seeder
        console.log('\n🏢 Seeding Clients data...');
        execSync('node scripts/contentful/seeders/clients-seeder.js', { stdio: 'inherit' });

        console.log('\n✅ All seeders completed successfully!');

        console.log('\n🎉 Content models and demo data have been set up in Contentful!');
        console.log('ℹ️  You can now use this data in your application.');

    } catch (error) {
        console.error('\n❌ Error running scripts:', error.message);
        process.exit(1);
    }
};

// Run the commands
runCommands(); 