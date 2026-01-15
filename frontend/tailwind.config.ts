import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        background: 'var(--bg-primary)',
        widget: 'var(--bg-widget)',
      },
    },
  },
  plugins: [],
} satisfies Config;
