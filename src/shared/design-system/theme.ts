/**
 * Velvet Signal design system – extracted from landing page.
 * Use with globals.css CSS variables. Do not redesign; keep new UI consistent.
 */

export const theme = {
  bg: {
    base: "#05060a",
    elevated: "rgba(10, 11, 20, 0.82)",
    elevatedSoft: "rgba(255, 255, 255, 0.06)",
  },
  text: {
    primary: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.72)",
    muted: "rgba(255, 255, 255, 0.52)",
  },
  accent: {
    primary: "#c778ff",
    secondary: "#ff6fae",
    tertiary: "#4dd5ff",
  },
  status: {
    online: "#3dff9a",
    offline: "#ff4d6a",
    warning: "#ffc857",
  },
  gradient: {
    primary: "linear-gradient(135deg, #c778ff, #ff6fae)",
    secondary: "linear-gradient(135deg, #4dd5ff, #c778ff)",
  },
  radius: { card: "22px", pill: "999px" },
  space: { "2xs": 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, "2xl": 40, "3xl": 64 },
  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem", lg: "1.25rem", xl: "1.5rem", "2xl": "2rem", "3xl": "2.5rem" },
  border: { subtle: "rgba(255, 255, 255, 0.12)", button: "rgba(255, 255, 255, 0.2)" },
  shadow: { card: "0 18px 45px rgba(0, 0, 0, 0.55)", glowPrimary: "0 0 22px rgba(199, 120, 255, 0.55)" },
  blur: { card: "20px" },
} as const;
