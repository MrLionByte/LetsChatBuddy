export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        dark: {
          100: '#cfd1d9',
          200: '#a0a3b1',
          300: '#71758a',
          400: '#454860',
          500: '#1e1b38',
          600: '#18162e',
          700: '#12101f',
          800: '#0c0b17',
          900: '#060508',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        scan: {
          '0%': { backgroundPosition: '0 -100vh' },
          '35%, 100%': { backgroundPosition: '0 100vh' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scan: 'scan 7.5s linear infinite',
      },
    },
  },
  plugins: [],
}