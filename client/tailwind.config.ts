import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        gray: {
          50: "#09090b", // Redefine light mode gray backgrounds to dark background
          100: "#18181b",
          200: "#27272a",
          300: "#3f3f46",
          500: "#71717a",
          700: "#a1a1aa",
          800: "#e4e4e7",
        },
        blue: {
          50: "rgba(251, 191, 36, 0.08)",
          100: "rgba(251, 191, 36, 0.15)",
          200: "rgba(251, 191, 36, 0.3)",
          400: "#F59E0B",
          500: "#FBBF24",
          600: "#FBBF24",
          700: "#F59E0B",
          800: "#D97706",
          900: "rgba(251, 191, 36, 0.15)",
        },
        primary: "#FBBF24",
        secondary: "#F59E0B",
        tertiary: "#A5FF2A",
        "dark-bg": "#09090B",
        "dark-secondary": "#18181B",
        "dark-tertiary": "#27272A",
        "blue-primary": "#FBBF24",
        "stroke-dark": "rgba(255, 255, 255, 0.12)",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "11px",
        xl: "12px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
