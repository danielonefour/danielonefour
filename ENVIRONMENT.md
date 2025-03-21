# Environment Variable Configuration

This document explains how to set up environment variables for this Next.js application with Contentful integration.

## Environment Files

Next.js loads environment variables in the following order:

1. `.env.$(NODE_ENV).local` (e.g., `.env.development.local`)
2. `.env.local`
3. `.env.$(NODE_ENV)` (e.g., `.env.development`)
4. `.env`

## Required Environment Variables

For Contentful integration, the following variables are required:

### Server-Side Variables
These variables are used on the server side and should be defined in `.env.local`:

```
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_access_token_here
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_access_token_here
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_PREVIEW=false
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here (for migrations only)
```

### Client-Side Variables
For client-side access, duplicate the variables with a `NEXT_PUBLIC_` prefix:

```
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id_here
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_delivery_access_token_here
NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_access_token_here
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=master
NEXT_PUBLIC_CONTENTFUL_PREVIEW=false
```

## Important Notes

1. **Next.js Configuration**: The variables are exposed to both server and client-side through `next.config.mjs`.

2. **Type Safety**: TypeScript declaration files are included to ensure type safety when working with Contentful.

3. **Development Mode**: In development, the application provides mock clients if Contentful credentials are missing to prevent crashes.

4. **Preview Mode**: Set `CONTENTFUL_PREVIEW=true` or `NEXT_PUBLIC_CONTENTFUL_PREVIEW=true` to enable preview mode, which shows draft content.

## Troubleshooting

If you encounter environment variable issues:

1. Check that the variables are correctly defined in `.env.local` or `.env.development.local`
2. Restart the Next.js development server
3. Check the console output at startup for environment variable status logs
4. Ensure the environment variables are properly exposed in `next.config.mjs`

## Environment Variable Status Log

On application startup in development mode, you'll see a log of environment variable status in the console. This helps diagnose configuration issues:

```
Environment Variables Status:
- CONTENTFUL_SPACE_ID: ✅ or ❌
- NEXT_PUBLIC_CONTENTFUL_SPACE_ID: ✅ or ❌
... and so on
``` 