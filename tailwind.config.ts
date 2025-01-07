import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
  theme: {
    extend: {
      textColor: {
        primary_from: "var(--color-primary-from)",
        primary_to: "var(--color-primary-to)",
      },
      colors: {
        sidebar: {
          DEFAULT: "var(--rhed-background)",
          foreground: "var(--rhed-foreground",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "var(--rhed-accent)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        rhed: {
          background: "var(--rhed-background)",
          foreground: "var(--rhed-foreground)",
          accent: "var(--rhed-accent)",
        },
        fade: "var(--fade)",
      },
      fontFamily: {
        playwrite: ["Playwrite US Trad", "serif"],
      },
      screens: {
        portrait: {
          raw: "(orientation: portrait)",
        },
        landscape: {
          raw: "(orientation: landscape)",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
} satisfies Config;
