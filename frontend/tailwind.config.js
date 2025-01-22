/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'text-color': '#f6f2f2',
        'text-color-2': '#3991e3',
        'primary-color': 'rgb(13, 14, 20)',
        'secondary-color': 'rgb(22, 25, 38)',
      },
      fontFamily: {
       'dm-serif': ['"DM Serif Display"', 'serif'],
        'nunito': ['"Nunito Sans"', 'sans-serif'],
'inter': ['"Inter"', 'sans-serif'],
'montserrat': ['"Montserrat"', 'sans-serif']
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(145deg, #171124, #1c142b)',
      },
      boxShadow: {
        'custom': '10px 10px 20px #120d1c, -10px -10px 20px #221934',
      },
    },
  },
  plugins: [],
}