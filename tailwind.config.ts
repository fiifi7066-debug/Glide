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
        primary: { DEFAULT: "#6C5CE7", dark: "#5A4BD1", light: "#A29BFE" },
        secondary: "#00CEC9",
        accent: "#FD79A8",
        dark: "#2D3436",
        light: "#F8F9FA",
      },
    },
  },
  plugins: [],
}

export default config
