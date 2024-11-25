/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",  "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      'xxs': '440px', // min-width
      'sm':'540px',
      'md':'768px',
      'lg':'1280px',
      '2xl':'1536px'
    },
   
  },
  plugins: [require('flowbite/plugin')],
}

