# Architecture — DM Command Center

## Stack
- React (artifact/PWA deployment)
- TypeScript (module files)
- localStorage persistence (single-user MVP)
- No external state library — custom `useStore()` hook
- Design tokens: pure JS object (tokens.ts)

## Data Flow

```
DB (localStorage)
  ↓ boot
useStore() hook
  ↓ props
Components
  ↓ user actions
Store actions → DB.save() → setState()
  ↓
Re-render
```

## Persistence
All data is namespaced under `dm_cc_` in localStorage:
- `dm_cc_zones` — Zone[]
- `dm_cc_apps` — AppLink[]
- `dm_cc_notes` — Note[]
- `dm_cc_tasks` — Task[]
- `dm_cc_recent` — RecentItem[] (max 12)
- `dm_cc_settings` — Settings

Seed data is loaded on first run (no key found). All subsequent loads use persisted data.

## Domain Models
- **Zone** — a labeled category with accent color, glyph, order
- **AppLink** — a URL shortcut belonging to a zone; can be pinned
- **Note** — freeform text with title/content/timestamps
- **Task** — titled to-do with priority and completion state
- **RecentItem** — lightweight record of an opened AppLink
- **Settings** — display preferences and profile fields

## Extension Points

### Adding a Widget
1. Create component in `components/widgets/`
2. Add any new data model to `types/index.ts`
3. Add persistence to `lib/db/index.ts`
4. Add actions to `store/index.ts`
5. Mount in dashboard layout

### Adding a Zone
Add entry to `SEED_ZONES` in `lib/constants/seed.ts`. Zone colors auto-derive from the zones map in `tokens.ts`.

### Adding Auth (Phase 2)
Wrap the app in an auth provider. Replace the single-user `DB` with a user-scoped backend. Store actions become async and call API routes instead of localStorage directly. The action signatures don't change — only the persistence layer swaps.

### API Routes (Phase 2 — Next.js)
```
POST   /api/notes          create
PATCH  /api/notes/:id      update
DELETE /api/notes/:id      delete
POST   /api/tasks          create
PATCH  /api/tasks/:id      toggle/update
POST   /api/apps           add
DELETE /api/apps/:id       remove
GET    /api/settings       load
PATCH  /api/settings       save
```
