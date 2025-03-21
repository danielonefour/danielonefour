import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)'],
      },
      colors: {
        primary: {
          DEFAULT: '#1599c1',
          50: '#f0f9fc',
          100: '#daf0f8',
          200: '#bbe4f1',
          300: '#8cd2e6',
          400: '#54b9d8',
          500: '#1599c1',
          600: '#0e7fa6',
          700: '#0e6988',
          800: '#115771',
          900: '#134a60',
          950: '#0c3042',
        },
        alt: {
          DEFAULT: '#fabe70',
          50: '#fff9ed',
          100: '#fff1d3',
          200: '#ffe2a7',
          300: '#ffce70',
          400: '#fabe70',
          500: '#f79630',
          600: '#e67918',
          700: '#bf5815',
          800: '#9a4518',
          900: '#7e3a19',
          950: '#461c09',
        },
        header: {
          bg: '#e0f2fe',
        },
        light: {
          gray: '#f8f8f8',
        },
        brand: {
          blue: '#1699C1',
          orange: '#F9BE70',
        },
      },
    },
  },
  plugins: [],
}

export default config 