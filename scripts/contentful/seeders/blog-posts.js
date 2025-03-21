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

// Blog post data
const blogPosts = [
    {
        title: 'How to Achieve Work-Life Balance as a Professional',
        slug: 'work-life-balance',
        excerpt: 'Discover effective strategies to balance your professional responsibilities with personal life and well-being. Learn how to set boundaries, prioritize tasks, and make time for what truly matters.',
        content: `# How to Achieve Work-Life Balance as a Professional

In today's fast-paced business environment, professionals often struggle to balance career demands with personal life. This comprehensive guide provides practical strategies for achieving work-life balance without sacrificing your professional growth.

## Understanding Work-Life Balance

Work-life balance doesn't mean spending equal time on work and personal activities. Rather, it's about creating harmony between the different aspects of your life so that you feel fulfilled and satisfied in both areas.

> "Work-life balance is not about equal time distribution, but about equal energy and focus distribution." - Unknown

## Setting Clear Boundaries

One of the most important strategies for maintaining work-life balance is establishing clear boundaries between your professional and personal life. This means:

1. Defining specific work hours and sticking to them
2. Creating a dedicated workspace if working remotely
3. Communicating your boundaries clearly to colleagues and supervisors
4. Turning off work notifications outside of working hours

## Prioritizing Your Health

Your physical and mental well-being should always be a priority. Make time for:

- Regular exercise (even short walks make a difference)
- Nutritious meals (avoid eating at your desk)
- Adequate sleep (7-8 hours per night)
- Mindfulness practices like meditation or deep breathing

## Effective Time Management

Master your time with these techniques:

- Use the Pomodoro Technique (25 minutes of focused work, followed by 5-minute breaks)
- Batch similar tasks together
- Schedule your most challenging work during your peak energy hours
- Learn to say no to non-essential commitments

## Conclusion

Achieving work-life balance is an ongoing process that requires intentional effort and regular reassessment. By implementing these strategies, you can create a more fulfilling professional and personal life.`,
        imagePath: 'public/assets/images/blogs',
        imageFileName: 'blog-1.png',
        imageDescription: 'Work-life balance concept with balanced stones',
        date: '2023-06-15',
        author: 'Sarah Johnson',
        category: 'Work-Life Balance',
        tags: ['work-life balance', 'productivity', 'wellness'],
        featured: true
    },
    {
        title: 'The Power of Positive Mindset in Business Leadership',
        slug: 'positive-mindset-leadership',
        excerpt: 'Explore how cultivating a positive mindset can transform your leadership style and business outcomes. Understand the science behind positivity and practical techniques to implement in your daily routine.',
        content: `# The Power of Positive Mindset in Business Leadership

Leadership excellence begins with the right mindset. This article explores how cultivating a positive mindset can transform your leadership capabilities and drive better business outcomes.

## The Science Behind Positive Thinking

Research in positive psychology has shown that optimistic leaders are more resilient, creative, and effective in their roles. When you maintain a positive outlook:

- Your brain releases dopamine and serotonin, enhancing cognitive function
- You become more adept at problem-solving
- Your stress levels decrease, improving decision-making
- You inspire similar positivity in your team members

## Practical Techniques for Developing a Positive Mindset

### 1. Practice Gratitude

> "Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order, confusion into clarity... it makes sense of our past, brings peace for today, and creates a vision for tomorrow." - Melody Beattie

Start and end each day by acknowledging three things you're grateful for. This simple practice rewires your brain to focus on the positive aspects of your professional life.

### 2. Reframe Challenges as Opportunities

When facing difficulties:

1. Identify the challenge clearly
2. List potential positive outcomes
3. Focus on what you can control
4. Create an action plan focused on growth

### 3. Surround Yourself with Positive Influences

Your environment significantly impacts your mindset. Connect with:

- Mentors who demonstrate positive leadership
- Peers who provide constructive feedback
- Industry groups that inspire innovation
- Content that educates and motivates

## The Impact on Your Team

Leaders with positive mindsets create:

- Higher team morale and engagement
- Increased innovation and creativity
- Better conflict resolution
- Stronger organizational culture
- Improved customer experiences

## Conclusion

Developing a positive mindset isn't about ignoring problems or maintaining unrealistic optimism. It's about approaching leadership challenges with resilience, creativity, and a solution-focused attitude. By implementing these strategies, you'll not only transform your leadership effectiveness but also create a more positive and productive work environment for your team.`,
        imagePath: 'public/assets/images/blogs',
        imageFileName: 'blog-2.png',
        imageDescription: 'Business leader with positive mindset guiding team',
        date: '2023-07-22',
        author: 'Michael Chen',
        category: 'Leadership Development',
        tags: ['mindset', 'leadership', 'business growth'],
        featured: true
    },
    {
        title: '5 Essential Communication Skills for Modern Leaders',
        slug: 'communication-skills-leaders',
        excerpt: 'Master the art of effective communication to inspire your team and drive better results. Learn about active listening, nonverbal cues, and how to tailor your message to different audiences.',
        content: `# 5 Essential Communication Skills for Modern Leaders

In today's complex business environment, communication skills separate good leaders from exceptional ones. This guide explores the five communication competencies every leader needs to master.

## 1. Active Listening

Active listening goes beyond simply hearing words. It involves fully engaging with the speaker to understand their message on a deeper level.

### How to practice active listening:

- Maintain eye contact
- Avoid interrupting
- Ask clarifying questions
- Paraphrase what you've heard
- Observe non-verbal cues

> "Most people do not listen with the intent to understand; they listen with the intent to reply." - Stephen R. Covey

## 2. Clear and Concise Messaging

As a leader, your ability to communicate complex ideas simply is crucial.

### Techniques for clear communication:

1. Know your objective before speaking
2. Organize your thoughts logically
3. Eliminate jargon and unnecessary words
4. Use examples and stories to illustrate points
5. Check for understanding

## 3. Empathetic Communication

Empathy is the foundation of trust and psychological safety in teams.

### Developing empathetic communication:

- Consider others' perspectives and experiences
- Acknowledge emotions
- Validate concerns
- Respond with compassion
- Adjust your approach based on individual needs

## 4. Giving Effective Feedback

Constructive feedback drives growth and performance.

### Elements of effective feedback:

- Be timely and specific
- Focus on behaviors, not personality
- Balance positive and constructive comments
- Offer actionable suggestions
- Invite dialogue

## 5. Adaptive Communication Style

Great leaders adjust their communication approach based on:

- The situation (crisis vs. routine)
- The audience (executives, team members, clients)
- Cultural differences
- Communication preferences
- Emotional context

## Conclusion

Mastering these five communication skills will transform your leadership effectiveness. Remember that communication is a two-way process that requires continuous improvement and adaptation. By investing in these abilities, you'll build stronger relationships, inspire greater trust, and achieve better results through your team.`,
        imagePath: 'public/assets/images/blogs',
        imageFileName: 'blog-3.png',
        imageDescription: 'Business team in a communication workshop',
        date: '2023-08-10',
        author: 'Emma Rodriguez',
        category: 'Communication Skills',
        tags: ['communication', 'leadership', 'team building'],
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

// Main function to seed blog posts
async function seedBlogPosts() {
    try {
        console.log('Starting to seed blog posts...');

        // Create Contentful client
        const client = createClient({
            accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
        });

        // Get space and environment
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
        const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || 'master');

        console.log(`Connected to Contentful space: ${space.sys.id}, environment: ${environment.sys.id}`);

        // Check for existing blog posts to avoid duplicates
        const existingEntries = await environment.getEntries({
            content_type: 'blogPost',
            limit: 1000
        });

        const existingSlugs = existingEntries.items.map(entry => entry.fields.slug?.['en-US']);

        // Create blog posts
        for (const post of blogPosts) {
            // Skip if post with this slug already exists
            if (existingSlugs.includes(post.slug)) {
                console.log(`⚠️ Blog post with slug '${post.slug}' already exists. Skipping.`);
                continue;
            }

            console.log(`Creating blog post: ${post.title}`);

            // Upload image if provided
            let asset = null;
            if (post.imagePath && post.imageFileName) {
                asset = await createAndPublishAsset(
                    environment,
                    post.imagePath,
                    post.imageFileName,
                    post.title,
                    post.imageDescription || post.title
                );
            }

            // Create the blog post entry
            const entry = await environment.createEntry('blogPost', {
                fields: {
                    title: {
                        'en-US': post.title
                    },
                    slug: {
                        'en-US': post.slug
                    },
                    excerpt: {
                        'en-US': post.excerpt
                    },
                    content: {
                        'en-US': post.content
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
                    date: {
                        'en-US': post.date
                    },
                    author: {
                        'en-US': post.author
                    },
                    category: {
                        'en-US': post.category
                    },
                    tags: {
                        'en-US': post.tags
                    },
                    featured: {
                        'en-US': !!post.featured
                    }
                }
            });

            // Publish the entry
            await entry.publish();

            console.log(`✅ Successfully created and published blog post: ${post.title}`);
        }

        console.log('Blog posts seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding blog posts:', error);
        process.exit(1);
    }
}

// Run the seeder
seedBlogPosts(); 