/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d6a4f',
        'primary-dark': '#1b4332',
        'primary-light': '#52b788',
        cream: '#f8f4ef',
        'card-bg': '#fafaf7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
