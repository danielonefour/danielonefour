# Contentful Integration

This project uses [Contentful](https://www.contentful.com/) as a headless CMS to manage dynamic content. The following documentation explains how to set up and use Contentful with this project.

## Setup

### 1. Create a Contentful account and space

1. Sign up for a Contentful account at [contentful.com](https://www.contentful.com/)
2. Create a new space for this project
3. Note down your Space ID from the space settings

### 2. Configure API keys

1. Go to **Settings > API keys** in your Contentful space
2. Create a new API key or use the default one
3. Note down the following credentials:
   - Space ID
   - Content Delivery API - access token
   - Content Preview API - access token

### 3. Generate a Management Token

1. Go to **Settings > CMA tokens** in your Contentful account settings (not space settings)
2. Create a new Personal Access Token
3. Note down the token (it will be shown only once)

### 4. Configure environment variables

1. Copy the `.env.local.example` file to `.env.local`
2. Fill in the following variables with your Contentful credentials:

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_api_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_content_preview_api_access_token
CONTENTFUL_MANAGEMENT_TOKEN=your_personal_access_token
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_PREVIEW=false
```

## Running Migrations

This project uses a versioned migration system to manage Contentful content models. Migrations are tracked in Contentful, so each migration runs only once, allowing you to evolve your content models over time.

### Running all pending migrations

To run all pending migrations:

```bash
npm run contentful:migrate
```

This will:
1. Check which migrations have already been applied
2. Only run new migrations that haven't been applied yet
3. Track which migrations have been run in Contentful

### Creating new migrations

To create a new migration:

1. Create a new file in `scripts/contentful/migrations/` with an incrementing number prefix (e.g., `03-add-new-field.js`)
2. For new content types, use `migration.createContentType()`
3. For existing content types, use `migration.editContentType()`

Example migration to update an existing content type:

```javascript
module.exports = function(migration) {
  // Update an existing content type
  const contentType = migration.editContentType('existingType');
  
  // Add a new field
  contentType.createField('newField')
    .name('New Field')
    .type('Symbol')
    .required(false);
    
  // Change editor interface
  contentType.changeEditorInterface('newField', 'singleLine', {});
};
```

## Seeding Content

After running migrations to set up your content models, you can populate your Contentful space with initial seed data:

### Seed All Content Types

```bash
npm run contentful:seed
```

### Seed Specific Content Types

To seed only team members:

```bash
npm run contentful:seed:team
```

To seed only blog posts:

```bash
npm run contentful:seed:blog
```

### Customizing Seed Data

The seed data is defined in the `scripts/contentful/seeders` directory. You can modify these files to customize the content before deploying to production:

- `team-members.js` - Contains detailed profiles for team members
- `blog-posts.js` - Contains sample blog posts with markdown content

#### About Image Uploads

The seeders will attempt to upload images from your local file system to Contentful. If the image uploads fail:

1. The seeder will continue creating entries without images
2. You can manually upload images in the Contentful web interface later
3. The image fields are optional in the content models, so missing images won't cause errors

## Content Models

### Team Member

The Team Member content model is used to store information about team members displayed on the About page.

Fields:
- Name (Text) - Required
- Slug (Text) - Required
- Role (Text) - Required
- Photo (Media) - Optional
- Bio (Long text) - Required
- Short Bio (Text, max 120 characters) - Required
- Email (Text, optional)
- Phone (Text, optional)
- LinkedIn Profile URL (Text, optional)
- Twitter Profile URL (Text, optional)
- Featured (Boolean, optional) - Whether to feature this team member on the homepage

### Blog Post

The Blog Post content model is used to store blog articles displayed on the Blog page.

Fields:
- Title (Text, max 120 characters) - Required
- Slug (Text) - Required, must be lowercase, alphanumeric with hyphens
- Excerpt (Text, max 300 characters) - Required
- Content (Long text, Markdown) - Required
- Featured Image (Media) - Optional
- Date (Date) - Required
- Author (Text) - Required
- Category (Text, from predefined list) - Required
- Tags (Array of Text) - Optional, up to 10 tags
- Featured (Boolean) - Optional, whether to feature this post on the homepage

Available categories:
- Business Coaching
- Leadership Development
- Performance Improvement
- Career Growth
- Personal Development
- Team Building
- Work-Life Balance
- Executive Coaching
- Communication Skills
- Productivity

## Usage in Code

The Contentful client is set up in `src/lib/contentful.ts`. This file exports functions to fetch content from Contentful:

```typescript
import { 
  getAllTeamMembers, 
  getTeamMemberBySlug,
  getAllBlogPosts,
  getBlogPostBySlug,
  getFeaturedBlogPosts,
  getBlogPostsByCategory,
  getBlogCategories
} from '@/lib/contentful';

// Fetch all team members
const teamMembers = await getAllTeamMembers();

// Fetch a specific team member by slug
const teamMember = await getTeamMemberBySlug('john-doe');

// Fetch all blog posts
const blogPosts = await getAllBlogPosts();

// Fetch a specific blog post by slug
const blogPost = await getBlogPostBySlug('how-to-improve-leadership');

// Fetch only featured blog posts
const featuredPosts = await getFeaturedBlogPosts();

// Fetch blog posts by category
const leadershipPosts = await getBlogPostsByCategory('Leadership Development');

// Fetch all blog categories with counts
const categories = await getBlogCategories();
```

## Preview Mode

To enable preview mode for draft content, set `CONTENTFUL_PREVIEW=true` in your `.env.local` file. This will use the Preview API to fetch content, allowing you to see draft changes before publishing. 