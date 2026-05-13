import { useState, useEffect } from "react";
import { tokens as T } from "../../lib/constants/tokens";
import { SectionHeader } from "../layout/Primitives";
import type { AppLink, Zone } from "../../types";

// ─── APP TILE ─────────────────────────────────────────────────────────────────

interface AppTileProps {
  app: AppLink;
  accent: string;
  dim: string;
  onOpen: (app: AppLink) => void;
  onPin: (id: string) => void;
  onDelete?: (id: string) => void;
  animIndex?: number;
  dense?: boolean;
}

export function AppTile({ app, accent, dim, onOpen, onPin, onDelete, animIndex = 0, dense }: AppTileProps) {
  const [pressed, setPressed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), animIndex * 35);
    return () => clearTimeout(t);
  }, [animIndex]);

  const handleLongPress = () => setShowMenu(true);

  return (
    <div style={{ position: "relative" }}>
      <button
        onPointerDown={() => {
          setPressed(true);
          const t = setTimeout(handleLongPress, 600);
          const cleanup = () => { clearTimeout(t); };
          document.addEventListener("pointerup", cleanup, { once: true });
        }}
        onPointerUp={() => {
          setPressed(false);
          if (!showMenu) onOpen(app);
        }}
        onPointerLeave={() => setPressed(false)}
        aria-label={`Open ${app.name}`}
        style={{
          background: pressed
            ? `${dim}ee`
            : `linear-gradient(135deg, ${dim}bb, ${dim}55)`,
          border: `1px solid ${pressed ? accent : accent + "38"}`,
          borderRadius: T.radius.md,
          padding: dense ? "10px 4px" : "clamp(10px,2.5vw,16px) 6px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: dense ? "4px" : "6px",
          width: "100%",
          minHeight: dense ? "68px" : "80px",
          transform: pressed ? "scale(0.91)" : mounted ? "scale(1)" : "scale(0.82)",
          opacity: mounted ? 1 : 0,
          transition: T.transition.spring,
          boxShadow: pressed
            ? `0 0 18px ${accent}55, inset 0 0 8px ${accent}18`
            : `0 4px 14px rgba(0,0,0,0.5)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Corner brackets */}
        <span style={{ position: "absolute", top: 4, left: 4, width: 7, height: 7, borderTop: `1px solid ${accent}77`, borderLeft: `1px solid ${accent}77` }} />
        <span style={{ position: "absolute", bottom: 4, right: 4, width: 7, height: 7, borderBottom: `1px solid ${accent}77`, borderRight: `1px solid ${accent}77` }} />

        {/* Pin indicator */}
        {app.pinned && (
          <span style={{ position: "absolute", top: 3, right: 5, fontSize: "7px", color: accent, opacity: 0.8 }}>★</span>
        )}

        <span style={{ fontSize: dense ? "20px" : "clamp(20px,5vw,28px)", lineHeight: 1 }}>{app.icon}</span>
        <span style={{
          fontFamily: T.font.ui,
          fontSize: dense ? "8px" : "clamp(8px,1.8vw,10px)",
          color: accent,
          letterSpacing: "0.05em",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.1,
          wordBreak: "break-word",
          maxWidth: "100%",
        }}>
          {app.name.toUpperCase()}
        </span>
      </button>

      {/* Context menu */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#080f18",
            border: `1px solid ${accent}55`,
            borderRadius: T.radius.md,
            zIndex: 200,
            minWidth: "130px",
            boxShadow: `0 8px 32px rgba(0,0,0,0.8)`,
            overflow: "hidden",
          }}
          onPointerDown={e => e.stopPropagation()}
        >
          {[
            { label: app.pinned ? "★ Unpin" : "☆ Pin", action: () => { onPin(app.id); setShowMenu(false); } },
            { label: "↗ Open", action: () => { onOpen(app); setShowMenu(false); } },
            ...(onDelete ? [{ label: "✕ Remove", action: () => { onDelete(app.id); setShowMenu(false); } }] : []),
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: "block", width: "100%",
                padding: "9px 14px", background: "transparent",
                border: "none", borderBottom: `1px solid ${accent}18`,
                color: accent, fontFamily: T.font.ui,
                fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.1em", cursor: "pointer",
                textAlign: "left",
              }}
            >
              {item.label}
            </button>
          ))}
          <button onClick={() => setShowMenu(false)} style={{
            display: "block", width: "100%", padding: "7px 14px",
            background: "transparent", border: "none",
            color: T.text.muted, fontFamily: T.font.ui,
            fontSize: "10px", cursor: "pointer", textAlign: "left",
          }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ZONE PANEL ───────────────────────────────────────────────────────────────

interface ZonePanelProps {
  zone: Zone;
  apps: AppLink[];
  onOpen: (app: AppLink) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onAddApp: () => void;
  dense?: boolean;
}

export function ZonePanel({ zone, apps, onOpen, onPin, onDelete, onAddApp, dense }: ZonePanelProps) {
  if (apps.length === 0) {
    return (
      <div style={{ marginBottom: "24px" }}>
        <SectionHeader
          glyph={zone.glyph}
          label={zone.label}
          accent={zone.accent}
          count={0}
          action={{ label: "+ ADD", onClick: onAddApp }}
        />
        <div style={{
          textAlign: "center", padding: "24px",
          color: T.text.muted, fontFamily: T.font.display,
          fontSize: "11px", letterSpacing: "0.1em",
        }}>
          NO NODES IN THIS ZONE
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "28px" }}>
      <SectionHeader
        glyph={zone.glyph}
        label={zone.label}
        accent={zone.accent}
        count={apps.length}
        action={{ label: "+ ADD", onClick: onAddApp }}
      />
      <div style={{
        display: "grid",
        gridTemplateColumns: dense
          ? "repeat(5, 1fr)"
          : "repeat(4, 1fr)",
        gap: dense ? "6px" : "clamp(6px,1.5vw,10px)",
      }}>
        {apps.map((app, i) => (
          <AppTile
            key={app.id}
            app={app}
            accent={zone.accent}
            dim={zone.dim}
            onOpen={onOpen}
            onPin={onPin}
            onDelete={onDelete}
            animIndex={i}
            dense={dense}
          />
        ))}
      </div>
    </div>
  );
}
