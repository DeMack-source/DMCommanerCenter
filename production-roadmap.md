# Product Roadmap — DM Command Center

## MVP — COMPLETE ✓
- [x] Dark sci-fi command center aesthetic
- [x] Design token system (tokens.ts)
- [x] Zone-based navigation (DEV / SOCIAL / ART / MEDIA / OPS)
- [x] App launcher tiles (40 apps seeded)
- [x] Long-press context menu (pin, open, remove)
- [x] Pinned/Favorites widget
- [x] Recent activity widget (last 12 opens)
- [x] Notes: create, edit, delete, persistent
- [x] Tasks: create, complete, delete, priority levels, persistent
- [x] Live clock + date + greeting
- [x] Quote ticker
- [x] HUD stats bar
- [x] Search/filter across apps
- [x] Add App modal (per-zone)
- [x] Settings modal (kiosk, dense, scanlines, grid, profile)
- [x] Kiosk mode / Dense mode / Screensaver
- [x] localStorage persistence
- [x] Responsive layout
- [x] Modular TypeScript architecture
- [x] Seed data — 40 apps across 5 zones
- [x] Bottom dock with badge counts

---

## Phase 2 — COMPLETE ✓
- [x] Weather widget (Open-Meteo, free, no key, 15-min cache)
- [x] Calendar widget (iCal feed + mock events, LIVE indicator)
- [x] Drag-to-reorder tiles within zones (edit mode toggle)
- [x] Multiple notes — full list + CRUD modal
- [x] Zone color customization (color picker per zone)
- [x] PWA manifest (fullscreen, shortcuts, icon spec)
- [x] Service worker (offline cache, stale-while-revalidate, push stub)
- [x] Next.js App Router scaffold
- [x] API routes — notes, tasks, apps, settings, zones, recent, export
- [x] Prisma ORM + SQLite schema + seed script
- [x] Repository layer (typed, API routes never touch Prisma directly)
- [x] TanStack Query hooks (useNotes, useTasks, useApps, useSettings, useRecent)
- [x] Export/backup — GET /api/export → full JSON download
- [x] Settings tabs — Display / Calendar / Zones / Profile
- [x] Calendar feed input (iCal URL in Settings)
- [x] Kiosk route (/kiosk — fullscreen API, context menu off)
- [x] tsconfig + next.config + .env template

---

## Phase 3 — COMPLETE ✓
- [x] **PIN lock** — 4-digit, SHA-256 hashed, 8hr session, numpad UI, shake animation
- [x] **Custom wallpaper** — upload file or URL, opacity + blur controls, clear option
- [x] **Media player widget** — Spotify + SoundCloud embeds, quick-launch music links
- [x] **AI quick-capture** — Claude API classifies text → auto-routes to note or task
- [x] **Announcements/alerts** — manual banners with info/warning/critical levels, dismiss
- [x] **Import/restore** — upload backup JSON, validates before writing, warns before overwrite
- [x] **Bookmarks import** — Chrome/Firefox HTML bookmark file parser (service + UI)
- [x] **Zone add/remove** — full zone CRUD from Settings → Zones tab
- [x] **Widget grid reorder** — drag-and-drop widget cards, persisted order
- [x] **Second Chance embed** — quick-launch + expandable iframe widget
- [x] **Smart home stub** — 4 demo device cards with toggle, Home Assistant ready
- [x] **Performance mode** — disables all animations, transitions, shadows, glow
- [x] **PWA icon generator** — canvas-based, emoji → 192px + 512px PNG download
- [x] **Push notifications** — Notifications API wired, SW handler active, VAPID stub
- [x] **Postgres schema** — full upgrade schema with Sessions, Announcements, TaskReminders
- [x] **Multi-device sync schema** — User sessions, indexes, Postgres-ready migration path
- [x] **RSS feed integration** — URL input in Settings → Integrations, cached parser
- [x] **Settings tabs** — Display / Wallpaper / Security / Zones / Integrations / Data

---

## Phase 4 — Next

### Auth & Sync
- [ ] Server-side PIN/auth (bcrypt, HTTP-only cookie session)
- [ ] VAPID push notifications — server-sent task + calendar reminders
- [ ] Postgres live sync — real multi-device, conflict-free updates
- [ ] Google OAuth — calendar, drive integration without iCal workaround

### Media & Content
- [ ] Spotify OAuth — now playing widget, playback controls
- [ ] YouTube embed + search widget
- [ ] Podcast feed widget (RSS audio player)
- [ ] AI art prompt generator — feeds into Canva / Picsart workflow

### Platform
- [ ] Mobile app wrapper — Capacitor.js → Android APK (replaces AIDE approach)
- [ ] Home Assistant WebSocket integration — real smart home control
- [ ] Announcement push from server — admin panel for self-sent alerts
- [ ] Second Chance API — live county resource data, search, filter by county

### Dashboard UX
- [ ] Resizable widgets — 1, 2, or 3 column spans
- [ ] Multiple dashboard pages — swipe between pages, page manager
- [ ] Widget library — add/remove widgets from a catalog
- [ ] Dark/light/custom theme switcher
- [ ] Font selector (monospace → sans → serif)
