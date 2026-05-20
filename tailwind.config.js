/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff8ff",
          100: "#dceffd",
          200: "#b0dffc",
          300: "#7bc7fa",
          400: "#3ea8f5",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e"
        },
        sunset: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(14,165,233,0.45)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite"
      }
    }
  },
  plugins: []
};
