/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'caixa-blue': '#005CA9',
        'caixa-orange': '#F78100',
        'caixa-blue-light': '#007DC5',
        'caixa-gray': '#6E6E6E',
        'caixa-black': '#000000',
        'caixa-white': '#FFFFFF',
        'caixa-error': '#D32F2F',
      },
      fontFamily: {
        'futura': ['Futura', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        'caixa': '4px',
        'caixa-lg': '8px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      }
    },
  },
  plugins: [],
}
