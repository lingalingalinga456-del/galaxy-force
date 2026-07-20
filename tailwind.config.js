/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: { DEFAULT: '1rem', md: '1.5rem', xl: '2.5rem' },
        screens: { '2xl': '1280px' },
      },
      colors: {
        warm: {
          red: '#D94F4F',
          'red-hover': '#C43A3A',
          gold: '#D8B26E',
          green: '#5FA777',
          'green-hover': '#528F6A',
          cream: '#FAF7F2',
          beige: '#F3ECE2',
          ink: '#1A1A1A',
          muted: '#6B6B6B',
          white: '#FFFFFF',
          danger: '#D94F4F',
          border: '#E9E2D9',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-noto-bengali)', 'Noto Sans Bengali', 'sans-serif'],
      },
      borderRadius: {
        card: '32px',
        'card-sm': '24px',
        'category-chip': '999px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.07)',
        'card-lift': '0 12px 32px rgba(0, 0, 0, 0.09)',
      },
      fontSize: {
        base: ['18px', { lineHeight: '1.6' }],
        lg: ['20px', { lineHeight: '1.5' }],
        xl: ['24px', { lineHeight: '1.4' }],
        '2xl': ['30px', { lineHeight: '1.3' }],
        '3xl': ['36px', { lineHeight: '1.3' }],
        '4xl': ['42px', { lineHeight: '1.2' }],
        '5xl': ['48px', { lineHeight: '1.2' }],
        '6xl': ['64px', { lineHeight: '1.2' }],
      },
      transitionDuration: {
        fast: '160ms',
        normal: '200ms',
        slow: '260ms',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
};
