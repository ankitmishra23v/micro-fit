/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"], // Include your component files
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1C1C1E",
        secondary: "#CDCDCD",
      },
    },
  },
  plugins: [],
};
