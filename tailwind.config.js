/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plum: "#2a1748",
        royal: "#233f88",
        gold: "#ddb85f",
        cream: "#fff7e5",
        lilac: "#f4ecff"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Manrope", "sans-serif"],
        script: ["Great Vibes", "cursive"]
      },
      boxShadow: {
        glow: "0 20px 70px rgba(16, 8, 35, 0.16)",
        soft: "0 14px 40px rgba(32, 22, 54, 0.10)"
      },
      backgroundImage: {
        floral:
          "radial-gradient(circle at top left, rgba(132, 80, 203, 0.32), transparent 28%), radial-gradient(circle at 84% 10%, rgba(48, 96, 206, 0.22), transparent 26%), radial-gradient(circle at 22% 82%, rgba(232, 194, 109, 0.18), transparent 24%), linear-gradient(145deg, rgba(32, 17, 58, 0.96), rgba(18, 26, 64, 0.95))"
      }
    }
  },
  plugins: []
};
