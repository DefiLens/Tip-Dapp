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

        //White
        W0: '#fefefe',
        W10: '#fdfdfd',
        W20: '#fbfbfb',
        W30: '#f7f7f7',
        W40: '#f2f2f2',
        W50: '#e7e7e7',
        W60: '#e1e1e1',
        W70: '#dcdcdc',
        W80: '#d6d6d6',
        W90: '#d0d0d0',
        W100: '#cbcbcb',
        W200: '#c5c5c5',
        W300: '#bfbfbf',
        W400: '#bababa',
        W500: '#b4b4b4',
        W600: '#afafaf',
        W700: '#a9a9a9',
        W800: '#a3a3a3',
        W900: '#9e9e9e',

        // black
        B0: '#0d0d0d',
        B10: '#1a1a1a',
        B20: '#262626',
        B30: '#333333',
        B40: '#404040',
        B50: '#4d4d4d',
        B60: '#595959',
        B70: '#666666',
        B80: '#737373',
        B90: '#808080',
        B100: '#8c8c8c',
        B200: '#999999',
        B300: '#a6a6a6',
        B400: '#b3b3b3',
        B500: '#bfbfbf',
        B600: '#cccccc',
        B700: '#d9d9d9',
        B800: '#e6e6e6',
        B900: '#f2f2f2',

        "primary-text": '#404040',
        "secondary-text": '#595959'
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