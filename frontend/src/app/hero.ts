import { heroui } from '@heroui/react';

export default heroui({
  defaultTheme: 'light',
  themes: {
    'custom-theme': {
      extend: 'light',
      colors: {
        primary: {
          50: ' #e9eeed',
          100: '#bbcac6',
          200: '#9ab0aa',
          300: '#6c8c84',
          400: '#4f756c',
          500: '#235347',
          600: '#204c41',
          700: '#193b32',
          800: '#132e27',
          900: '#0f231e',

          DEFAULT: '#235347',
          foreground: '#ffffff',
        },
        secondary: {
          50: '#f4f1ef',
          100: '#dbd2cf',
          200: '#cabcb7',
          300: '#b29e96',
          400: '#a38b82',
          500: '#8c6e63',
          600: '#7f645a',
          700: '#634e46',
          800: '#4d3d36',
          900: '#3b2e2a',

          DEFAULT: '#8c6e63',
          foreground: '#ffffff',
        },
      },
    },
  },
});
