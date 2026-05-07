/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f4dbb0',
          300: '#ecc07f',
          400: '#e29e4d',
          500: '#d4822a',
          600: '#b8671f',
          700: '#934f1a',
          800: '#783f1c',
          900: '#63341a',
        },
        boho: {
          cream: '#fdf8f0',
          sand: '#e8d5b7',
          terra: '#c4622d',
          rust: '#9b3d1a',
          forest: '#2d5a3d',
          gold: '#c9a84c',
          dark: '#1a1208',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        slideDown: { '0%': { transform: 'translateY(-10px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      }
    },
  },
  plugins: [],
};
