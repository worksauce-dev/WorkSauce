import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
      colors: {
        light: "#f8fafb",
        dark: "#1C1C1E",

        "primary-gray": "#636366",
        placeholder: "#AEAEB2",
        border: "#C6C6C6",

        "primary-blue": "#004DDE",
        "secondary-blue": "#DBEAFE",

        "primary-green": "#14AE5C",
        "secondary-green": "#CFF7D3",

        "primary-yellow": "#786500",
        "secondary-yellow": "#FFF1C2",

        "primary-accent": "#F97316",
        "primary-accent-hover": "#EA580C",
        "secondary-accent": "#fff7ed",
      },
      fontSize: {
        caption: "12px",
        body1: "14px",
        body2: "16px",
        subheading: "18px",
        heading1: "22px",
        heading2: "28px",
        heading3: "38px",
        hero: "50px",
      },

      fontWeight: {
        light: "300",
        medium: "500",
        bold: "700",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      components: {
        ".btn": {
          "@apply px-4 py-2 rounded-lg font-medium transition-colors duration-200":
            {},
        },
        ".btn-primary": {
          "@apply bg-primary-accent text-white hover:bg-primary-accent-hover":
            {},
        },
        ".btn-secondary": {
          "@apply bg-white border border-gray-200 text-gray-700 hover:bg-gray-50":
            {},
        },

        ".card": {
          "@apply bg-white rounded-lg shadow-sm border border-gray-100": {},
        },
        ".card-hover": {
          "@apply hover:shadow-lg transition-shadow duration-200": {},
        },

        ".input": {
          "@apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent focus:border-transparent transition-colors":
            {},
        },

        ".badge": {
          "@apply px-2 py-0.5 rounded-full text-sm font-medium": {},
        },
        ".badge-primary": {
          "@apply bg-orange-100 text-orange-500": {},
        },
      },

      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "card-hover":
          "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      },

      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "fadein-pop": "fadein-pop 0.7s cubic-bezier(0.22,1,0.36,1)",
        gradientMove: "gradientMove 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fadein-pop": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(30px)" },
          "80%": { opacity: "1", transform: "scale(1.03) translateY(-4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },

        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
export default config;
