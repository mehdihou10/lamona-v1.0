/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        main: "#0d53bb",
        bold: "#938073",
        light: "#0d53bb5c",
        background: "#f1f3f7",
        icon: "#0000009c",
        secondary: "#1c2434",
        secondary2: "#dee4ee",
      },
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};
