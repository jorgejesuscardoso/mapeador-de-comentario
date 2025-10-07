/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        inactive: '#979797',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.bg-standard': {
          '@apply bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700': {},
        },
        '.bg-standard-dark': {
          '@apply bg-gradient-to-r from-violet-950 via-purple-950 to-fuchsia-950 hover:from-violet-900 hover:via-purple-900 hover:to-fuchsia-900': {},
        },
      })
    })
  ],
}
