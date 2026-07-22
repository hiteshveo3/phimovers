import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fixed dark accent (used for always-dark panels: banner, logo, highlighted card)
        // Wise "Forest Green"
        ink: {
          DEFAULT: "#163300",
          soft: "#1e4600",
        },
        // Semantic tokens driven by CSS variables -> flip in dark mode
        content: "rgb(var(--c-content) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        cream: "rgb(var(--c-cream) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        base: "rgb(var(--c-base) / <alpha-value>)",
        // Wise "Forest Green" for links, badges & highlights
        brand: {
          DEFAULT: "#163300",
          dark: "#0e2400",
        },
        // Wise "Bright Green" primary accent (use dark text on top)
        accent: {
          DEFAULT: "#9fe870",
          dark: "#86d957",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-grotesk)",
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.03)",
        soft: "0 6px 24px rgba(16,24,40,0.05)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
