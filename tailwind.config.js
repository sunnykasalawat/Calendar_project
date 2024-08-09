/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'holiday-orange': {
          100: '#FFEBE0',
          200: '#FFDAC1',
          300: '#FFB37F',
          400: '#FF8C42',
          500: '#FF5722',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
