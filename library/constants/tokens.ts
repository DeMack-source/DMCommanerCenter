// design-tokens.ts
// All visual constants live here. Components import from this file only.
// To retheme the app, change this file.

export const tokens = {
  // ── Base palette ──
  bg: {
    primary:   "#020810",
    secondary: "#040d18",
    card:      "rgba(8, 20, 35, 0.85)",
    overlay:   "rgba(0, 0, 0, 0.88)",
    glass:     "rgba(4, 12, 24, 0.7)",
  },

  // ── Text ──
  text: {
    primary:   "#e8f4ff",
    secondary: "#7a9ab0",
    muted:     "#2a4a5a",
    accent:    "#00e5ff",
  },

  // ── Borders ──
  border: {
    subtle:  "rgba(0, 229, 255, 0.08)",
    normal:  "rgba(0, 229, 255, 0.18)",
    strong:  "rgba(0, 229, 255, 0.4)",
  },

  // ── Zone accent colors (accent, dim bg) ──
  zones: {
    dev:    { accent: "#00e5ff", dim: "#003d4d" },
    social: { accent: "#ff6b35", dim: "#4d1f0a" },
    art:    { accent: "#c77dff", dim: "#2d0a4d" },
    media:  { accent: "#ffd60a", dim: "#3d3000" },
    ops:    { accent: "#39ff14", dim: "#0a2d0a" },
    all:    { accent: "#7a9ab0", dim: "#1a2a35" },
  } as Record<string, { accent: string; dim: string }>,

  // ── Priority colors ──
  priority: {
    high:   "#ff4444",
    medium: "#ffd60a",
    low:    "#39ff14",
  },

  // ── Typography ──
  font: {
    display: "'Share Tech Mono', 'Courier New', monospace",
    ui:      "'Rajdhani', 'Arial Narrow', sans-serif",
    body:    "'Share Tech Mono', monospace",
  },

  // ── Radius ──
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "20px",
  },

  // ── Shadows / glows ──
  glow: (color: string, intensity = 0.3) =>
    `0 0 20px ${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")}`,

  // ── Transitions ──
  transition: {
    fast:   "all 0.15s ease",
    normal: "all 0.25s ease",
    spring: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;
