import { useState } from "react";
import { tokens as T } from "../../lib/constants/tokens";
import { Overlay, HudCard, HudButton, HudInput, SectionHeader, Badge } from "../layout/Primitives";
import type { Note } from "../../types";

const ACCENT = T.zones.ops.accent; // green

// ─── NOTES MODAL ─────────────────────────────────────────────────────────────

interface NotesModalProps {
  notes: Note[];
  onAdd: (data: { title?: string; content: string }) => void;
  onUpdate: (id: string, data: Partial<{ title: string; content: string }>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function NotesModal({ notes, onAdd, onUpdate, onDelete, onClose }: NotesModalProps) {
  const [editing, setEditing] = useState<Note | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ title: "", content: "" });

  const startCreate = () => {
    setDraft({ title: "", content: "" });
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (note: Note) => {
    setDraft({ title: note.title, content: note.content });
    setEditing(note);
    setCreating(false);
  };

  const save = () => {
    if (!draft.content.trim()) return;
    if (creating) {
      onAdd({ title: draft.title || "Untitled", content: draft.content });
    } else if (editing) {
      onUpdate(editing.id, { title: draft.title, content: draft.content });
    }
    setCreating(false);
    setEditing(null);
  };

  return (
    <Overlay title="// NOTES" accent={ACCENT} onClose={onClose} maxWidth="520px">
      {/* List view */}
      {!creating && !editing && (
        <>
          <HudButton onClick={startCreate} accent={ACCENT} dim={T.zones.ops.dim} fullWidth style={{ marginBottom: "14px" }}>
            + NEW NOTE
          </HudButton>
          {notes.length === 0 && (
            <div style={{ textAlign: "center", color: T.text.muted, fontFamily: T.font.display, fontSize: "11px", padding: "24px 0" }}>
              NO NOTES YET
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "55vh", overflowY: "auto" }}>
            {notes.map(note => (
              <NoteCard key={note.id} note={note} onEdit={() => startEdit(note)} onDelete={() => onDelete(note.id)} />
            ))}
          </div>
        </>
      )}

      {/* Edit / Create view */}
      {(creating || editing) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <HudInput
            value={draft.title}
            onChange={v => setDraft(d => ({ ...d, title: v }))}
            placeholder="Title (optional)"
            accent={ACCENT}
          />
          <HudInput
            value={draft.content}
            onChange={v => setDraft(d => ({ ...d, content: v }))}
            placeholder="Write your note..."
            accent={ACCENT}
            multiline
            rows={8}
            autoFocus
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <HudButton onClick={save} accent={ACCENT} dim={T.zones.ops.dim} fullWidth>SAVE</HudButton>
            <HudButton onClick={() => { setCreating(false); setEditing(null); }} accent={T.text.muted} dim="transparent">CANCEL</HudButton>
          </div>
        </div>
      )}
    </Overlay>
  );
}

// ─── NOTE CARD ───────────────────────────────────────────────────────────────

function NoteCard({ note, onEdit, onDelete }: { note: Note; onEdit: () => void; onDelete: () => void }) {
  const updated = new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <HudCard accent={ACCENT} dim={T.zones.ops.dim + "44"} style={{ padding: "12px 14px", cursor: "pointer" }} onClick={onEdit}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
        <span style={{ fontFamily: T.font.ui, fontWeight: 700, fontSize: "12px", color: ACCENT, letterSpacing: "0.05em" }}>
          {note.title}
        </span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: T.font.display, fontSize: "8px", color: T.text.muted }}>{updated}</span>
          <button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{ background: "none", border: "none", color: T.text.muted, cursor: "pointer", fontSize: "12px", lineHeight: 1 }}
          >×</button>
        </div>
      </div>
      <p style={{ fontFamily: T.font.display, fontSize: "11px", color: T.text.secondary, lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" }}>
        {note.content.slice(0, 120)}{note.content.length > 120 ? "…" : ""}
      </p>
    </HudCard>
  );
}

// ─── NOTES WIDGET (Dashboard card) ───────────────────────────────────────────

interface NotesWidgetProps {
  notes: Note[];
  onOpen: () => void;
}

export function NotesWidget({ notes, onOpen }: NotesWidgetProps) {
  const latest = notes[0];
  return (
    <HudCard accent={ACCENT} dim={T.zones.ops.dim + "44"} onClick={onOpen} style={{ cursor: "pointer" }}>
      <SectionHeader glyph="◇" label="NOTES" accent={ACCENT} count={notes.length} />
      {latest ? (
        <>
          <div style={{ fontFamily: T.font.ui, fontSize: "12px", color: ACCENT, fontWeight: 700, marginBottom: "4px" }}>{latest.title}</div>
          <p style={{ fontFamily: T.font.display, fontSize: "10px", color: T.text.secondary, lineHeight: 1.5, margin: 0 }}>
            {latest.content.slice(0, 80)}{latest.content.length > 80 ? "…" : ""}
          </p>
        </>
      ) : (
        <div style={{ fontFamily: T.font.display, fontSize: "10px", color: T.text.muted, textAlign: "center", padding: "8px 0" }}>
          NO NOTES YET — TAP TO ADD
        </div>
      )}
    </HudCard>
  );
}
