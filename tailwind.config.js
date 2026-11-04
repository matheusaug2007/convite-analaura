/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        linho: 'var(--bg-color)',
        terracota: 'var(--primary-color)',
        botao: 'var(--button-color)',
        nude: '#B37B5C',
        rosa: '#E8A598',
        lavanda: '#A599B5',
        salvia: '#8EA08A',
        tinta: '#3E3835',
        legenda: 'var(--text-secondary)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
      },
      animation: { float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};

