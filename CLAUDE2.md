# CLAUDE.md — DM Command Center v3.0

## Mission
Personal kiosk launcher and productivity dashboard for Devyn Mack (Broward, FL).
Tactical command-center UX. Zone-based app launcher, notes, tasks, AI capture, media,
smart home stubs, PIN security, custom wallpaper. Deploys as React PWA or Next.js app.

## Mental Model

```
src/
  types/             — all domain interfaces
  lib/
    constants/       — seed.ts (data), tokens.ts (design system)
    db/              — localStorage persistence (namespaced, typed)
    validators/      — input validation
    services/
      weather.ts     — Open-Meteo fetch + 15-min cache
      calendar.ts    — iCal parser + mock events
      auth.ts        — SHA-256 PIN, 8hr session
      wallpaper.ts   — upload/URL wallpaper config
      announcements.ts — manual alerts + RSS feed
      bookmarks.ts   — Chrome/Firefox HTML bookmark parser
      importRestore.ts — backup JSON export + restore
      iconGenerator.ts — canvas PWA icon generator (192 + 512)
      pushNotifications.ts — Notifications API + VAPID stub
  store/             — useStore() hook, single source of truth, all actions
  components/
    layout/          — Primitives, Header
    navigation/      — ZoneNav
    launcher/        — AppTile, ZonePanel (drag-to-reorder)
    widgets/         — Weather, Calendar, Pinned, Recent, Notes, Tasks,
                       Media, SecondChance, SmartHome, AICapture
    notes/           — NotesModal
    tasks/           — TasksModal
    settings/        — SettingsModal (6 tabs)
    kiosk/           — Screensaver, PINScreen
prisma/
  schema.prisma          — SQLite dev schema
  schema.postgres.prisma — Postgres prod schema (sessions, announcements, reminders)
  seed.ts                — full data seed
app/
  (dashboard)/       — main page + kiosk route
  api/               — REST endpoints for all domain models
lib/
  db/prisma.ts       — singleton client
  repositories/      — typed data access layer
  hooks/             — TanStack Query hooks
```

## Execution Rules
1. All visual constants → `tokens.ts`. Never hardcode colors in components.
2. All seed data → `lib/constants/seed.ts`. Never inline mock data in components.
3. All persistence → `lib/db/index.ts`. Never call localStorage directly from components.
4. All state → `store/index.ts`. Components receive props or call store actions.
5. Components are presentation-only. Logic belongs in store or lib.
6. Keep components under 150 lines. Split if larger.
7. New feature = new type in `types/index.ts` first.
8. Performance mode = no animations, transitions, shadows, or glow anywhere.
9. PIN screen gates the entire app. Auth check runs before any render.
10. AI quick-capture falls back to heuristic classify if Claude API is unavailable.
