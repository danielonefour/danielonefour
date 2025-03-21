#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('contentful-management');

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

// Team member data with professional profiles
const teamMembers = [
    {
        name: 'Sarah Johnson',
        slug: 'sarah-johnson',
        role: 'Executive Coach',
        imagePath: 'public/assets/images/team',
        imageFileName: 'coach-1.png',
        imageDescription: 'Sarah Johnson - Executive Coach',
        bio: `Sarah Johnson is a certified executive coach with over 15 years of experience working with C-suite executives across Fortune 500 companies, tech startups, and nonprofit organizations. 

Her coaching approach combines data-driven insights with emotional intelligence techniques to help leaders navigate complex organizational challenges while maintaining authenticity and purpose.

Before becoming a coach, Sarah held leadership positions at McKinsey & Company and served as COO for a rapidly-scaling tech startup. She holds an MBA from Stanford University and professional certifications from the International Coach Federation.`,
        shortBio: 'Executive coach with 15+ years of experience helping leaders achieve breakthrough results through authentic leadership.',
        email: 'sarah@daniel-one-four.com',
        phone: '+1 (415) 555-0123',
        linkedinUrl: 'https://www.linkedin.com/in/sarahjohnsoncoach',
        twitterUrl: 'https://twitter.com/sarahjcoach',
        featured: true
    },
    {
        name: 'Michael Chen',
        slug: 'michael-chen',
        role: 'Leadership Development Specialist',
        imagePath: 'public/assets/images/team',
        imageFileName: 'coach-2.png',
        imageDescription: 'Michael Chen - Leadership Development Specialist',
        bio: `Michael Chen specializes in transformational leadership development for high-potential managers and directors looking to expand their influence and impact. 

With a background in organizational psychology and 12 years of consulting experience across industries including healthcare, finance, and technology, Michael helps leaders identify and overcome limiting patterns while developing strategic vision and emotional intelligence.

Michael holds a Ph.D. in Organizational Psychology from Columbia University and has authored several research papers on effective leadership in times of organizational change.`,
        shortBio: 'Leadership development specialist helping high-potential managers transform into visionary leaders.',
        email: 'michael@daniel-one-four.com',
        phone: '+1 (628) 555-0456',
        linkedinUrl: 'https://www.linkedin.com/in/michaelchenleadership',
        twitterUrl: 'https://twitter.com/michaelchenleads',
        featured: true
    },
    {
        name: 'Emma Rodriguez',
        slug: 'emma-rodriguez',
        role: 'Performance Coach',
        imagePath: 'public/assets/images/team',
        imageFileName: 'coach-3.png',
        imageDescription: 'Emma Rodriguez - Performance Coach',
        bio: `Emma Rodriguez helps professionals overcome performance plateaus and achieve breakthrough results through targeted coaching interventions.

Combining her background in elite athletics with certifications in neuroscience-based coaching, Emma creates personalized development plans that address limiting beliefs, optimize performance routines, and enhance resilience under pressure.

Before founding her coaching practice, Emma was a management consultant at Bain & Company and an Olympic-level athlete. She holds an MS in Sports Psychology from the University of Michigan.`,
        shortBio: 'Performance coach helping professionals break through plateaus and achieve peak performance in high-pressure situations.',
        email: 'emma@daniel-one-four.com',
        phone: '+1 (510) 555-0789',
        linkedinUrl: 'https://www.linkedin.com/in/emmarodriguezcoach',
        twitterUrl: 'https://twitter.com/emmarodcoach',
        featured: false
    }
];

// Function to create and publish an asset
async function createAndPublishAsset(environment, imagePath, fileName, title, description) {
    try {
        console.log(`Uploading image for ${title}...`);

        // Check if the file exists
        const filePath = path.join(process.cwd(), imagePath, fileName);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ Image file not found: ${filePath}`);
            console.warn(`Continuing without image for ${title}`);
            return null;
        }

        // Read the file
        const fileBuffer = fs.readFileSync(filePath);

        // Create the asset
        const asset = await environment.createAsset({
            fields: {
                title: {
                    'en-US': title
                },
                description: {
                    'en-US': description
                },
                file: {
                    'en-US': {
                        contentType: 'image/png',
                        fileName: fileName,
                        file: fileBuffer
                    }
                }
            }
        });

        // Process the asset
        console.log(`Processing asset for ${title}...`);
        const processedAsset = await asset.processForAllLocales();

        // Publish the asset
        await processedAsset.publish();

        console.log(`✅ Successfully uploaded and published image for ${title}`);
        return processedAsset;
    } catch (error) {
        console.warn(`⚠️ Error uploading image for ${title}:`, error.message);
        console.warn(`Continuing without image for ${title}`);
        return null;
    }
}

// Main function to seed team members
async function seedTeamMembers() {
    try {
        console.log('Starting to seed team members...');

        // Create Contentful client
        const client = createClient({
            accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
        });

        // Get space and environment
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

        console.log(`Connected to Contentful space: ${space.sys.id}, environment: ${environment.sys.id}`);

        // Check for existing team members to avoid duplicates
        const existingEntries = await environment.getEntries({
            content_type: 'teamMember',
            limit: 1000
        });

        const existingSlugs = existingEntries.items.map(entry => entry.fields.slug?.['en-US']);

        // Create team members
        for (const member of teamMembers) {
            // Skip if member with this slug already exists
            if (existingSlugs.includes(member.slug)) {
                console.log(`⚠️ Team member with slug '${member.slug}' already exists. Skipping.`);
                continue;
            }

            console.log(`Creating team member: ${member.name}`);

            // Upload image if provided
            let asset = null;
            if (member.imagePath && member.imageFileName) {
                asset = await createAndPublishAsset(
                    environment,
                    member.imagePath,
                    member.imageFileName,
                    member.name,
                    member.imageDescription || member.name
                );
            }

            // Create the team member entry
            const entry = await environment.createEntry('teamMember', {
                fields: {
                    name: {
                        'en-US': member.name
                    },
                    slug: {
                        'en-US': member.slug
                    },
                    role: {
                        'en-US': member.role
                    },
                    photo: asset ? {
                        'en-US': {
                            sys: {
                                type: 'Link',
                                linkType: 'Asset',
                                id: asset.sys.id
                            }
                        }
                    } : undefined,
                    bio: {
                        'en-US': member.bio
                    },
                    shortBio: {
                        'en-US': member.shortBio
                    },
                    email: member.email ? {
                        'en-US': member.email
                    } : undefined,
                    phone: member.phone ? {
                        'en-US': member.phone
                    } : undefined,
                    linkedinUrl: member.linkedinUrl ? {
                        'en-US': member.linkedinUrl
                    } : undefined,
                    twitterUrl: member.twitterUrl ? {
                        'en-US': member.twitterUrl
                    } : undefined,
                    featured: {
                        'en-US': !!member.featured
                    }
                }
            });

            // Publish the entry
            await entry.publish();

            console.log(`✅ Successfully created and published team member: ${member.name}`);
        }

        console.log('Team members seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding team members:', error);
        process.exit(1);
    }
}

// Run the seeder
seedTeamMembers(); 