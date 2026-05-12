// ─── DOMAIN TYPES ────────────────────────────────────────────────────────────

export interface Zone {
  id: string;
  label: string;
  glyph: string;
  accent: string;
  dim: string;
  order: number;
}

export interface AppLink {
  id: string;
  zoneId: string;
  name: string;
  icon: string;
  url: string;
  pinned: boolean;
  order: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  completedAt: string | null;
}

export interface RecentItem {
  id: string;
  appLinkId: string;
  name: string;
  icon: string;
  url: string;
  openedAt: string;
}

export interface Settings {
  kioskMode: boolean;
  denseMode: boolean;
  scanlines: boolean;
  gridOverlay: boolean;
  userName: string;
  sector: string;
  version: string;
}

// ─── UI STATE TYPES ───────────────────────────────────────────────────────────

export type ModalType = "notes" | "tasks" | "settings" | "addApp" | null;
export type ViewMode = "all" | string; // string = zoneId

export interface DashboardState {
  activeZoneId: ViewMode;
  searchQuery: string;
  modal: ModalType;
  kioskMode: boolean;
  denseMode: boolean;
  booted: boolean;
}
