import type { Note, Task, Settings, RecentItem, AppLink, Zone } from "../../types";
import {
  SEED_ZONES, SEED_APPS, SEED_NOTES, SEED_TASKS,
  DEFAULT_SETTINGS,
} from "../constants/seed";

const NS = "dm_cc_"; // namespace prefix

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    console.warn("[DB] localStorage write failed for key:", key);
  }
}

function remove(key: string): void {
  localStorage.removeItem(NS + key);
}

// ─── ZONES ────────────────────────────────────────────────────────────────────

export const zonesDb = {
  getAll: (): Zone[] => get("zones", SEED_ZONES),
  save: (zones: Zone[]) => set("zones", zones),
  reset: () => remove("zones"),
};

// ─── APP LINKS ────────────────────────────────────────────────────────────────

export const appsDb = {
  getAll: (): AppLink[] => get("apps", SEED_APPS),
  save: (apps: AppLink[]) => set("apps", apps),
  add: (app: AppLink) => {
    const all = appsDb.getAll();
    appsDb.save([...all, app]);
  },
  update: (id: string, patch: Partial<AppLink>) => {
    const all = appsDb.getAll().map(a => a.id === id ? { ...a, ...patch } : a);
    appsDb.save(all);
  },
  delete: (id: string) => {
    appsDb.save(appsDb.getAll().filter(a => a.id !== id));
  },
  togglePin: (id: string) => {
    const all = appsDb.getAll().map(a => a.id === id ? { ...a, pinned: !a.pinned } : a);
    appsDb.save(all);
  },
  reset: () => remove("apps"),
};

// ─── NOTES ────────────────────────────────────────────────────────────────────

export const notesDb = {
  getAll: (): Note[] => get("notes", SEED_NOTES),
  save: (notes: Note[]) => set("notes", notes),
  add: (note: Note) => {
    notesDb.save([...notesDb.getAll(), note]);
  },
  update: (id: string, patch: Partial<Note>) => {
    const updated = notesDb.getAll().map(n =>
      n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
    );
    notesDb.save(updated);
  },
  delete: (id: string) => {
    notesDb.save(notesDb.getAll().filter(n => n.id !== id));
  },
};

// ─── TASKS ────────────────────────────────────────────────────────────────────

export const tasksDb = {
  getAll: (): Task[] => get("tasks", SEED_TASKS),
  save: (tasks: Task[]) => set("tasks", tasks),
  add: (task: Task) => {
    tasksDb.save([...tasksDb.getAll(), task]);
  },
  toggle: (id: string) => {
    const all = tasksDb.getAll().map(t =>
      t.id === id
        ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
        : t
    );
    tasksDb.save(all);
  },
  delete: (id: string) => {
    tasksDb.save(tasksDb.getAll().filter(t => t.id !== id));
  },
};

// ─── RECENT ACTIVITY ──────────────────────────────────────────────────────────

export const recentDb = {
  getAll: (): RecentItem[] => get("recent", []),
  record: (app: Pick<AppLink, "id" | "name" | "icon" | "url">) => {
    const all = recentDb.getAll().filter(r => r.appLinkId !== app.id);
    const entry: RecentItem = {
      id: crypto.randomUUID(),
      appLinkId: app.id,
      name: app.name,
      icon: app.icon,
      url: app.url,
      openedAt: new Date().toISOString(),
    };
    recentDb._save([entry, ...all].slice(0, 12));
  },
  _save: (items: RecentItem[]) => set("recent", items),
  clear: () => remove("recent"),
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────

export const settingsDb = {
  get: (): Settings => get("settings", DEFAULT_SETTINGS),
  save: (settings: Settings) => set("settings", settings),
  patch: (patch: Partial<Settings>) => {
    settingsDb.save({ ...settingsDb.get(), ...patch });
  },
  reset: () => remove("settings"),
};

// ─── PINNED / FAVORITES ───────────────────────────────────────────────────────

export const favoritesDb = {
  getPinned: (): AppLink[] => appsDb.getAll().filter(a => a.pinned),
};
