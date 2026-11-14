/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#281C9D",
        background: "#FFFFFF",
        surface: "#F2F1F9",
        muted: "#898989",
        brand: {
          primary: "#281C9D",
          secondary: "#5655B9",
          tertiary: "#A8A3D7",
          "primary-soft": "#F2F1F9",
          body: "#FFFFFF",
          "text-primary": "#343434",
          "text-secondary": "#898989",
          "text-muted": "#989898",
          border: "#CACACA",
          "border-soft": "#E0E0E0",
          white: "#FFFFFF",
          error: "#FF4267",
          info: "#0890FE",
          warning: "#FFAF2A",
          success: "#52D5BA",
          orange: "#FB6B18",
        },
      },
      fontFamily: {
        "poppins-regular": ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
      },
    },
  },
  plugins: [],
};
