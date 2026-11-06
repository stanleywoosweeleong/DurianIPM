/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // One soft paper tone for every surface — easier on the eyes than pure white.
      colors: { paper: '#fcfbf7' },
    }
  },
  plugins: []
};
