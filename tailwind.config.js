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
          red: '#C94A3F',
          'red-hover': '#B23E34',
          gold: '#C9A36B',
          green: '#4D8B6E',
          'green-hover': '#3F755C',
          cream: '#F8F4EC',
          beige: '#FFFFFF',
          ink: '#1F1F1F',
          muted: '#6B665E',
          white: '#FFFFFF',
          danger: '#C94A3F',
          border: '#E6DFD4',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-noto-bengali)', 'Noto Sans Bengali', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        'card-sm': '14px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.07)',
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
