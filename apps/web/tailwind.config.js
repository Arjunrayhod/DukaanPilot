/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kirana: {
          green: '#15803D',
          greenLight: '#16A34A',
          greenBg: '#DCFCE7',
          amber: '#F59E0B',
          amberBg: '#FEF3C7',
          blue: '#0284C7',
          dark: '#0F172A',
          card: '#FFFFFF',
          bg: '#F8FAFC',
        }
      }
    },
  },
  plugins: [],
}
