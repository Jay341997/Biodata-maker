/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bodoni: ["Bodoni Moda", "Didot", "Times New Roman", "serif"],
        baskerville: ["Libre Baskerville", "Baskerville", "Georgia", "serif"],
        serif: ["Lora", "Georgia", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        cinzel: ["Cinzel", "Georgia", "serif"],
        ornate: ["DM Serif Display", "Georgia", "serif"],
        script: ["Parisienne", "cursive"],
      },
    },
  },
  plugins: [],
};
