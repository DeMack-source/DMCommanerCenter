import { tokens as T } from "../../lib/constants/tokens";
import { HudCard, SectionHeader } from "../layout/Primitives";
import type { AppLink, RecentItem } from "../../types";

const PIN_ACCENT = T.zones.dev.accent;
const REC_ACCENT = T.zones.social.accent;

// ─── PINNED APPS WIDGET ───────────────────────────────────────────────────────

interface PinnedWidgetProps {
  apps: AppLink[];
  onOpen: (app: AppLink) => void;
  onUnpin: (id: string) => void;
}

export function PinnedWidget({ apps, onOpen, onUnpin }: PinnedWidgetProps) {
  return (
    <HudCard accent={PIN_ACCENT} dim={T.zones.dev.dim + "44"}>
      <SectionHeader glyph="★" label="PINNED" accent={PIN_ACCENT} count={apps.length} />
      {apps.length === 0 ? (
        <div style={{ fontFamily: T.font.display, fontSize: "10px", color: T.text.muted, textAlign: "center", padding: "10px 0" }}>
          LONG-PRESS ANY APP TO PIN
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {apps.map(app => (
            <PinnedChip key={app.id} app={app} onOpen={onOpen} onUnpin={onUnpin} />
          ))}
        </div>
      )}
    </HudCard>
  );
}

function PinnedChip({ app, onOpen, onUnpin }: { app: AppLink; onOpen: (a: AppLink) => void; onUnpin: (id: string) => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "5px",
      background: T.zones.dev.dim + "88",
      border: `1px solid ${PIN_ACCENT}33`,
      borderRadius: "20px",
      padding: "4px 10px",
    }}>
      <span style={{ fontSize: "13px" }}>{app.icon}</span>
      <button
        onClick={() => onOpen(app)}
        style={{
          background: "none", border: "none",
          color: PIN_ACCENT, fontFamily: T.font.ui,
          fontSize: "10px", fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.05em",
        }}
      >
        {app.name}
      </button>
      <button
        onClick={() => onUnpin(app.id)}
        style={{ background: "none", border: "none", color: T.text.muted, cursor: "pointer", fontSize: "11px" }}
        aria-label="Unpin"
      >×</button>
    </div>
  );
}

// ─── RECENT ACTIVITY WIDGET ───────────────────────────────────────────────────

interface RecentWidgetProps {
  recent: RecentItem[];
  onOpen: (url: string) => void;
  onClear: () => void;
}

export function RecentWidget({ recent, onOpen, onClear }: RecentWidgetProps) {
  const items = recent.slice(0, 6);
  return (
    <HudCard accent={REC_ACCENT} dim={T.zones.social.dim + "44"}>
      <SectionHeader
        glyph="◉"
        label="RECENT"
        accent={REC_ACCENT}
        action={recent.length > 0 ? { label: "CLEAR", onClick: onClear } : undefined}
      />
      {items.length === 0 ? (
        <div style={{ fontFamily: T.font.display, fontSize: "10px", color: T.text.muted, textAlign: "center", padding: "10px 0" }}>
          NO RECENT ACTIVITY
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {items.map(item => {
            const time = timeAgo(new Date(item.openedAt));
            return (
              <button
                key={item.id}
                onClick={() => onOpen(item.url)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  background: "transparent", border: "none", cursor: "pointer",
                  padding: "5px 0", textAlign: "left",
                }}
              >
                <span style={{ fontSize: "13px" }}>{item.icon}</span>
                <span style={{ fontFamily: T.font.ui, fontSize: "11px", color: T.text.secondary, flex: 1, fontWeight: 600 }}>
                  {item.name}
                </span>
                <span style={{ fontFamily: T.font.display, fontSize: "8px", color: T.text.muted, flexShrink: 0 }}>
                  {time}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </HudCard>
  );
}

// ─── SEARCH BAR ──────────────────────────────────────────────────────────────

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div style={{ position: "relative", marginBottom: "4px" }}>
      <span style={{
        position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
        fontFamily: T.font.display, fontSize: "12px", color: T.text.muted,
        pointerEvents: "none",
      }}>⌕</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="SEARCH APPS..."
        style={{
          width: "100%", boxSizing: "border-box",
          background: T.bg.card,
          border: `1px solid ${value ? T.border.normal : T.border.subtle}`,
          borderRadius: T.radius.lg,
          color: T.text.primary,
          fontFamily: T.font.display,
          fontSize: "11px",
          letterSpacing: "0.08em",
          padding: "9px 12px 9px 30px",
          outline: "none",
          transition: T.transition.fast,
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none",
            color: T.text.muted, cursor: "pointer", fontSize: "14px",
          }}
        >×</button>
      )}
    </div>
  );
}

// ─── ADD APP MODAL ────────────────────────────────────────────────────────────

import { useState } from "react";
import { Overlay, HudInput, HudButton } from "../layout/Primitives";
import type { Zone } from "../../types";

interface AddAppModalProps {
  zones: Zone[];
  defaultZoneId?: string;
  onAdd: (data: { name: string; url: string; icon: string; zoneId: string }) => void;
  onClose: () => void;
}

export function AddAppModal({ zones, defaultZoneId, onAdd, onClose }: AddAppModalProps) {
  const [form, setForm] = useState({ name: "", url: "", icon: "🔗", zoneId: defaultZoneId || zones[0]?.id || "" });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.url.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <Overlay title="// ADD APP" accent={T.text.accent} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <HudInput value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} placeholder="Icon" accent={T.text.accent} style={{ width: "60px", textAlign: "center", fontSize: "18px" }} />
          <HudInput value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="App name" accent={T.text.accent} autoFocus style={{ flex: 1 }} />
        </div>
        <HudInput value={form.url} onChange={v => setForm(f => ({ ...f, url: v }))} placeholder="https://..." accent={T.text.accent} />
        <select
          value={form.zoneId}
          onChange={e => setForm(f => ({ ...f, zoneId: e.target.value }))}
          style={{
            background: T.bg.card, border: `1px solid ${T.border.subtle}`,
            borderRadius: T.radius.md, color: T.text.primary,
            fontFamily: T.font.ui, fontSize: "12px", padding: "10px 12px",
            outline: "none",
          }}
        >
          {zones.map(z => (
            <option key={z.id} value={z.id}>{z.label}</option>
          ))}
        </select>
        <div style={{ display: "flex", gap: "8px" }}>
          <HudButton onClick={handleSubmit} accent={T.text.accent} dim={T.zones.dev.dim} fullWidth>ADD TO LAUNCHER</HudButton>
          <HudButton onClick={onClose} accent={T.text.muted} dim="transparent">CANCEL</HudButton>
        </div>
      </div>
    </Overlay>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "NOW";
  if (mins < 60) return `${mins}M`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}H`;
  return `${Math.floor(hrs / 24)}D`;
}
