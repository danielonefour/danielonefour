#!/usr/bin/env node

require('dotenv').config();
const path = require('path');
const { execSync } = require('child_process');

// Get the seeder name from command line args
const seederArg = process.argv[2];

// Get list of available seeders
const availableSeeders = [
    'team-members',
    'blog-posts'
];

// Function to run a specific seeder
function runSeeder(seederName) {
    if (!availableSeeders.includes(seederName)) {
        console.error(`Error: Seeder "${seederName}" not found.`);
        console.log(`Available seeders: ${availableSeeders.join(', ')}`);
        process.exit(1);
    }

    const seederPath = path.join(__dirname, 'seeders', `${seederName}.js`);
    console.log(`Running seeder: ${seederName}...`);

    try {
        execSync(`node ${seederPath}`, { stdio: 'inherit' });
        console.log(`Seeder ${seederName} completed successfully.`);
    } catch (error) {
        console.error(`Seeder ${seederName} failed.`);
        process.exit(1);
    }
}

// Function to run all seeders
function runAllSeeders() {
    console.log('Running all seeders...');

    for (const seeder of availableSeeders) {
        runSeeder(seeder);
    }

    console.log('All seeders completed successfully.');
}

// Check if a specific seeder was requested
if (seederArg) {
    runSeeder(seederArg);
} else {
    // If no specific seeder was provided, run all of them
    runAllSeeders();
} 