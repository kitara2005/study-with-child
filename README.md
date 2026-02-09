# Học cùng con - Lớp 4

Nền tảng học tập trực tuyến cho học sinh lớp 4 theo chương trình **Chân Trời Sáng Tạo**.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase PostgreSQL + Prisma ORM
- **Auth:** Supabase Auth
- **Deploy:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+

### Setup

```bash
# Clone and install
git clone <repo-url>
cd hoc-cung-con
pnpm install

# Configure environment
cp .env.example .env.local
# Fill in Supabase credentials in .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start development server (Turbopack) |
| `pnpm build`        | Production build                     |
| `pnpm start`        | Start production server              |
| `pnpm lint`         | Run ESLint                           |
| `pnpm format`       | Format code with Prettier            |
| `pnpm format:check` | Check formatting                     |

## Project Structure

```
app/                  # Next.js App Router pages
  api/health/         # Health check endpoint
components/
  layout/             # Header, Footer, Navigation
  ui/                 # shadcn/ui components
lib/
  supabase/           # Supabase client/server utilities
  utils.ts            # Shared utilities
prisma/
  schema.prisma       # Database schema
```

## Environment Variables

See `.env.example` for required variables. You need a [Supabase](https://supabase.com/) project.
