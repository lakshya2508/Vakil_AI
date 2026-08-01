import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#05061A",
          900: "#080B22",
          800: "#0A0D28",
          700: "#0E1232",
          600: "#121740",
          500: "#1C2050",
          400: "#2A2F6A",
        },
        indigo: {
          vivid:  "#6C63FF",
          dim:    "#4F48C4",
          light:  "#818CF8",
          deep:   "#3730A3",
          soft:   "rgba(108,99,255,0.14)",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
      },
      animation: {
        "bounce-dot": "bounce-dot 1.2s ease-in-out infinite",
      },
      keyframes: {
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%":           { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
