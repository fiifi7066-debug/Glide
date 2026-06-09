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
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.3s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "glow-blue": "glowBlue 2s ease-in-out infinite alternate",
        "float": "float 4s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3s infinite",
        "pulse-blue": "pulseBlue 2s infinite",
        "shimmer": "shimmer 2s infinite",
        "bounce-gentle": "bounceGentle 2s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeInUp: { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeInDown: { from: { opacity: "0", transform: "translateY(-10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideUp: { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideDown: { from: { opacity: "0", transform: "translateY(-10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        glow: { from: { boxShadow: "0 0 20px rgba(59,130,246,0.2)" }, to: { boxShadow: "0 0 40px rgba(59,130,246,0.4)" } },
        glowBlue: { "0%": { boxShadow: "0 0 5px rgba(59,130,246,0.3)" }, "100%": { boxShadow: "0 0 25px rgba(59,130,246,0.6)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-15px)" } },
        pulseSlow: { "0%, 100%": { opacity: "0.4" }, "50%": { opacity: "0.8" } },
        pulseBlue: { "0%, 100%": { boxShadow: "0 0 0 0 rgba(59,130,246,0.6)" }, "50%": { boxShadow: "0 0 0 12px rgba(59,130,246,0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        bounceGentle: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
      },
    },
  },
  plugins: [],
}

export default config
