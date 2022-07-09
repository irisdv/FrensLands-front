/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/client/pages/**/*.{js,ts,jsx,tsx}",
    "./src/client/components/**/*.{js,ts,jsx,tsx}",
    "./dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'custom-grey': '#909AD7',
      'custom-dark-grey': '#45496A',
      'custom-light-grey': '#F2F2F2',
      'custom-medium-grey': '#ECEBE4',
      'white': '#FFFFFF',
      'black': '#OOOOOO',
      'transparent': 'transparent',
      'black2': '#151515',
      'turquoise': '#7BDFD9',
      'pink' : '#B696CC',
      'orange': '#E39C42',
      'blue': '#4D7FAB'
    },
  },
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.7xl') },
        'h2': { fontSize: theme('fontSize.4xl') },
        'h3': { fontSize: theme('fontSize.2xl') },
        'h4': { fontSize: theme('fontSize.xl') },
        'h5': { fontSize: theme('fontSize.lg') },
      })
    })
  ],
}
