/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        ludo: "url('../../public/ludo-bg.jpg')",
      },
      backgroundSize: {
        contain: "contain",
      },
      width: {
        3: "3%",
      },
      height: {
        3: "3%",
      },
      duration: {
        duration: "2000ms",
      },
      scale: {
        140: "1.4",
      },
      rotate: {
        full: "360deg",
      },
      keyframes: {
        borderBlink: {
          "50%": {
            borderColor: "rgba(255, 255, 255, 0.8)",
          },
        },
      },
      animation: {
        "border-blink": "borderBlink 0.7s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
