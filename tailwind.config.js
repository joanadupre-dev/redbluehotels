/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#16326B",
          900: "#244F9D",
          800: "#2C5CAE",
          700: "#3868BB",
          600: "#4576C4",
        },
        brick: {
          600: "#9E2B26",
          500: "#BF342F",
          400: "#D14943",
        },
        ink: "#1B2733",
        sand: "#F7F5F1",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
