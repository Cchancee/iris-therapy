/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C2D0FF',
        secondary: '#dce2f3',
        textColor: '#333333',
      },
    },
  },
  plugins: [],
};
