import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'bg-custom-gradient':
          'linear-gradient(to left, #7db8ff 0%, #d8a7ff 100%)',
        'text-custom-gradient':
          'linear-gradient(40deg, #00fff7 0%, #ae4aff 100%)',
      },
      colors: {
        primary: 'transparent',
        secondary: '#c176fe',
      },
    },
  },
  plugins: [nextui()],
} satisfies Config;
