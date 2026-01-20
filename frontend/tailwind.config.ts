import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', ':root[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
