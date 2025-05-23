import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          from: "#aa0000",
          to: "#550000",
          DEFAULT: "#aa0000",
          50: "#fff5f5",
          100: "#ffe6e6",
          200: "#ffcccc",
          300: "#ff9999",
          400: "#ff6666",
          500: "#ff3333",
          600: "#ff0000",
          700: "#cc0000",
          800: "#aa0000",
          900: "#880000",
          950: "#550000",
        },
        rhed: {
          background: "var(--rhed-background)",
          foreground: "var(--rhed-foreground)",
          accent: "var(--rhed-accent)",
        }
      },
      fontFamily: {
        playwrite: ["'Playwrite US Trad'", "serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 3s infinite ease-in-out",
        "float": "float 6s infinite ease-in-out",
        "gradient-shift": "gradient-shift 15s ease infinite",
        "fadeIn": "fadeIn 0.5s ease-out forwards",
        "fadeOut": "fadeOut 0.5s ease-in forwards",
        "scanline": "scanline 3s linear infinite",
        "pulse": "pulse 2s infinite",
        "pulse-subtle": "pulse-subtle 3s infinite ease-in-out",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        "wood-light": "url('/wood_light.jpg')",
        "wood-dark": "url('/wood_dark.jpg')",
      },
      boxShadow: {
        'glow': '0 0 15px rgba(170, 0, 0, 0.5)',
      },
      transitionProperty: {
        'transform-opacity': 'transform, opacity',
      },
    },
    plugins: [animatePlugin],
  }
} satisfies Config;
