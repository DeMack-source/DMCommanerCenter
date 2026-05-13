import { useState, useEffect, useCallback, useRef } from "react";
import {
  zonesDb, appsDb, notesDb, tasksDb,
  recentDb, settingsDb, favoritesDb,
} from "../lib/db";
import { validateNote, validateTask, validateAppLink } from "../lib/validators";
import type {
  Zone, AppLink, Note, Task, RecentItem, Settings, ModalType, ViewMode,
} from "../types";

// ─── SHAPE ───────────────────────────────────────────────────────────────────

export interface StoreState {
  // data
  zones: Zone[];
  apps: AppLink[];
  notes: Note[];
  tasks: Task[];
  recent: RecentItem[];
  settings: Settings;
  // ui
  activeZoneId: ViewMode;
  searchQuery: string;
  modal: ModalType;
  booted: boolean;
  // computed helpers
  visibleApps: AppLink[];
  pinnedApps: AppLink[];
  // actions
  setActiveZone: (id: ViewMode) => void;
  setSearchQuery: (q: string) => void;
  openModal: (m: ModalType) => void;
  closeModal: () => void;
  openApp: (app: AppLink) => void;
  togglePin: (id: string) => void;
  // notes
  addNote: (data: { title?: string; content: string }) => void;
  updateNote: (id: string, data: Partial<{ title: string; content: string }>) => void;
  deleteNote: (id: string) => void;
  // tasks
  addTask: (data: { title: string; priority?: "low" | "medium" | "high" }) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  // apps
  addApp: (data: { name: string; url: string; icon: string; zoneId: string }) => void;
  deleteApp: (id: string) => void;
  // settings
  patchSettings: (patch: Partial<Settings>) => void;
  // misc
  clearRecent: () => void;
}

// ─── HOOK (acts as our store) ─────────────────────────────────────────────────

export function useStore(): StoreState {
  const [zones, setZones] = useState<Zone[]>([]);
  const [apps, setApps] = useState<AppLink[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [settings, setSettings] = useState<Settings>(settingsDb.get());
  const [activeZoneId, setActiveZoneId] = useState<ViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<ModalType>(null);
  const [booted, setBooted] = useState(false);

  // Bootstrap
  useEffect(() => {
    setZones(zonesDb.getAll());
    setApps(appsDb.getAll());
    setNotes(notesDb.getAll());
    setTasks(tasksDb.getAll());
    setRecent(recentDb.getAll());
    setSettings(settingsDb.get());
    setTimeout(() => setBooted(true), 350);
  }, []);

  // ── Computed ──
  const visibleApps = apps.filter(a => {
    const zoneMatch = activeZoneId === "all" || a.zoneId === activeZoneId;
    const searchMatch = !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.url.toLowerCase().includes(searchQuery.toLowerCase());
    return zoneMatch && searchMatch;
  });

  const pinnedApps = apps.filter(a => a.pinned);

  // ── Actions ──
  const openApp = useCallback((app: AppLink) => {
    recentDb.record(app);
    setRecent(recentDb.getAll());
    window.open(app.url, "_blank", "noopener,noreferrer");
  }, []);

  const togglePin = useCallback((id: string) => {
    appsDb.togglePin(id);
    setApps(appsDb.getAll());
  }, []);

  const addNote = useCallback((data: { title?: string; content: string }) => {
    const v = validateNote(data);
    const note: Note = {
      id: crypto.randomUUID(),
      title: v.title,
      content: v.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notesDb.add(note);
    setNotes(notesDb.getAll());
  }, []);

  const updateNote = useCallback((id: string, data: Partial<{ title: string; content: string }>) => {
    notesDb.update(id, data);
    setNotes(notesDb.getAll());
  }, []);

  const deleteNote = useCallback((id: string) => {
    notesDb.delete(id);
    setNotes(notesDb.getAll());
  }, []);

  const addTask = useCallback((data: { title: string; priority?: "low" | "medium" | "high" }) => {
    const v = validateTask(data);
    const task: Task = {
      id: crypto.randomUUID(),
      title: v.title,
      priority: v.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    tasksDb.add(task);
    setTasks(tasksDb.getAll());
  }, []);

  const toggleTask = useCallback((id: string) => {
    tasksDb.toggle(id);
    setTasks(tasksDb.getAll());
  }, []);

  const deleteTask = useCallback((id: string) => {
    tasksDb.delete(id);
    setTasks(tasksDb.getAll());
  }, []);

  const addApp = useCallback((data: { name: string; url: string; icon: string; zoneId: string }) => {
    const v = validateAppLink(data);
    const app: AppLink = {
      id: crypto.randomUUID(),
      ...v,
      pinned: false,
      order: 999,
    };
    appsDb.add(app);
    setApps(appsDb.getAll());
  }, []);

  const deleteApp = useCallback((id: string) => {
    appsDb.delete(id);
    setApps(appsDb.getAll());
  }, []);

  const patchSettings = useCallback((patch: Partial<Settings>) => {
    settingsDb.patch(patch);
    setSettings(settingsDb.get());
  }, []);

  const clearRecent = useCallback(() => {
    recentDb.clear();
    setRecent([]);
  }, []);

  return {
    zones, apps, notes, tasks, recent, settings,
    activeZoneId, searchQuery, modal, booted,
    visibleApps, pinnedApps,
    setActiveZone: setActiveZoneId,
    setSearchQuery,
    openModal: setModal,
    closeModal: () => setModal(null),
    openApp, togglePin,
    addNote, updateNote, deleteNote,
    addTask, toggleTask, deleteTask,
    addApp, deleteApp,
    patchSettings,
    clearRecent,
  };
}
