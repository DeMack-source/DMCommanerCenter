import type { Zone, AppLink, Note, Task, Settings } from "../types";

export const SEED_ZONES: Zone[] = [
  { id: "dev",    label: "DEV / BUILD",         glyph: "◈", accent: "#00e5ff", dim: "#003d4d", order: 0 },
  { id: "social", label: "SOCIAL / BROADCAST",  glyph: "◉", accent: "#ff6b35", dim: "#4d1f0a", order: 1 },
  { id: "art",    label: "ART / STUDIO",         glyph: "◬", accent: "#c77dff", dim: "#2d0a4d", order: 2 },
  { id: "media",  label: "MEDIA / PERFORM",      glyph: "◎", accent: "#ffd60a", dim: "#3d3000", order: 3 },
  { id: "ops",    label: "OPS / INTEL",          glyph: "◇", accent: "#39ff14", dim: "#0a2d0a", order: 4 },
];

export const SEED_APPS: AppLink[] = [
  // DEV
  { id: "dev-1", zoneId: "dev", name: "VS Code Web",   icon: "🖥",  url: "https://vscode.dev",                                      pinned: false, order: 0 },
  { id: "dev-2", zoneId: "dev", name: "GitHub",        icon: "🐙",  url: "https://github.com/demack-source",                        pinned: true,  order: 1 },
  { id: "dev-3", zoneId: "dev", name: "Replit",        icon: "⚡",  url: "https://replit.com",                                      pinned: false, order: 2 },
  { id: "dev-4", zoneId: "dev", name: "CodeSandbox",   icon: "📦",  url: "https://codesandbox.io",                                  pinned: false, order: 3 },
  { id: "dev-5", zoneId: "dev", name: "StackBlitz",    icon: "🔷",  url: "https://stackblitz.com",                                  pinned: false, order: 4 },
  { id: "dev-6", zoneId: "dev", name: "Claude AI",     icon: "🤖",  url: "https://claude.ai",                                       pinned: true,  order: 5 },
  { id: "dev-7", zoneId: "dev", name: "Vercel",        icon: "▲",   url: "https://vercel.com",                                      pinned: false, order: 6 },
  { id: "dev-8", zoneId: "dev", name: "2nd Chance",    icon: "⚖️",  url: "https://demack-source.github.io/Second-Chance-Manual-/", pinned: true,  order: 7 },
  // SOCIAL
  { id: "soc-1", zoneId: "social", name: "Instagram",  icon: "📸",  url: "https://instagram.com",   pinned: true,  order: 0 },
  { id: "soc-2", zoneId: "social", name: "TikTok",     icon: "🎵",  url: "https://tiktok.com",      pinned: true,  order: 1 },
  { id: "soc-3", zoneId: "social", name: "X / Twitter",icon: "✖",   url: "https://x.com",           pinned: false, order: 2 },
  { id: "soc-4", zoneId: "social", name: "Facebook",   icon: "👥",  url: "https://facebook.com",    pinned: false, order: 3 },
  { id: "soc-5", zoneId: "social", name: "LinkedIn",   icon: "💼",  url: "https://linkedin.com",    pinned: false, order: 4 },
  { id: "soc-6", zoneId: "social", name: "YouTube",    icon: "▶️",  url: "https://youtube.com",     pinned: true,  order: 5 },
  { id: "soc-7", zoneId: "social", name: "Pinterest",  icon: "📌",  url: "https://pinterest.com",   pinned: false, order: 6 },
  { id: "soc-8", zoneId: "social", name: "Buffer",     icon: "📡",  url: "https://buffer.com",      pinned: false, order: 7 },
  // ART
  { id: "art-1", zoneId: "art", name: "Canva",         icon: "🎨",  url: "https://canva.com",                pinned: true,  order: 0 },
  { id: "art-2", zoneId: "art", name: "Adobe Express", icon: "✨",  url: "https://express.adobe.com",        pinned: false, order: 1 },
  { id: "art-3", zoneId: "art", name: "Picsart",       icon: "🖌",  url: "https://picsart.com",              pinned: false, order: 2 },
  { id: "art-4", zoneId: "art", name: "CapCut",        icon: "🎬",  url: "https://capcut.com",               pinned: true,  order: 3 },
  { id: "art-5", zoneId: "art", name: "Procreate Ref", icon: "🖼",  url: "https://procreate.com",            pinned: false, order: 4 },
  { id: "art-6", zoneId: "art", name: "Coolors",       icon: "🎭",  url: "https://coolors.co",               pinned: false, order: 5 },
  { id: "art-7", zoneId: "art", name: "Behance",       icon: "🏛",  url: "https://behance.net",              pinned: false, order: 6 },
  { id: "art-8", zoneId: "art", name: "Dribbble",      icon: "🏀",  url: "https://dribbble.com",             pinned: false, order: 7 },
  // MEDIA
  { id: "med-1", zoneId: "media", name: "Spotify",     icon: "🎧",  url: "https://open.spotify.com",              pinned: true,  order: 0 },
  { id: "med-2", zoneId: "media", name: "Netflix",     icon: "🎬",  url: "https://netflix.com",                   pinned: true,  order: 1 },
  { id: "med-3", zoneId: "media", name: "Prime Video", icon: "🛸",  url: "https://primevideo.com",                pinned: false, order: 2 },
  { id: "med-4", zoneId: "media", name: "SoundCloud",  icon: "☁️",  url: "https://soundcloud.com",               pinned: false, order: 3 },
  { id: "med-5", zoneId: "media", name: "Tidal",       icon: "🌊",  url: "https://tidal.com",                    pinned: false, order: 4 },
  { id: "med-6", zoneId: "media", name: "BeatStars",   icon: "🥁",  url: "https://beatstars.com",                pinned: false, order: 5 },
  { id: "med-7", zoneId: "media", name: "Filmora",     icon: "🎞",  url: "https://filmora.wondershare.com",      pinned: false, order: 6 },
  { id: "med-8", zoneId: "media", name: "Looperman",   icon: "🔁",  url: "https://looperman.com",                pinned: false, order: 7 },
  // OPS
  { id: "ops-1", zoneId: "ops", name: "Gmail",         icon: "✉️",  url: "https://mail.google.com",           pinned: true,  order: 0 },
  { id: "ops-2", zoneId: "ops", name: "Drive",         icon: "💾",  url: "https://drive.google.com",          pinned: false, order: 1 },
  { id: "ops-3", zoneId: "ops", name: "Calendar",      icon: "📅",  url: "https://calendar.google.com",       pinned: true,  order: 2 },
  { id: "ops-4", zoneId: "ops", name: "Canvas LMS",    icon: "🎓",  url: "https://canvas.instructure.com",    pinned: false, order: 3 },
  { id: "ops-5", zoneId: "ops", name: "Notion",        icon: "📒",  url: "https://notion.so",                 pinned: false, order: 4 },
  { id: "ops-6", zoneId: "ops", name: "Docs",          icon: "📄",  url: "https://docs.google.com",           pinned: false, order: 5 },
  { id: "ops-7", zoneId: "ops", name: "ChatGPT",       icon: "💬",  url: "https://chatgpt.com",               pinned: false, order: 6 },
  { id: "ops-8", zoneId: "ops", name: "Perplexity",    icon: "🔭",  url: "https://perplexity.ai",             pinned: false, order: 7 },
];

export const SEED_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Command Center Notes",
    content: "Welcome to DM Command Center. Drop ideas, lyrics, code snippets, build plans — anything.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const SEED_TASKS: Task[] = [
  { id: "task-1", title: "Finish Miami-Dade county page",    completed: false, priority: "high",   createdAt: new Date().toISOString(), completedAt: null },
  { id: "task-2", title: "Wire dashboard county selector",   completed: false, priority: "high",   createdAt: new Date().toISOString(), completedAt: null },
  { id: "task-3", title: "Post new art piece to Instagram",  completed: false, priority: "medium", createdAt: new Date().toISOString(), completedAt: null },
  { id: "task-4", title: "Review BUS class module 6",        completed: false, priority: "medium", createdAt: new Date().toISOString(), completedAt: null },
];

export const DEFAULT_SETTINGS: Settings = {
  kioskMode: false,
  denseMode: false,
  scanlines: true,
  gridOverlay: true,
  userName: "DEVYN",
  sector: "BROWARD FL",
  version: "v2.0",
};

export const QUOTES: string[] = [
  "Build the vision. Own the outcome.",
  "The rough ashlar becomes the perfect stone.",
  "Knowledge is the only property they can't confiscate.",
  "Second chances are first moves in disguise.",
  "Every frequency carries a signal. You are the signal.",
  "Art is the blueprint of the soul made visible.",
  "The code is the canvas. The canvas is the code.",
  "From the inside out — architect everything.",
];
