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
        cream: '#F7F5F0',
        ink: '#1A1A1A',
        muted: '#8A8A8A',
        topbar: '#141414',
        hairline: '#EAEAEA',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
} satisfies Config;
