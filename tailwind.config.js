/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ocean: '#0E87A7',
        skysoft: '#E7F7FB',
        gold: '#D8B76A',
        ink: '#14323B'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(14,135,167,0.16)'
      }
    }
  },
  plugins: []
};

export default config;
