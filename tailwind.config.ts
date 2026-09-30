import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem', xl: '2.5rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      colors: {
        /* Deep forest / emerald greens taken from the crest of the logo */
        forest: {
          50: '#EDF5F0',
          100: '#D3E7DC',
          200: '#A7CFBA',
          300: '#6FAE91',
          400: '#3E8C6B',
          500: '#256F51',
          600: '#1A5A40',
          700: '#124631',
          800: '#0C3323',
          900: '#082418',
          950: '#04150E',
        },
        /* Metallic gold from the logo's ribbon and frame */
        gold: {
          50: '#FDF8E9',
          100: '#FAEFC6',
          200: '#F4DE8C',
          300: '#EFCB55',
          400: '#E4B32C',
          500: '#D0991A',
          600: '#B07A13',
          700: '#8C5D12',
          800: '#6E4815',
          900: '#5A3A15',
        },
        /* Warm browns / earth from the gourd, staff and leopard cloth */
        earth: {
          50: '#FAF3EA',
          100: '#F0E2CD',
          200: '#DFC49F',
          300: '#C9A06F',
          400: '#B07F4C',
          500: '#95653A',
          600: '#7A5130',
          700: '#5F3E27',
          800: '#472E1E',
          900: '#2F1F15',
        },
        /* Cream / beige paper tones */
        cream: {
          50: '#FFFDF8',
          100: '#FBF6EC',
          200: '#F5EDDC',
          300: '#EDE0C7',
          400: '#E0CDA9',
        },
      },
      opacity: {
        8: '0.08',
        12: '0.12',
        15: '0.15',
        18: '0.18',
        22: '0.22',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        78: '0.78',
        85: '0.85',
        92: '0.92',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(228,179,44,0.35), 0 18px 40px -18px rgba(228,179,44,0.45)',
        'gold-strong': '0 0 0 1px rgba(228,179,44,0.55), 0 0 32px -6px rgba(228,179,44,0.55)',
        deep: '0 30px 70px -32px rgba(4,21,14,0.75)',
        card: '0 1px 2px rgba(12,51,35,0.04), 0 18px 45px -30px rgba(12,51,35,0.45)',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(103deg,#8C5D12 0%,#D0991A 18%,#F4DE8C 38%,#E4B32C 52%,#B07A13 74%,#EFCB55 100%)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0) translateX(0)', opacity: '0.25' },
          '50%': { transform: 'translateY(-26px) translateX(10px)', opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(228,179,44,0.45)' },
          '70%': { boxShadow: '0 0 0 16px rgba(228,179,44,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(228,179,44,0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.22,1,.36,1) both',
        float: 'float 9s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(.66,0,0,1) infinite',
      },
      typography: null,
    },
  },
  plugins: [],
};

export default config;
