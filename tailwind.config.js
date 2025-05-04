/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0078d4', // Microsoft blue
        secondary: '#5c2d91', // Microsoft purple
        success: '#107c10' // Microsoft green
      },
    },
  },
  plugins: [],
}
