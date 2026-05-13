import { useState } from "react";
import { tokens as T } from "../../lib/constants/tokens";
import { Overlay, HudCard, HudButton, HudInput, SectionHeader, Badge } from "../layout/Primitives";
import type { Task } from "../../types";

const ACCENT = T.zones.media.accent; // gold

// ─── TASKS MODAL ─────────────────────────────────────────────────────────────

interface TasksModalProps {
  tasks: Task[];
  onAdd: (data: { title: string; priority?: "low" | "medium" | "high" }) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TasksModal({ tasks, onAdd, onToggle, onDelete, onClose }: TasksModalProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority });
    setTitle("");
  };

  const pending = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  return (
    <Overlay title="// TASKS" accent={ACCENT} onClose={onClose} maxWidth="480px">
      {/* Add form */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <HudInput
          value={title}
          onChange={setTitle}
          placeholder="New task..."
          accent={ACCENT}
          autoFocus
          style={{ flex: 1 }}
        />
        <HudButton onClick={submit} accent={ACCENT} dim={T.zones.media.dim}>ADD</HudButton>
      </div>

      {/* Priority selector */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {(["high", "medium", "low"] as const).map(p => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            style={{
              flex: 1, padding: "5px",
              background: priority === p ? T.priority[p] + "22" : "transparent",
              border: `1px solid ${priority === p ? T.priority[p] : T.text.muted + "44"}`,
              borderRadius: T.radius.sm,
              color: priority === p ? T.priority[p] : T.text.muted,
              fontFamily: T.font.ui, fontSize: "10px", fontWeight: 700,
              letterSpacing: "0.15em", cursor: "pointer", textTransform: "uppercase",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "50vh", overflowY: "auto" }}>
        {pending.length === 0 && done.length === 0 && (
          <div style={{ textAlign: "center", color: T.text.muted, fontFamily: T.font.display, fontSize: "11px", padding: "20px 0" }}>
            NO TASKS — ALL CLEAR
          </div>
        )}
        {pending.map(task => (
          <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
        ))}
        {done.length > 0 && (
          <>
            <div style={{ height: "1px", background: T.border.subtle, margin: "8px 0" }} />
            <div style={{ fontFamily: T.font.display, fontSize: "9px", color: T.text.muted, letterSpacing: "0.2em", marginBottom: "4px" }}>
              COMPLETED ({done.length})
            </div>
            {done.slice(0, 5).map(task => (
              <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </>
        )}
      </div>
    </Overlay>
  );
}

// ─── TASK ROW ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const pColor = T.priority[task.priority];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "9px 12px",
      background: task.completed ? "transparent" : T.bg.card,
      border: `1px solid ${task.completed ? T.border.subtle : pColor + "28"}`,
      borderRadius: T.radius.sm,
      opacity: task.completed ? 0.45 : 1,
      transition: T.transition.fast,
    }}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        style={{
          width: "16px", height: "16px", flexShrink: 0,
          border: `1px solid ${pColor}`,
          borderRadius: "3px",
          background: task.completed ? pColor + "44" : "transparent",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: pColor, fontSize: "10px",
        }}
      >
        {task.completed ? "✓" : ""}
      </button>

      {/* Priority dot */}
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: pColor, flexShrink: 0 }} />

      {/* Title */}
      <span style={{
        flex: 1,
        fontFamily: T.font.ui, fontSize: "12px", fontWeight: 600,
        color: task.completed ? T.text.muted : T.text.primary,
        textDecoration: task.completed ? "line-through" : "none",
        letterSpacing: "0.03em",
      }}>
        {task.title}
      </span>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        style={{ background: "none", border: "none", color: T.text.muted, cursor: "pointer", fontSize: "13px", flexShrink: 0 }}
      >×</button>
    </div>
  );
}

// ─── TASKS WIDGET ────────────────────────────────────────────────────────────

interface TasksWidgetProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onOpen: () => void;
}

export function TasksWidget({ tasks, onToggle, onOpen }: TasksWidgetProps) {
  const pending = tasks.filter(t => !t.completed).slice(0, 4);
  return (
    <HudCard accent={ACCENT} dim={T.zones.media.dim + "44"}>
      <SectionHeader glyph="◎" label="TASKS" accent={ACCENT} count={tasks.filter(t => !t.completed).length} action={{ label: "ALL", onClick: onOpen }} />
      {pending.length === 0 ? (
        <div style={{ fontFamily: T.font.display, fontSize: "10px", color: T.text.muted, textAlign: "center", padding: "10px 0" }}>
          ALL CLEAR ✓
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {pending.map(task => (
            <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => onToggle(task.id)}
                style={{
                  width: "13px", height: "13px", flexShrink: 0,
                  border: `1px solid ${T.priority[task.priority]}`,
                  borderRadius: "2px", background: "transparent",
                  cursor: "pointer",
                }}
              />
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.priority[task.priority], flexShrink: 0 }} />
              <span style={{ fontFamily: T.font.ui, fontSize: "11px", color: T.text.secondary, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </HudCard>
  );
}
