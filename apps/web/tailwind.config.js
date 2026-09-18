/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00288e',
        'primary-container': '#1e40af',
        'on-primary': '#ffffff',
        'on-primary-container': '#a8b8ff',
        'secondary': '#0051d5',
        'secondary-container': '#316bf3',
        'tertiary': '#003d28',
        'tertiary-container': '#00563a',
        'tertiary-fixed': '#85f8c4',
        'tertiary-fixed-dim': '#68dba9',
        'on-tertiary': '#ffffff',
        'surface': '#f8f9ff',
        'surface-bright': '#f8f9ff',
        'surface-dim': '#cbdbf5',
        'surface-variant': '#d3e4fe',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#444653',
        'outline': '#757684',
        'outline-variant': '#c4c5d5',
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'on-error': '#ffffff',
      },
      fontFamily: {
        sans: ['Noto Sans', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Noto Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
};