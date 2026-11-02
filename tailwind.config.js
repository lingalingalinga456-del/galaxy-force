/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          red: '#D94F4F',
          'red-hover': '#C43A3A',
          green: '#5FA777',
          'green-hover': '#4D8C64',
          cream: '#FAF7F2',
          beige: '#F3ECE2',
          ink: '#1A1A1A',
          muted: '#6B6B6B',
          white: '#FFFFFF',
          gold: '#D8B26E',
          danger: '#E25D5D',
          border: '#E9E2D9',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-noto-bengali)', 'Noto Sans Bengali', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        'card-sm': '12px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(26, 26, 26, 0.04), 0 1px 3px rgba(26, 26, 26, 0.02)',
        'card-hover': '0 8px 24px rgba(26, 26, 26, 0.08), 0 4px 12px rgba(26, 26, 26, 0.04)',
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
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
