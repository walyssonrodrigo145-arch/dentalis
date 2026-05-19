/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0284c7", // Azul médico premium (sky-600)
          foreground: "#ffffff",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          DEFAULT: "#f1f5f9", // Slate 100
          foreground: "#0f172a", // Slate 900
          dark: "#1e293b",
          darkForeground: "#f8fafc",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f8fafc",
          foreground: "#64748b",
          dark: "#0f172a",
          darkForeground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#f0f9ff",
          foreground: "#0284c7",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
          dark: "#1e293b",
          darkForeground: "#f8fafc",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
          dark: "#1e293b",
          darkForeground: "#f8fafc",
        },
      },
      borderRadius: {
        lg: "1rem", // 16px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
      },
      boxShadow: {
        premium: "0 4px 20px -2px rgba(2, 132, 199, 0.08), 0 2px 6px -1px rgba(2, 132, 199, 0.04)",
        card: "0 2px 12px -2px rgba(15, 23, 42, 0.06)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
        dark: "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-in": "slideIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
