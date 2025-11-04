/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "segoe ui",
          "Roboto",
          "sans-serif",
        ],
        display: ["Georgia", "serif"],
        elegant: ["Garamond", "Georgia", "serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.5px" }],
        "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.5px" }],
        "4xl": ["36px", { lineHeight: "40px", letterSpacing: "-1px" }],
      },
      colors: {
        "pink-light": "#de949d",
        "pink-bright": "#ee83ac",
        white: "#ffffff",
        "pink-pastel": "#f4d4d9",
        "pink-soft": "#e9b1ba",
        "bg-pink-color": "#fff8f7",
      },
    },
  },
  plugins: [],
};
