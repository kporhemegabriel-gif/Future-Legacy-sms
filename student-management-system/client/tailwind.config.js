/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1C2333",
          light: "#2C3548",
        },
        paper: "#FBFAF7",
        hairline: "#E4E1D8",
        brass: {
          DEFAULT: "#B8863B",
          dark: "#93692A",
          light: "#EFE1C8",
        },
        slate: {
          DEFAULT: "#5B6472",
        },
        forest: "#3F7D58",
        rust: "#B34A3C",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};
