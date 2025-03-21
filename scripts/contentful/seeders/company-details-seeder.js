require('dotenv').config();
const contentful = require('contentful-management');

// Initialize the contentful management client
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
});

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

// Sample company details data
const companyDetailsData = {
    companyName: 'Daniel One Four',
    heroTitle: 'Transforming Organizations Through Strategic Innovation',
    heroDescription: 'We help businesses navigate complex challenges with innovative solutions that drive growth and create lasting impact.',
    introTitle: 'About Our Company',
    introDescription: 'Founded in 2020, Daniel One Four specializes in providing strategic consulting services to businesses of all sizes. Our team of experts brings decades of combined experience across various industries, enabling us to deliver tailored solutions that address your unique challenges.',
    introTagLine: 'Innovation. Excellence. Results.',
    primaryPhoneNumber: '+1 (555) 123-4567',
    primaryEmail: 'info@danielonefour.com',
    secondaryPhoneNumbers: [
        '+1 (555) 765-4321',
        '+1 (555) 987-6543'
    ],
    secondaryEmails: [
        'support@danielonefour.com',
        'careers@danielonefour.com'
    ],
    streetAddress: '123 Innovation Drive, Suite 400\nTech District',
    country: 'United States',
    postCode: '10001',
    socialMedias: {
        facebook: 'https://facebook.com/danielonefour',
        twitter: 'https://twitter.com/danielonefour',
        linkedin: 'https://linkedin.com/company/danielonefour',
        instagram: 'https://instagram.com/danielonefour'
    }
};

async function seedCompanyDetails() {
    try {
        console.log('Starting to seed company details...');

        // Get space and environment
        const space = await client.getSpace(spaceId);
        const environment = await space.getEnvironment(environmentId);

        // Check if company details already exist
        const entries = await environment.getEntries({
            content_type: 'companyDetails'
        });

        if (entries.items.length > 0) {
            console.log('Company details already exist. Updating first entry...');
            const entry = entries.items[0];

            // Update fields
            entry.fields = {
                companyName: { 'en-US': companyDetailsData.companyName },
                heroTitle: { 'en-US': companyDetailsData.heroTitle },
                heroDescription: { 'en-US': companyDetailsData.heroDescription },
                introTitle: { 'en-US': companyDetailsData.introTitle },
                introDescription: { 'en-US': companyDetailsData.introDescription },
                introTagLine: { 'en-US': companyDetailsData.introTagLine },
                primaryPhoneNumber: { 'en-US': companyDetailsData.primaryPhoneNumber },
                primaryEmail: { 'en-US': companyDetailsData.primaryEmail },
                secondaryPhoneNumbers: { 'en-US': companyDetailsData.secondaryPhoneNumbers },
                secondaryEmails: { 'en-US': companyDetailsData.secondaryEmails },
                streetAddress: { 'en-US': companyDetailsData.streetAddress },
                country: { 'en-US': companyDetailsData.country },
                postCode: { 'en-US': companyDetailsData.postCode },
                socialMedias: { 'en-US': companyDetailsData.socialMedias }
            };

            await entry.update();
            await entry.publish();
            console.log('Company details updated successfully!');
        } else {
            console.log('Creating new company details entry...');
            // Create entry
            const entry = await environment.createEntry('companyDetails', {
                fields: {
                    companyName: { 'en-US': companyDetailsData.companyName },
                    heroTitle: { 'en-US': companyDetailsData.heroTitle },
                    heroDescription: { 'en-US': companyDetailsData.heroDescription },
                    introTitle: { 'en-US': companyDetailsData.introTitle },
                    introDescription: { 'en-US': companyDetailsData.introDescription },
                    introTagLine: { 'en-US': companyDetailsData.introTagLine },
                    primaryPhoneNumber: { 'en-US': companyDetailsData.primaryPhoneNumber },
                    primaryEmail: { 'en-US': companyDetailsData.primaryEmail },
                    secondaryPhoneNumbers: { 'en-US': companyDetailsData.secondaryPhoneNumbers },
                    secondaryEmails: { 'en-US': companyDetailsData.secondaryEmails },
                    streetAddress: { 'en-US': companyDetailsData.streetAddress },
                    country: { 'en-US': companyDetailsData.country },
                    postCode: { 'en-US': companyDetailsData.postCode },
                    socialMedias: { 'en-US': companyDetailsData.socialMedias }
                }
            });

            // Publish entry
            await entry.publish();
            console.log('Company details created and published successfully!');
        }
    } catch (error) {
        console.error('Error seeding company details:', error);
    }
}

// Execute the seeder function
seedCompanyDetails(); 