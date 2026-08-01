// ── Nyay.ai Brand Palette — Navy · Royal Indigo · White ──
export const C = {
  // Backgrounds
  bg:          "#05061A",   // deepest navy canvas
  sidebar:     "#080B22",   // sidebar panel
  sidebarHov:  "#0D1035",   // sidebar hover state
  panel:       "#0A0D28",   // top-bar / bottom bar
  surface:     "#0E1232",   // cards, message bubbles
  surfaceHov:  "#121740",   // card hover

  // Borders
  border:      "#1C2050",   // default border
  borderLight: "#2A2F6A",   // brighter border / focus ring

  // Primary accent — Royal Indigo
  gold:        "#6C63FF",   // primary accent (named 'gold' for backward compat)
  goldDim:     "#4F48C4",   // dimmed variant
  goldGlow:    "rgba(108,99,255,0.14)",
  indigo:      "#818CF8",   // lighter indigo highlight
  indigoDeep:  "#3730A3",   // deep fill
  indigoSoft:  "rgba(129,140,248,0.12)",

  // Typography
  text:        "#FFFFFF",   // pure white
  textMuted:   "#9B9FCE",   // lavender-muted
  textDim:     "#525780",   // subdued label

  // Semantic
  blue:        "#4F8EF7",
  blueSoft:    "rgba(79,142,247,0.12)",
  green:       "#22C55E",
  greenSoft:   "rgba(34,197,94,0.10)",
  red:         "#F04F43",
  redSoft:     "rgba(240,79,67,0.10)",
  amber:       "#F59E0B",
  amberSoft:   "rgba(245,158,11,0.10)",
} as const;

export type ColorToken = keyof typeof C;
