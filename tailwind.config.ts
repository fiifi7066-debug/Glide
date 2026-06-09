import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1E3A5F", dark: "#15294A", light: "#2D5A87" },
        secondary: "#0EA5E9",
        accent: "#38BDF8",
        dark: { DEFAULT: "#0B1120", lighter: "#0F172A", card: "#1E293B", border: "#334155" },
        surface: "#0F172A",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 4s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideUp: { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        glow: { from: { boxShadow: "0 0 20px rgba(59,130,246,0.2)" }, to: { boxShadow: "0 0 40px rgba(59,130,246,0.4)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-15px)" } },
        pulseSlow: { "0%, 100%": { opacity: "0.4" }, "50%": { opacity: "0.8" } },
      },
    },
  },
  plugins: [],
}

export default config
