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
        placeholder: "AEAEB2",
        border: "#C6C6C6",

        "primary-blue": "#004DDE",
        "secondary-blue": "#DBEAFE",

        "primary-green": "#14AE5C",
        "secondary-green": "#CFF7D3",

        "primary-yellow": "#786500",
        "secondary-yellow": "#FFF1C2",

        "primary-accent": "#F97316",
        "primary-accent-hover": "#EA580C",
        "secondary-accent": "#ffd2d6",
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
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
export default config;
