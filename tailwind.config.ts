import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem", xl: "4rem" },
      screens: { "2xl": "1480px" },
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-tint": "var(--bg-tint)",
        fg: "var(--fg)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        "muted-2": "var(--muted-2)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ring: "var(--focus)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
        },
        night: {
          DEFAULT: "var(--night)",
          2: "var(--night-2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
      },
      letterSpacing: {
        tight2: "-0.02em",
        tight3: "-0.03em",
        wider2: "0.18em",
        widest2: "0.22em",
      },
      borderRadius: {
        none: "0px",
        xs: "2px",
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "10px",
        xl: "14px",
        "2xl": "20px",
      },
      maxWidth: {
        prose: "65ch",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        900: "900ms",
        1200: "1200ms",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elev: "var(--shadow-elev)",
        float: "var(--shadow-float)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
