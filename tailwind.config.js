/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF8200', // Pantone 151 C
        'dark-blue': '#003087',      // Pantone 287 C
        'light-blue': '#00A3E0',     // Pantone 299 C
        'light-gray': '#D9D9D6',     // Cool Gray 1 C
        'wine': '#76232F',           // Pantone 188 C
        'red': '#D50032',            // Pantone 199 C
        'medium-gray': '#898D8D',    // Pantone 423 C
      },
      fontFamily: {
        'condensed': ['Roboto Condensed', 'Arial', 'sans-serif'],
        'sans': ['Roboto', 'Arial', 'sans-serif']
      },
    },
  },
  plugins: [],
} 