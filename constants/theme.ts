/** Fynlo's locked, dark-only palette. */
export const FYNLO_COLORS = {
  canvas: "#000000",
  surface: "#161616",
  surfaceRaised: "#161616",
  card: "#161616",
  input: "#161616",
  border: "#252525",
  borderStrong: "#252525",
  divider: "#252525",
  primary: "#AAFF21",
  onPrimary: "#000000",
  secondary: "#EF9204",
  onSecondary: "#000000",
  textPrimary: "#FFFFFF",
  textSecondary: "#A3A3A3",
  textMuted: "#A3A3A3",
  placeholder: "#A3A3A3",
  success: "#AAFF21",
  income: "#AAFF21",
  warning: "#EF9204",
  error: "#FF5D73",
  expense: "#FF5D73",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const FYNLO_TYPOGRAPHY = {
  caption: { fontFamily: "Poppins_400Regular", fontSize: 12, lineHeight: 16 },
  label: { fontFamily: "Poppins_500Medium", fontSize: 14, lineHeight: 20 },
  body: { fontFamily: "Poppins_400Regular", fontSize: 16, lineHeight: 24 },
  action: { fontFamily: "Poppins_600SemiBold", fontSize: 18, lineHeight: 24 },
  title: { fontFamily: "Poppins_600SemiBold", fontSize: 20, lineHeight: 24 },
  display: { fontFamily: "Poppins_600SemiBold", fontSize: 32, lineHeight: 40 },
} as const;

export const FYNLO_RADIUS = {
  control: 14,
  card: 16,
  sheet: 24,
  pill: 9999,
} as const;

export const FYNLO_SPACING = {
  page: 24,
  header: 24,
  section: 40,
  card: 16,
  welcomeOffset: 56,
  formOffset: 64,
} as const;

// Palette-compliant compatibility bridge for screens not yet migrated to
// FYNLO_COLORS. It contains no legacy light or purple values.
export const COLORS = {
  primary: FYNLO_COLORS.primary,
  secondary: FYNLO_COLORS.secondary,
  tertiary: FYNLO_COLORS.surface,
  primarySoft: FYNLO_COLORS.surface,
  lavender: FYNLO_COLORS.surface,
  background: FYNLO_COLORS.canvas,
  surface: FYNLO_COLORS.surface,
  textPrimary: FYNLO_COLORS.textPrimary,
  textSecondary: FYNLO_COLORS.textSecondary,
  textMuted: FYNLO_COLORS.textMuted,
  placeholder: FYNLO_COLORS.placeholder,
  border: FYNLO_COLORS.border,
  borderSoft: FYNLO_COLORS.border,
  error: FYNLO_COLORS.error,
  info: FYNLO_COLORS.textSecondary,
  warning: FYNLO_COLORS.warning,
  success: FYNLO_COLORS.success,
  orange: FYNLO_COLORS.secondary,
  teal: FYNLO_COLORS.primary,
  blue: FYNLO_COLORS.textSecondary,
  coral: FYNLO_COLORS.error,
  pink: FYNLO_COLORS.error,
  brandBlue: FYNLO_COLORS.primary,
} as const;

export const AI_GRADIENT: [string, string] = [
  FYNLO_COLORS.primary,
  FYNLO_COLORS.secondary,
];
export const AI_GRADIENT_REVERSE: [string, string] = [
  FYNLO_COLORS.secondary,
  FYNLO_COLORS.primary,
];
export const RECORDING_GRADIENT: [string, string] = [
  FYNLO_COLORS.secondary,
  FYNLO_COLORS.error,
];
