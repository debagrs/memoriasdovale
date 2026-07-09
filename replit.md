# Vale Vêneto: Memória e Música

Plataforma interativa de cartografia afetiva, memórias do Festival de Música e curadoria da história oral de Vale Vêneto, RS.

## Stack

- **Frontend**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (Framer Motion)
- **Backend/DB**: Supabase (PostgreSQL + Storage)
- **Deploy target**: Vercel

## Running locally / on Replit

```bash
npm install
npm run dev       # dev server on :5173
npm run build     # production build → dist/
npm run lint      # TypeScript type-check
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (e.g. https://xyz.supabase.co) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

Both are **required** for Supabase to work. Without them the app falls back to the in-memory seed data from `src/data.ts`.

## Database

Single table: `public.memories`. Run `schema.sql` in the Supabase SQL Editor to create the table, RLS policies, storage bucket, and seed data.

## Vercel deployment

1. Connect the GitHub repo to a Vercel project.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel → Settings → Environment Variables.
5. The `vercel.json` in the root handles SPA routing (all paths → `index.html`).

## Project structure

```
src/
  lib/
    supabaseClient.ts   # Supabase client + DB↔UI mappers
  components/
    IntroPortal.tsx        # Hero slideshow + soundscape portal
    AcousticCartography.tsx # Interactive mental map
    FestivalMemories.tsx   # Music festival history + stories
    SubmissionForm.tsx     # Community memory submission form
    CuratorPanel.tsx       # Curator review/approve/reject panel
  App.tsx               # Root layout, routing, Supabase data sync
  data.ts               # Static seed/fallback data
  types.ts              # TypeScript interfaces
schema.sql              # Canonical Supabase schema (run once)
vercel.json             # SPA rewrite rule
```

## User preferences

- Do NOT use GitHub Pages or Express/server.ts
- Do NOT use service_role key in the frontend
- Deploy target is Vercel only
- Keep existing visual identity
- No new features — stability and maintainability first
