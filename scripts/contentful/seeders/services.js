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

// Service data
const services = [
    {
        title: 'Personal Coaching',
        slug: 'personal-coaching',
        description: 'Personalized coaching to help you overcome obstacles and achieve your personal goals.',
        content: `Personal coaching is a collaborative relationship designed to help you identify and achieve your personal and professional goals. Our coaches provide support, accountability, and strategies tailored to your unique situation.

Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. 

Our personal coaching services help you:
- Clarify your vision and set meaningful goals
- Develop actionable strategies to achieve your goals
- Overcome limiting beliefs and behaviors
- Build confidence and resilience
- Create sustainable work-life balance

Each coaching relationship is unique and tailored to your specific needs, challenges, and aspirations.`,
        imagePath: 'public/assets/images/services',
        imageFileName: 'service-1.png',
        imageDescription: 'Personal Coaching',
        benefits: [
            'Personalized guidance and support',
            'Clarity on goals and priorities',
            'Improved self-awareness',
            'Enhanced decision-making skills',
            'Greater accountability'
        ],
        faqs: [
            {
                question: 'What is personal coaching?',
                answer: 'Personal coaching is a collaborative relationship designed to help you identify and achieve your personal and professional goals. Our coaches provide support, accountability, and strategies tailored to your unique situation.'
            },
            {
                question: 'How often will we meet?',
                answer: 'Typically, coaching sessions are scheduled weekly or bi-weekly, depending on your needs and availability. Each session lasts approximately 60 minutes.'
            },
            {
                question: 'How long does the coaching process take?',
                answer: 'The duration varies based on your goals. Some clients work with a coach for 3-6 months, while others maintain a coaching relationship for a year or more to support ongoing growth and development.'
            },
            {
                question: 'What should I expect from my first session?',
                answer: 'Your first session will focus on getting to know each other, clarifying your goals, and establishing expectations for the coaching relationship. We\'ll also discuss your strengths, challenges, and what you hope to achieve through coaching.'
            }
        ],
        order: 1,
        featured: true
    },
    {
        title: 'Executive Coaching',
        slug: 'executive-coaching',
        description: 'Specialized coaching for executives and leaders to enhance leadership effectiveness and drive organizational success.',
        content: `Executive coaching is a personalized development process that helps leaders enhance their effectiveness, make better decisions, and achieve their professional goals while balancing organizational needs.

Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. 

Our executive coaching programs are designed to:
- Enhance leadership capabilities and executive presence
- Develop strategic thinking and decision-making skills
- Improve team management and organizational effectiveness
- Navigate complex challenges and organizational change
- Achieve sustainable business results

We work with C-suite executives, senior leaders, and high-potential managers across industries.`,
        imagePath: 'public/assets/images/services',
        imageFileName: 'service-2.png',
        imageDescription: 'Executive Coaching',
        benefits: [
            'Enhanced leadership effectiveness',
            'Improved strategic decision-making',
            'Better team management skills',
            'Increased emotional intelligence',
            'Greater organizational impact'
        ],
        faqs: [
            {
                question: 'What is executive coaching?',
                answer: 'Executive coaching is a personalized development process that helps leaders enhance their effectiveness, make better decisions, and achieve their professional goals while balancing organizational needs.'
            },
            {
                question: 'How is executive coaching different from business consulting?',
                answer: 'While consulting typically provides specific business solutions, executive coaching focuses on developing the leader\'s capabilities and insights. Coaches help executives discover their own solutions rather than prescribing them.'
            },
            {
                question: 'Is coaching confidential?',
                answer: 'Yes, our coaching relationships are strictly confidential. This creates a safe space for leaders to explore challenges, vulnerabilities, and growth opportunities with complete honesty.'
            },
            {
                question: 'How do you measure the effectiveness of coaching?',
                answer: 'We establish clear goals and metrics at the beginning of the coaching relationship. Progress is measured through self-assessment, feedback from colleagues, and observable changes in leadership effectiveness and business outcomes.'
            }
        ],
        order: 2,
        featured: true
    },
    {
        title: 'Career Coaching',
        slug: 'career-coaching',
        description: 'Expert guidance for career transitions, advancement, and professional development.',
        content: `Career coaching helps professionals at all stages navigate career transitions, advancement opportunities, and professional development with clarity and confidence.

Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. 

Our career coaching services include:
- Career assessment and exploration
- Job search strategy and execution
- Resume and LinkedIn profile optimization
- Interview preparation and salary negotiation
- Professional development planning
- Career transition support

Whether you're seeking a promotion, considering a career change, or re-entering the workforce, our coaches provide the guidance and support you need to achieve your career goals.`,
        imagePath: 'public/assets/images/services',
        imageFileName: 'service-3.png',
        imageDescription: 'Career Coaching',
        benefits: [
            'Clarity on career direction and goals',
            'Enhanced job search effectiveness',
            'Improved professional branding',
            'Better interview and negotiation skills',
            'Strategic career advancement planning'
        ],
        faqs: [
            {
                question: 'Who can benefit from career coaching?',
                answer: 'Career coaching is valuable for professionals at all stages, including recent graduates, mid-career professionals considering a change, executives seeking advancement, and individuals re-entering the workforce after a break.'
            },
            {
                question: 'What topics are covered in career coaching?',
                answer: 'Career coaching typically addresses career exploration and assessment, job search strategy, resume and LinkedIn optimization, interview preparation, salary negotiation, professional development planning, and career transition support.'
            },
            {
                question: 'How long does career coaching typically last?',
                answer: 'The duration varies based on your goals. Some clients achieve their objectives in 3-6 sessions, while others benefit from ongoing support throughout a job search or career transition, which might last several months.'
            },
            {
                question: 'How do I know if I need a career coach?',
                answer: 'Consider working with a career coach if you\'re feeling stuck or uncertain about your career direction, struggling with a job search, preparing for advancement, or navigating a significant professional transition.'
            }
        ],
        order: 3,
        featured: false
    },
    {
        title: 'Life Coaching',
        slug: 'life-coaching',
        description: 'Holistic coaching to create balance, fulfillment, and purpose in all areas of life.',
        content: `Life coaching is a collaborative partnership that helps you identify and achieve personal goals, overcome obstacles, and create a more fulfilling life. Our coaches provide support, accountability, and strategies tailored to your unique journey.

Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. 

Our life coaching approach addresses:
- Creating meaningful life vision and goals
- Building better relationships and communication
- Improving health and well-being
- Managing life transitions
- Finding greater purpose and fulfillment
- Balancing competing priorities

We partner with you to create positive, lasting change in multiple areas of your life.`,
        imagePath: 'public/assets/images/services',
        imageFileName: 'service-1.png',
        imageDescription: 'Life Coaching',
        benefits: [
            'Greater clarity and life direction',
            'Improved balance across life domains',
            'Enhanced relationship satisfaction',
            'Better stress management skills',
            'Increased overall fulfillment'
        ],
        faqs: [
            {
                question: 'What is life coaching?',
                answer: 'Life coaching is a collaborative partnership that helps you identify and achieve personal goals, overcome obstacles, and create a more fulfilling life. Our coaches provide support, accountability, and strategies tailored to your unique journey.'
            },
            {
                question: 'How is life coaching different from therapy?',
                answer: 'While therapy often focuses on healing past issues and treating mental health conditions, life coaching is future-oriented and action-focused. Coaches help functional individuals bridge the gap between where they are and where they want to be.'
            },
            {
                question: 'What areas of life can coaching address?',
                answer: 'Life coaching can address various aspects of life including career transitions, relationships, work-life balance, personal growth, health and wellness goals, financial planning, and finding greater meaning and purpose.'
            },
            {
                question: 'How do I know if life coaching is right for me?',
                answer: 'Life coaching may be right for you if you feel stuck or unsatisfied in some area of life, want to make changes but aren\'t sure how, seek greater clarity about your goals, or need support in taking action toward your aspirations.'
            }
        ],
        order: 4,
        featured: false
    },
    {
        title: 'Business Coaching',
        slug: 'business-coaching',
        description: 'Strategic coaching for entrepreneurs and business owners to accelerate growth and maximize potential.',
        content: `Business coaching helps entrepreneurs and business owners develop strategies for sustainable growth and success, overcome challenges, and achieve their business goals.

Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. 

Our business coaching services focus on:
- Business strategy and planning
- Revenue growth and profitability
- Team building and leadership development
- Systems and process optimization
- Work-life balance for entrepreneurs
- Business transition planning

We combine business expertise with coaching methodologies to help you build a successful, sustainable business.`,
        imagePath: 'public/assets/images/services',
        imageFileName: 'service-2.png',
        imageDescription: 'Business Coaching',
        benefits: [
            'Clearer business vision and strategy',
            'Improved revenue and profitability',
            'Enhanced leadership capabilities',
            'Better systems and processes',
            'Greater work-life balance'
        ],
        faqs: [
            {
                question: 'Who is business coaching for?',
                answer: 'Business coaching is valuable for entrepreneurs, founders, business owners, and executives who want to grow their businesses, overcome challenges, and achieve greater success and fulfillment in their roles.'
            },
            {
                question: 'How does business coaching differ from consulting?',
                answer: 'While consultants typically provide specific solutions based on their expertise, business coaches help clients develop their own solutions through a collaborative process of discovery, goal-setting, and accountability.'
            },
            {
                question: 'What results can I expect from business coaching?',
                answer: 'Results vary depending on your goals, but common outcomes include increased revenue and profitability, improved team performance, better systems and processes, enhanced leadership capabilities, and greater work-life balance.'
            },
            {
                question: 'How long should I expect to work with a business coach?',
                answer: 'Most business coaching relationships last between 6-12 months, with sessions typically occurring biweekly or monthly. The duration depends on your specific goals and the complexity of the challenges you\'re addressing.'
            }
        ],
        order: 5,
        featured: true
    },
    {
        title: 'Team Coaching',
        slug: 'team-coaching',
        description: 'Collaborative coaching to improve team dynamics, communication, and performance.',
        content: `Team coaching enhances team dynamics, communication, and performance through a collaborative process that addresses both individual contributions and collective capabilities.

Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. 

Our team coaching programs help teams:
- Clarify purpose, roles, and responsibilities
- Improve communication and collaboration
- Build trust and psychological safety
- Enhance decision-making processes
- Navigate conflict effectively
- Increase overall team performance

We work with executive teams, project teams, and intact work groups across organizations and industries.`,
        imagePath: 'public/assets/images/services',
        imageFileName: 'service-3.png',
        imageDescription: 'Team Coaching',
        benefits: [
            'Improved team collaboration',
            'Enhanced communication skills',
            'Greater trust and psychological safety',
            'More effective conflict resolution',
            'Increased team performance'
        ],
        faqs: [
            {
                question: 'What is team coaching?',
                answer: 'Team coaching is a collaborative process that helps teams improve their collective performance by enhancing dynamics, communication, and effectiveness. It addresses both individual contributions and team capabilities.'
            },
            {
                question: 'How is team coaching different from team building?',
                answer: 'While team building typically focuses on activities designed to improve relationships and morale, team coaching is a more comprehensive approach that addresses underlying team dynamics, processes, and performance over time.'
            },
            {
                question: 'What types of teams benefit from team coaching?',
                answer: 'Team coaching is valuable for executive teams, project teams, intact work groups, and cross-functional teams. It\'s particularly helpful for teams facing challenges, undergoing transitions, or seeking to elevate their performance.'
            },
            {
                question: 'How long does team coaching typically last?',
                answer: 'Team coaching engagements typically span 3-6 months, with sessions occurring every 2-4 weeks. The duration depends on the team\'s goals, challenges, and the complexity of the issues being addressed.'
            }
        ],
        order: 6,
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

// Main function to seed services
async function seedServices() {
    try {
        console.log('Starting to seed services...');

        // Create Contentful client
        const client = createClient({
            accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
        });

        // Get space and environment
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

        console.log(`Connected to Contentful space: ${space.sys.id}, environment: ${environment.sys.id}`);

        // Check for existing services to avoid duplicates
        const existingEntries = await environment.getEntries({
            content_type: 'service',
            limit: 1000
        });

        const existingSlugs = existingEntries.items.map(entry => entry.fields.slug?.['en-US']);

        // Update the FAQs in each service to use JSON strings instead of objects
        services.forEach(service => {
            // Convert FAQ objects to JSON strings
            service.faqs = service.faqs.map(faq =>
                JSON.stringify({
                    question: faq.question,
                    answer: faq.answer
                })
            );
        });

        // Create services
        for (const service of services) {
            // Skip if service with this slug already exists
            if (existingSlugs.includes(service.slug)) {
                console.log(`⚠️ Service with slug '${service.slug}' already exists. Skipping.`);
                continue;
            }

            console.log(`Creating service: ${service.title}`);

            // Upload image if provided
            let asset = null;
            if (service.imagePath && service.imageFileName) {
                asset = await createAndPublishAsset(
                    environment,
                    service.imagePath,
                    service.imageFileName,
                    service.title,
                    service.imageDescription || service.title
                );
            }

            // Create the service entry
            const entry = await environment.createEntry('service', {
                fields: {
                    title: {
                        'en-US': service.title
                    },
                    slug: {
                        'en-US': service.slug
                    },
                    description: {
                        'en-US': service.description
                    },
                    content: {
                        'en-US': service.content
                    },
                    featuredImage: asset ? {
                        'en-US': {
                            sys: {
                                type: 'Link',
                                linkType: 'Asset',
                                id: asset.sys.id
                            }
                        }
                    } : undefined,
                    benefits: {
                        'en-US': service.benefits
                    },
                    faqsJson: {
                        'en-US': JSON.stringify(service.faqs)
                    },
                    order: {
                        'en-US': service.order
                    },
                    featured: {
                        'en-US': !!service.featured
                    }
                }
            });

            // Publish the entry
            await entry.publish();

            console.log(`✅ Successfully created and published service: ${service.title}`);
        }

        console.log('Services seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding services:', error);
        process.exit(1);
    }
}

// Run the seeder
seedServices(); 