import { useState } from "react";
import { tokens as T } from "../../lib/constants/tokens";
import { Overlay, HudButton, HudInput, SectionHeader } from "../layout/Primitives";
import type { Settings } from "../../types";

const ACCENT = T.zones.art.accent; // purple

interface SettingsModalProps {
  settings: Settings;
  onPatch: (patch: Partial<Settings>) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onPatch, onClose }: SettingsModalProps) {
  const [local, setLocal] = useState<Settings>({ ...settings });

  const toggle = (key: keyof Settings) => {
    const val = !local[key];
    setLocal(s => ({ ...s, [key]: val }));
  };

  const save = () => {
    onPatch(local);
    onClose();
  };

  return (
    <Overlay title="// SETTINGS" accent={ACCENT} onClose={onClose} maxWidth="440px">
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

        <SettingsSection label="PROFILE">
          <SettingsRow label="NAME">
            <HudInput value={local.userName} onChange={v => setLocal(s => ({ ...s, userName: v }))} accent={ACCENT} style={{ width: "140px" }} />
          </SettingsRow>
          <SettingsRow label="SECTOR">
            <HudInput value={local.sector} onChange={v => setLocal(s => ({ ...s, sector: v }))} accent={ACCENT} style={{ width: "140px" }} />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection label="DISPLAY">
          <SettingsToggle label="KIOSK MODE" value={local.kioskMode} onToggle={() => toggle("kioskMode")} accent={ACCENT} />
          <SettingsToggle label="DENSE MODE" value={local.denseMode} onToggle={() => toggle("denseMode")} accent={ACCENT} />
          <SettingsToggle label="SCANLINES" value={local.scanlines} onToggle={() => toggle("scanlines")} accent={ACCENT} />
          <SettingsToggle label="GRID OVERLAY" value={local.gridOverlay} onToggle={() => toggle("gridOverlay")} accent={ACCENT} />
        </SettingsSection>

        <SettingsSection label="SYSTEM">
          <SettingsRow label="VERSION">
            <span style={{ fontFamily: T.font.display, fontSize: "11px", color: T.text.muted }}>{local.version}</span>
          </SettingsRow>
          <SettingsRow label="STORAGE">
            <span style={{ fontFamily: T.font.display, fontSize: "11px", color: T.text.muted }}>localStorage</span>
          </SettingsRow>
        </SettingsSection>

        <div style={{ display: "flex", gap: "8px" }}>
          <HudButton onClick={save} accent={ACCENT} dim={T.zones.art.dim} fullWidth>SAVE SETTINGS</HudButton>
          <HudButton onClick={onClose} accent={T.text.muted} dim="transparent">CANCEL</HudButton>
        </div>
      </div>
    </Overlay>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingsSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: T.font.display, fontSize: "9px", color: T.text.muted, letterSpacing: "0.3em", marginBottom: "10px" }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{children}</div>
    </div>
  );
}

function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: T.font.ui, fontSize: "12px", fontWeight: 600, color: T.text.secondary, letterSpacing: "0.1em" }}>{label}</span>
      {children}
    </div>
  );
}

function SettingsToggle({ label, value, onToggle, accent }: { label: string; value: boolean; onToggle: () => void; accent: string }) {
  return (
    <SettingsRow label={label}>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={value}
        style={{
          width: "40px", height: "22px",
          background: value ? accent + "44" : T.bg.card,
          border: `1px solid ${value ? accent : T.border.subtle}`,
          borderRadius: "11px",
          cursor: "pointer",
          position: "relative",
          transition: T.transition.fast,
          flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute",
          top: "3px",
          left: value ? "20px" : "3px",
          width: "14px", height: "14px",
          borderRadius: "50%",
          background: value ? accent : T.text.muted,
          transition: T.transition.spring,
          boxShadow: value ? T.glow(accent, 0.5) : "none",
        }} />
      </button>
    </SettingsRow>
  );
}
