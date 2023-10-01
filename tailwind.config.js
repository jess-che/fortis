/** @type {import('tailwindcss').Config} */
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
      },
      boxShadow: {
        'green': '0 4px 6px 0 rgba(85, 187, 164, 0.5)', 
        'blue': '0 4px 6px 0 rgba(47, 171, 221, 0.5)',
        'pink': '0 4px 6px 0 rgba(195, 46, 103, 0.5)',  
      },
    },
  },
  plugins: [],
}
