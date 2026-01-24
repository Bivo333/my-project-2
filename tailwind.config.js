/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./**/*.html"],
  theme: {
    extend: {
      colors: {
        'primary-green': '#4CAF50',
        'dark-green': '#2D5D42',
        'light-gray': '#F5F5F5',
      }
    },
  },
  plugins: [],
}
