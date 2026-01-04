/** @type {import('next').NextConfig} */
const nextConfig = {
    // Ignore TypeScript errors in the build
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.ctfassets.net',
                port: '',
                pathname: '/**',
            },
        ],
    },
    // Include all Contentful environment variables with proper error handling
    env: {
        // Server-side variables
        CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || '',
        CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN || '',
        CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || '',
        CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || 'master',
        CONTENTFUL_PREVIEW: process.env.CONTENTFUL_PREVIEW || 'false',

        // Client-side variables (redundant, but ensures consistency)
        NEXT_PUBLIC_CONTENTFUL_SPACE_ID: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID || '',
        NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || process.env.CONTENTFUL_ENVIRONMENT || 'master',
        NEXT_PUBLIC_CONTENTFUL_PREVIEW: process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW || process.env.CONTENTFUL_PREVIEW || 'false',
    },
};

export default nextConfig; 