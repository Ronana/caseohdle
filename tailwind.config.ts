import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'game-bg':      '#07090f',
        'game-surface': '#0d1117',
        'game-card':    '#111827',
        'game-border':  '#1f2937',
        'cell-match':   '#16a34a',
        'cell-partial': '#b45309',
        'cell-dir':     '#1d4ed8',
        'cell-none':    '#1f2937',
        'accent':       '#38bdf8',
      },
      keyframes: {
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.6s ease-out both',
        'pop':      'pop 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
