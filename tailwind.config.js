/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          pinkLight: '#FDF2F4',
          pinkCard: '#FCEBEF',
          pinkAccent: '#F7C5D1',
          pinkHeader: '#F7D0D8',
          plum: '#4A353B',
          plumHover: '#37252A',
          olive: '#7A8450',
          oliveBg: '#EFF2E1',
          teal: '#4A7C7D',
          tealBg: '#E7F2F2',
          mauve: '#A86B79',
          cream: '#FAF7F2',
          creamBg: '#E8E3C5',
          yellow: '#EADF9E',
          softGray: '#F3EFEF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'zen': '0 8px 30px rgba(74, 53, 59, 0.06)',
        'zen-lg': '0 15px 40px rgba(74, 53, 59, 0.1)',
        'zen-inner': 'inset 0 2px 4px 0 rgba(74, 53, 59, 0.05)',
      }
    },
  },
  plugins: [],
}
