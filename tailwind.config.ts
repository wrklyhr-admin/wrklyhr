import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED",
        primaryDark: "#5B21B6",
        primaryLight: "#EDE9FE",
        primaryXLight: "#FAF5FF",
        accent: "#84CC16",
        bgDark: "#0F0F1A",
        bgLight: "#FAF5FF",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(124,58,237,0.08)",
        cardHover: "0 8px 40px 0 rgba(124,58,237,0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
