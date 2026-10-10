/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0f1d',
          card: '#111827',
          border: '#1f2937',
          accent: '#38bdf8',
          success: '#22c55e',
          warning: '#eab308',
          danger: '#ef4444',
          purple: '#a855f7',
        }
      }
    },
  },
  plugins: [],
}