# The Unspoken Screen
### หน้าจอที่อยากให้ครอบครัวเห็น

A web platform that gives students a safe, anonymous space to share unspoken thoughts and feelings with their families. Built as a "letter, not a dashboard" — warm, empathetic, and human-first.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Backend | Hono 4 on Bun |
| Database | SQLite via Drizzle ORM (Turso-compatible) |
| Styling | TailwindCSS 4 + shadcn/ui |
| Monorepo | Turborepo + Bun workspaces |

**Fonts:** Sarabun (Thai/Latin), Lora (quotes), Patrick Hand

---

## Getting Started

**Prerequisites:** [Bun](https://bun.sh) 1.3.5+

```bash
bun install
```

**Database setup:**

```bash
bun run db:push
```

**Run dev:**

```bash
bun run dev
```

| URL | Service |
|---|---|
| http://localhost:3001 | Web app |
| http://localhost:3000 | API server |

---

## Environment Variables

**`apps/server/.env`**
```
DATABASE_URL=file:../../local.db
CORS_ORIGIN=http://localhost:3001
```

**`apps/web/.env`**
```
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start web + server in dev mode |
| `bun run dev:web` | Frontend only |
| `bun run dev:server` | Backend only |
| `bun run build` | Build all apps |
| `bun run check-types` | TypeScript type checking |
| `bun run db:push` | Push schema to database |
| `bun run db:migrate` | Run migrations |
| `bun run db:generate` | Generate Drizzle client |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:local` | Start local SQLite database |

---

## Project Structure

```
unspokenscreen/
├── apps/
│   ├── web/          # Next.js frontend
│   └── server/       # Hono API server
└── packages/
    ├── db/           # Drizzle schema & migrations
    ├── env/          # Type-safe environment validation (Zod)
    ├── ui/           # Shared shadcn/ui components
    └── config/       # Shared TypeScript/ESLint config
```

---

## Features

- **Anonymous Wall** — students post floating notes tagged by theme (ครอบครัว, ความเครียด, ความฝัน, ขอบคุณ)
- **Interactive notes** — heart reactions, family replies, avatar personalization
- **Dark / light mode**
- **Bilingual (Thai + English)** — Sarabun font for Thai-Latin readability
- **Warm design system** — parchment backgrounds, calm blue / burgundy / orange palette

See [`DESIGN.md`](./DESIGN.md) for the full design system documentation.

---

## UI Customization

Shared shadcn/ui primitives live in `packages/ui`.

- Design tokens and global styles: `packages/ui/src/styles/globals.css`
- Shared components: `packages/ui/src/components/`

**Add shared components:**
```bash
npx shadcn@latest add accordion dialog popover -c packages/ui
```

**Import:**
```tsx
import { Button } from "@unspokenscreen/ui/components/button";
```
