# Assets Directory

This directory contains all the static assets for the project.

## Structure

- `images/`: Contains all image assets like logos, illustrations, etc.
  - Place your logo files here (e.g., `logo.png`, `logo.svg`)
  - Place other image assets here (e.g., hero images, backgrounds)

## Usage

### Using Images in Next.js

There are two ways to use images in Next.js:

1. **For images in the `public` folder**:
   ```jsx
   import Image from 'next/image';
   
   <Image 
     src="/logo.png" 
     alt="Logo" 
     width={120} 
     height={40} 
   />
   ```

2. **For images in the `src/assets/images` folder**:
   ```jsx
   import Image from 'next/image';
   import logoImage from '@/assets/images/logo.png';
   
   <Image 
     src={logoImage} 
     alt="Logo" 
     width={120} 
     height={40} 
   />
   ```

## Flaticon UI Icons

This project uses the `@flaticon/flaticon-uicons` package for icons. The CSS is imported globally in the `layout.tsx` file.

### Using Flaticon UI Icons

We've created a reusable `FlatIcon` component in `src/components/icons/FlatIconDemo.tsx` that makes it easy to use these icons:

```jsx
import FlatIcon from '@/components/icons/FlatIconDemo';

// Regular icon
<FlatIcon icon="home" size="xl" />

// Solid icon
<FlatIcon icon="home-s" size="xl" />

// Brand icon
<FlatIcon icon="github-brand" size="xl" />
```

Available sizes: `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

For a full showcase of available icons, see the `FlatIconShowcase` component.

## Plus Jakarta Sans Font

The Plus Jakarta Sans font is already configured in the project. To use it, simply apply the `font-sans` class to your elements, or use the font-family in your Tailwind CSS classes.

## Custom Colors

This project uses custom colors configured in the Tailwind CSS configuration:

### Primary Color: #1599c1 (Blue)

```jsx
// Using the primary color
<div className="text-primary">Primary text color</div>
<div className="bg-primary">Primary background color</div>
<div className="border-primary">Primary border color</div>

// Using primary color variants
<div className="text-primary-600">Darker primary text</div>
<div className="bg-primary-100">Light primary background</div>
```

### Alt Color: #fabe70 (Orange/Yellow)

```jsx
// Using the alt color
<div className="text-alt">Alt text color</div>
<div className="bg-alt">Alt background color</div>
<div className="border-alt">Alt border color</div>

// Using alt color variants
<div className="text-alt-700">Darker alt text</div>
<div className="bg-alt-50">Very light alt background</div>
```

The color system includes shades from 50 to 950 for both primary and alt colors, allowing for a wide range of design options while maintaining a consistent color palette. 