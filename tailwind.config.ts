import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        'dark-1': '#3d2e0e',
        'dark-2': '#37290d',
        'dark-3': '#31250b',
        'dark-4': '#2b200a',
        'dark-5': '#241c09',
        'dark-6': '#1e1707',
        'dark-7': '#181206',
        'dark-8': '#120e05',
        'dark-9': '#0c0903',
        'dark-10': '#050402',

        primary: {
          100: '#3d2e0e',
          200: '#37290d',
          300: '#31250b',
          400: '#2b200a',
          500: '#241c09',
          600: '#1e1707',
          700: '#181206',
          800: '#120e05',
          900: '#0c0903',
          950: '#050402',
        },

        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        secondary: {
          100: '#FFFAF0',
          200: '#FEF3C7',
          300: '#FDE68A',
          400: '#FCD34D',
          500: '#FBBF24',
          600: '#F59E0B',
          700: '#D97706',
          800: '#B45309',
          900: '#92400E',
        },


        //Neutral
        N0: '#fefefe',
        N10: '#fdfdfd',
        N20: '#fbfbfb',
        N30: '#f7f7f7',
        N40: '#f2f2f2',
        N50: '#e7e7e7',
        N60: '#e1e1e1',
        N70: '#dcdcdc',
        N80: '#d6d6d6',
        N90: '#d0d0d0',
        N100: '#cbcbcb',
        N200: '#c5c5c5',
        N300: '#bfbfbf',
        N400: '#bababa',
        N500: '#b4b4b4',
        N600: '#afafaf',
        N700: '#a9a9a9',
        N800: '#a3a3a3',
        N900: '#9e9e9e',

      },
      gradientColorStops: () => ({
        'primary-start': '#0A174E',
        'primary-end': '#2D033B',
      }),
    },
  },
  plugins: [],
};
export default config;