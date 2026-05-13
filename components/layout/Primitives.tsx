import { tokens as T } from "../../lib/constants/tokens";

// ─── HUD CARD ────────────────────────────────────────────────────────────────
// Base card container with corner-bracket aesthetic

interface HudCardProps {
  accent?: string;
  dim?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function HudCard({ accent = T.text.accent, dim = T.bg.card, children, style, onClick }: HudCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        background: dim,
        border: `1px solid ${accent}28`,
        borderRadius: T.radius.lg,
        padding: "16px",
        overflow: "hidden",
        cursor: onClick ? "pointer" : undefined,
        transition: T.transition.normal,
        ...style,
      }}
    >
      {/* Corner brackets */}
      <span style={{ position: "absolute", top: 5, left: 5, width: 10, height: 10, borderTop: `1px solid ${accent}66`, borderLeft: `1px solid ${accent}66` }} />
      <span style={{ position: "absolute", bottom: 5, right: 5, width: 10, height: 10, borderBottom: `1px solid ${accent}66`, borderRight: `1px solid ${accent}66` }} />
      {children}
    </div>
  );
}

// ─── OVERLAY ─────────────────────────────────────────────────────────────────

interface OverlayProps {
  title: string;
  accent?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Overlay({ title, accent = T.text.accent, onClose, children, maxWidth = "480px" }: OverlayProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: T.bg.overlay,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "20px", boxSizing: "border-box",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(160deg, #080f18, #040c14)",
          border: `1px solid ${accent}44`,
          borderRadius: T.radius.xl,
          padding: "22px",
          width: "100%", maxWidth,
          boxShadow: `${T.glow(accent, 0.12)}, 0 24px 80px rgba(0,0,0,0.9)`,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <span style={{
            fontFamily: T.font.display, color: accent, fontSize: "13px",
            letterSpacing: "0.1em", textShadow: T.glow(accent, 0.6),
          }}>
            {title}
          </span>
          <button onClick={onClose} style={closeBtn(accent)}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  glyph: string;
  label: string;
  accent: string;
  count?: number;
  action?: { label: string; onClick: () => void };
}

export function SectionHeader({ glyph, label, accent, count, action }: SectionHeaderProps) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      paddingBottom: "10px",
      borderBottom: `1px solid ${accent}1a`,
      marginBottom: "12px",
    }}>
      <span style={{ fontFamily: T.font.display, fontSize: "16px", color: accent, textShadow: T.glow(accent, 0.5) }}>{glyph}</span>
      <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: "clamp(11px,2.5vw,14px)", color: accent, letterSpacing: "0.2em" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${accent}33, transparent)` }} />
      {count !== undefined && (
        <span style={{ fontFamily: T.font.display, fontSize: "9px", color: accent + "66", letterSpacing: "0.2em" }}>{count} NODES</span>
      )}
      {action && (
        <button onClick={action.onClick} style={{
          background: "transparent", border: `1px solid ${accent}44`,
          borderRadius: T.radius.sm, padding: "3px 10px",
          color: accent, fontFamily: T.font.ui, fontSize: "10px",
          fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer",
        }}>{action.label}</button>
      )}
    </div>
  );
}

// ─── HUD BUTTON ───────────────────────────────────────────────────────────────

interface HudButtonProps {
  onClick: () => void;
  accent?: string;
  dim?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}

export function HudButton({ onClick, accent = T.text.accent, dim = "transparent", children, fullWidth, size = "md", style }: HudButtonProps) {
  const padding = size === "sm" ? "5px 12px" : size === "lg" ? "13px 20px" : "9px 16px";
  const fontSize = size === "sm" ? "10px" : size === "lg" ? "14px" : "12px";
  return (
    <button
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${dim}cc, ${dim}44)`,
        border: `1px solid ${accent}55`,
        borderRadius: T.radius.md,
        color: accent,
        fontFamily: T.font.ui,
        fontSize,
        fontWeight: 700,
        letterSpacing: "0.15em",
        cursor: "pointer",
        padding,
        width: fullWidth ? "100%" : undefined,
        transition: T.transition.fast,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────

interface HudInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  accent?: string;
  multiline?: boolean;
  rows?: number;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}

export function HudInput({ value, onChange, placeholder, accent = T.text.accent, multiline, rows = 4, style, autoFocus }: HudInputProps) {
  const shared: React.CSSProperties = {
    width: "100%",
    background: "#040c14",
    border: `1px solid ${accent}33`,
    borderRadius: T.radius.md,
    color: T.text.primary,
    fontFamily: T.font.display,
    fontSize: "12px",
    lineHeight: 1.6,
    padding: "10px 12px",
    outline: "none",
    resize: multiline ? "vertical" : undefined,
    boxSizing: "border-box",
    ...style,
  };
  if (multiline) {
    return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} autoFocus={autoFocus} style={shared} />;
  }
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} style={shared} />;
}

// ─── DIVIDER ──────────────────────────────────────────────────────────────────

export function HudDivider({ accent = "#00e5ff" }: { accent?: string }) {
  return (
    <div style={{
      margin: "16px 0",
      height: "1px",
      background: `linear-gradient(90deg, transparent, ${accent}22, transparent)`,
    }} />
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────

export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontFamily: T.font.display, fontSize: "8px", letterSpacing: "0.2em",
      color, border: `1px solid ${color}55`, borderRadius: "3px",
      padding: "1px 5px", textTransform: "uppercase",
    }}>{label}</span>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function closeBtn(accent: string): React.CSSProperties {
  return {
    background: "transparent",
    border: `1px solid ${accent}44`,
    borderRadius: T.radius.sm,
    color: accent,
    fontSize: "16px",
    cursor: "pointer",
    width: "28px", height: "28px",
    fontFamily: "monospace",
    display: "flex", alignItems: "center", justifyContent: "center",
    lineHeight: 1,
    flexShrink: 0,
  };
}
