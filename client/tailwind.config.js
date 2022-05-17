const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./pages/*.{js,ts,jsx,tsx}", "./shared/components/**/*.{js,ts,jsx,tsx}", "./shared/layout/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./pages/*.{js,ts,jsx,tsx}", "./shared/components/**/*.{js,ts,jsx,tsx}", "./shared/layout/*.{js,ts,jsx,tsx}"],
  theme: {
    minWidth: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
    },
    fontFamily: {
      sans: ['"PT Sans"', "sans-serif"],
    },
    colors: {
      ...colors,
      one: "#fff",
      two: "#000",
      three: "#e66922",
      four: "#000",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
