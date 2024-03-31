/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        shake: "shake 0.25s linear 2",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0px)" },
          "25%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
      },
    },
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
      button: ["Raleway", "sans-serif"],
    },
  },
  plugins: [],
};
