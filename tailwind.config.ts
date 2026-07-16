import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#D62828',
          yellow: '#F4C430',
          white: '#FFFFFF',
          gray: '#F8F9FA',
          dark: '#212529',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
