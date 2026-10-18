/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
  ],
  safelist: [
    'translate-x-0',
    '-translate-x-full',
    'md:translate-x-0',
    'md:relative',
    'fixed',
    'relative',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1a6b3c",
          dark: "#145530",
          light: "#e8f5ee",
          muted: "#c6dfd0",
        },
      },
    },
  },
  plugins: [],
};
