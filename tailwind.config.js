/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'nav-gradient': 'linear-gradient(to bottom, rgba(18,18,18, 1), rgba(18,18,18, 0))'
      },
      boxShadow: {
        'green': '0 4px 6px 0 rgba(85, 187, 164, 0.5)', 
        'blue': '0 4px 6px 0 rgba(47, 171, 221, 0.5)',
        'pink': '0 4px 6px 0 rgba(195, 46, 103, 0.5)',  
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.gradient-text-gb': {
          background: 'linear-gradient(45deg, #55BBA4, #2FABDD)',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.gradient-text-pg': {
          background: 'linear-gradient(45deg, #C32E67, #55BBA4)',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.gradient-text-bp': {
          background: 'linear-gradient(45deg, #2FABDD, #C32E67)',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
  ],
}
