import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#faf8f3',
          surface: '#ffffff',
          text: '#111111',
          muted: '#6b7280',
          border: 'rgba(0, 0, 0, 0.08)',
        },
      },
      boxShadow: {
        soft: '0 10px 40px rgba(17, 17, 17, 0.06)',
      },
      borderRadius: {
        xl: '20px',
        lg: '16px',
        pill: '999px',
      },
    },
  },
  plugins: [],
} satisfies Config;
