/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F3F4F6", // light gray background
        surface: "#FFFFFF", // white cards
        surfaceMuted: "#E5E7EB",
        accent: {
          blue: "#2563EB",
          green: "#22C55E",
          yellow: "#EAB308",
          red: "#EF4444"
        }
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15,23,42,0.9)"
      }
    }
  },
  plugins: []
};

