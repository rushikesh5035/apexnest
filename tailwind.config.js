/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Compatibility aliases for screens not yet migrated to `fynlo-*`.
        // Every value intentionally remains inside the locked dark palette.
        primary: "#AAFF21",
        background: "#000000",
        surface: "#161616",
        muted: "#A3A3A3",

        fynlo: {
          canvas: "#000000",
          surface: "#161616",
          "surface-raised": "#161616",
          card: "#161616",
          input: "#161616",
          border: "#252525",
          "border-strong": "#252525",
          divider: "#252525",

          primary: "#AAFF21",
          "on-primary": "#000000",
          secondary: "#EF9204",
          "on-secondary": "#000000",

          "text-primary": "#FFFFFF",
          "text-secondary": "#A3A3A3",
          "text-muted": "#A3A3A3",
          placeholder: "#A3A3A3",

          success: "#AAFF21",
          income: "#AAFF21",
          warning: "#EF9204",
          error: "#FF5D73",
          expense: "#FF5D73",
          white: "#FFFFFF",
          black: "#000000",
        },

        // Temporary semantic aliases for older screens. These can be deleted
        // after those screens move to the `fynlo-*` namespace.
        brand: {
          primary: "#AAFF21",
          secondary: "#EF9204",
          tertiary: "#161616",
          "primary-soft": "#161616",
          lavender: "#161616",

          body: "#000000",
          surface: "#161616",
          bg: "#FFFFFF",

          "text-primary": "#FFFFFF",
          "text-secondary": "#A3A3A3",
          "text-muted": "#A3A3A3",

          border: "#252525",
          "border-soft": "#252525",
          "surface-border": "#252525",

          white: "#FFFFFF",
          error: "#FF5D73",
          info: "#A3A3A3",
          warning: "#EF9204",
          success: "#AAFF21",

          orange: "#EF9204",
          teal: "#AAFF21",
          blue: "#A3A3A3",
          coral: "#FF5D73",
          pink: "#FF5D73",
        },
      },

      fontFamily: {
        "poppins-regular": ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-semibold": ["Poppins_600SemiBold"],
      },
      borderRadius: {
        "fynlo-control": "14px",
        "fynlo-card": "16px",
        "fynlo-sheet": "24px",
      },
      spacing: {
        "fynlo-page": "24px",
        "fynlo-header": "24px",
        "fynlo-section": "40px",
        "fynlo-card": "16px",
        "fynlo-welcome-offset": "56px",
        "fynlo-form-offset": "64px",
      },
      fontSize: {
        "fynlo-display": ["32px", "40px"],
        "fynlo-title": ["20px", "24px"],
        "fynlo-action": ["18px", "24px"],
        "fynlo-body": ["16px", "24px"],
        "fynlo-label": ["14px", "20px"],
        "fynlo-caption": ["12px", "16px"],
      },
    },
  },
  plugins: [],
};
