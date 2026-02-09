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
```

### Supabase Configuration

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection string** (URI)
3. Copy `.env.example` to `.env.local` and fill in credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

4. Push schema and seed data:

```bash
pnpm dlx prisma db push
pnpm dlx prisma db seed
```

### Run

```bash
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
  prisma.ts           # Prisma client singleton
  supabase/           # Supabase client/server utilities
  utils.ts            # Shared utilities
prisma/
  schema.prisma       # Database schema (6 models)
  seed.ts             # Seed data (8 subjects, sample content)
types/
  content.ts          # TypeScript types for lesson JSON
```
