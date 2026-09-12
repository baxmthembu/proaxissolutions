/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // DbnOvrload locked palette — do not change these hex values.
        pitch: "#050505", // Deep Pitch Black — dominant background
        volt: "#00F0FF", // Electric Neon Volt Cyan — primary action / branding
        radio: "#39FF14", // Radioactive Lime/Green — scarcity + success only
        slate: "#1A1A1A", // Charcoal Slate — cards / wrappers
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        volt: "0 0 18px rgba(0,240,255,0.45)",
        radio: "0 0 18px rgba(57,255,20,0.45)",
      },
      keyframes: {
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        pulseVolt: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,240,255,0.5)" },
          "70%": { boxShadow: "0 0 0 12px rgba(0,240,255,0)" },
        },
      },
      animation: {
        flash: "flash 1.1s ease-in-out infinite",
        pulseVolt: "pulseVolt 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};
