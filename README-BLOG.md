# Blog Functionality

This document provides instructions for setting up and using the blog functionality in the Daniel-One-Four website.

## Overview

The blog system uses Contentful as a headless CMS to manage blog posts. The following features are implemented:

- Blog listing page with pagination
- Individual blog post pages
- Category filtering
- Tag filtering
- Featured blog posts
- Markdown content support

## Setup

### 1. Set up Contentful

Follow the instructions in `CONTENTFUL.md` to set up your Contentful account and space.

### 2. Run Migrations

Run the blog post content model migration:

```bash
npm run contentful:migrate:single create-blog-post-content-model
```

This will create the Blog Post content model in your Contentful space.

### 3. Seed Blog Posts

Seed your Contentful space with sample blog posts:

```bash
npm run contentful:seed:blog
```

This will create several sample blog posts in your Contentful space.

## Content Structure

### Blog Post

Each blog post has the following fields:

- **Title**: The title of the blog post
- **Slug**: URL-friendly identifier (e.g., "how-to-improve-leadership")
- **Excerpt**: Short summary of the post
- **Content**: Main content in Markdown format
- **Featured Image**: Image displayed at the top of the post
- **Date**: Publication date
- **Author**: Name of the author
- **Category**: One of the predefined categories
- **Tags**: Array of tags related to the post
- **Featured**: Boolean flag to feature the post on the homepage

## Pages

The blog functionality includes the following pages:

1. **Blog Listing** (`/blog`): Displays all blog posts with pagination
2. **Blog Post** (`/blog/[slug]`): Displays a single blog post
3. **Category Page** (`/blog/category/[category]`): Displays posts filtered by category
4. **Tag Page** (`/blog/tag/[tag]`): Displays posts filtered by tag

## Contentful API Functions

The following functions are available in `src/lib/contentful.ts`:

- `getAllBlogPosts()`: Fetches all blog posts
- `getBlogPostBySlug(slug)`: Fetches a single blog post by slug
- `getFeaturedBlogPosts()`: Fetches only featured blog posts
- `getBlogPostsByCategory(category)`: Fetches blog posts by category
- `getBlogCategories()`: Fetches all categories with post counts

## Markdown Processing

Blog post content is stored as Markdown in Contentful and converted to HTML for display using the `remark` and `remark-html` packages.

## Customization

### Adding New Categories

To add new categories, update the `category` field validation in the migration script at `scripts/contentful/migrations/create-blog-post-content-model.js`.

### Styling

The blog components use Tailwind CSS for styling. You can customize the appearance by modifying the component files:

- `src/app/blog/page.tsx`: Blog listing page
- `src/app/blog/[slug]/page.tsx`: Individual blog post page
- `src/app/blog/category/[category]/page.tsx`: Category page
- `src/app/blog/tag/[tag]/page.tsx`: Tag page

## Troubleshooting

### Images Not Displaying

If blog post images are not displaying:

1. Check that the images were properly uploaded to Contentful
2. Verify that the `featuredImage` field is correctly linked to the asset
3. The fallback image will be used if no image is provided

### Content Not Updating

If content changes in Contentful are not reflected on the site:

1. Make sure you've published the changes in Contentful
2. Check that your environment variables are correctly set
3. Clear your browser cache or use incognito mode to test

## Next Steps

Consider implementing these additional features:

1. Search functionality for blog posts
2. Related posts based on categories or tags
3. Author profiles with bio and avatar
4. Social sharing buttons
5. Comments system integration 