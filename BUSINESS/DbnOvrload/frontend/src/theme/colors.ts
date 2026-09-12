// DbnOvrload locked visual design system. Permanent — do not alter hex codes.
export const COLORS = {
  /** Deep Pitch Black — dominant background. Forces focus, night-mode feel. */
  pitch: "#050505",
  /** Electric Neon Volt Cyan — primary action + branding (countdown ring, valid badges). */
  volt: "#00F0FF",
  /** Radioactive Lime/Green — scarcity triggers + "Ka-Ching" successes ONLY. */
  radio: "#39FF14",
  /** Charcoal Slate — structural cards, menu wrappers, secondary info. */
  slate: "#1A1A1A",
} as const;

export type ColorToken = keyof typeof COLORS;
