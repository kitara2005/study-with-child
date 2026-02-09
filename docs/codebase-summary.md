# Codebase Summary

## Quick Overview

**Học cùng con** is a Next.js-based Vietnamese educational platform for Grade 4 students. The codebase is organized around Next.js App Router with a clean separation between API routes, Server Components, and client-side interactivity.

**Current Status:** MVP Phase 2 complete (project setup + database schema). Phase 3 (authentication) in progress.

**Codebase Metrics:**

- **Total Files:** 32 (source + config)
- **Main Source:** TypeScript/TSX (app/, components/, lib/, prisma/, types/)
- **Dependencies:** Next.js 16, Supabase, Prisma, Tailwind, shadcn/ui
- **Size:** ~21k tokens (~73k chars) excluding node_modules and docs

---

## Directory Structure

```
hoc-cung-con/
├── app/                              # Next.js App Router
│   ├── api/
│   │   └── health/route.ts          # Health check endpoint
│   ├── globals.css                  # Tailwind + global styles
│   ├── layout.tsx                   # Root layout (Header, Footer)
│   └── page.tsx                     # Homepage (8 subjects grid)
│
├── components/                       # React components
│   ├── layout/
│   │   ├── header.tsx              # Navigation header
│   │   ├── footer.tsx              # Footer with links
│   │   └── mobile-navigation.tsx    # Mobile menu
│   └── ui/                          # shadcn/ui primitives
│       ├── button.tsx
│       └── card.tsx
│
├── lib/                              # Utilities & clients
│   ├── prisma.ts                    # Prisma client singleton
│   ├── utils.ts                     # Shared helpers (cn, formatting)
│   └── supabase/
│       ├── client.ts                # Browser Supabase client
│       └── server.ts                # Server Supabase client (@supabase/ssr)
│
├── prisma/
│   ├── schema.prisma                # Database schema (6 models)
│   └── seed.ts                      # Seed script (8 subjects)
│
├── types/
│   └── content.ts                   # LessonContent JSON type
│
├── .env.example                      # Environment template
├── package.json                      # Dependencies + scripts
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
├── prisma.config.ts                 # Prisma config (for seed)
├── eslint.config.mjs                # ESLint rules
├── .prettierrc                       # Prettier formatting
└── hoc-cung-con-plan.md            # Detailed MVP plan

.claude/                              # Claude Code framework
├── rules/                           # Workflows & guidelines
│   ├── primary-workflow.md
│   ├── development-rules.md
│   ├── orchestration-protocol.md
│   └── documentation-management.md
└── .env.example                     # Global env vars for skills

docs/                                # Technical documentation
├── project-overview-pdr.md          # Product requirements
├── system-architecture.md           # Tech stack & design decisions
├── code-standards.md                # Coding conventions
├── development-roadmap.md           # MVP + post-MVP phases
└── codebase-summary.md              # This file
```

---

## Key Files & Responsibilities

### Frontend (App Router)

**`app/layout.tsx` (Root Layout)**

- Renders Header, Footer, and children
- Sets metadata (title, description)
- Imports global CSS + Geist font

**`app/page.tsx` (Homepage)**

- Shows 8 subject cards (grid layout)
- Uses shadcn/ui Card component
- Static data (hardcoded subjects array)
- No database queries yet (Phase 4+)

**`components/layout/header.tsx`**

- Navigation bar with logo
- Links to subjects (placeholder)
- Mobile hamburger menu

**`components/layout/footer.tsx`**

- Links to about, contact, terms
- Copyright notice

### Backend

**`lib/prisma.ts` (Singleton)**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

- **Why:** Avoids multiple Prisma instances in dev hot reload
- **Usage:** `import { prisma } from '@/lib/prisma'`

**`lib/supabase/client.ts` (Browser Client)**

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- **Usage:** Client Components only (e.g., login form, exercise submission)

**`lib/supabase/server.ts` (Server Client)**

```typescript
import { createServerClient, CookieOptions } from '@supabase/ssr';

export function createClient(cookieStore: CookieStore) {
  return new SupabaseClient(...);
}
```

- **Usage:** Server Components, Route Handlers, middleware
- **Auth:** Reads JWT from httpOnly cookies

**`app/api/health/route.ts` (Health Check)**

- Simple endpoint for monitoring
- Returns `{ status: 'ok' }`
- Used by Vercel health checks

### Database

**`prisma/schema.prisma` (Schema)**

- 6 models: User, Subject, Chapter, Lesson, Exercise, Result
- RLS policies (Supabase) defined separately
- Indexes on foreign keys for query performance

**`prisma/seed.ts` (Seed Script)**

- Creates 8 subjects (Toán, Tiếng Việt, etc.)
- Sample chapters & lessons (placeholder)
- Run with: `pnpm dlx prisma db seed`

### Types

**`types/content.ts` (Lesson Content Structure)**

```typescript
type LessonContent = {
  sections: LessonSection[];
  keyPoints: string[];
};

type LessonSection =
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'visual'; visualType: string; data: Record<string, unknown> }
  | { type: 'example'; question: string; solution: string };
```

- Stored as JSON in `Lesson.theoryContent` column
- Allows flexible lesson structures

---

## Data Model (Prisma Schema)

### 6 MVP Models

**User** (linked to Supabase Auth)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  fullName  String
  avatarUrl String?
  role      UserRole @default(STUDENT)    // STUDENT | PARENT | ADMIN
  parentId  String?  (optional, self-join for parent-child)
  grade     Int      @default(4)
  createdAt DateTime @default(now())

  parent   User?
  children User[]
  results  Result[]
}
```

**Subject**

```prisma
model Subject {
  id         String @id @default(uuid())
  name       String @unique               // "Toán", "Tiếng Việt"
  slug       String @unique               // "toan", "tieng-viet" (Vietnamese)
  icon       String                       // lucide icon name
  color      String                       // tailwind class
  orderIndex Int

  chapters Chapter[]
}
```

**Chapter**

```prisma
model Chapter {
  id         String @id
  subjectId  String
  name       String                       // "Chương 1: Cộng các số..."
  slug       String
  semester   Int    @default(1)           // 1 or 2
  orderIndex Int

  subject Subject
  lessons Lesson[]

  @@unique([subjectId, slug])             // Composite key for slug
}
```

**Lesson**

```prisma
model Lesson {
  id            String @id
  chapterId     String
  title         String                    // "Phép cộng các số có 4 chữ số"
  slug          String
  theoryContent Json                      // LessonContent JSON
  orderIndex    Int
  createdAt     DateTime
  updatedAt     DateTime

  chapter   Chapter
  exercises Exercise[]
  results   Result[]

  @@unique([chapterId, slug])
}
```

**Exercise**

```prisma
model Exercise {
  id            String @id
  lessonId      String
  type          ExerciseType              // MULTIPLE_CHOICE | FILL_BLANK | etc.
  question      String
  options       Json?                     // [{ label: "A) ...", value: "a" }]
  correctAnswer String
  explanation   String?
  orderIndex    Int

  lesson Lesson
}

enum ExerciseType {
  MULTIPLE_CHOICE
  FILL_BLANK
  DRAG_DROP
  TRUE_FALSE
}
```

**Result**

```prisma
model Result {
  id          String @id
  userId      String
  lessonId    String
  score       Int                         // 0-100 percentage
  stars       Int    @default(0)          // 0-3 based on score
  answers     Json                        // [{ exerciseId, answer, correct }]
  timeSpent   Int?                        // seconds
  completedAt DateTime @default(now())

  user   User
  lesson Lesson

  @@index([userId, lessonId])             // For progress dashboard
  @@index([userId])
}
```

### Design Rationale

| Decision                  | Reason                                            |
| ------------------------- | ------------------------------------------------- |
| **UUID primary keys**     | Distributed systems, privacy (not sequential IDs) |
| **JSON columns**          | Flexible schema for lesson content & answers      |
| **Composite slug keys**   | Allow same slug in different chapters             |
| **Enum for ExerciseType** | Type safety, prevents invalid types               |
| **Indexes on userId**     | Fast queries for student dashboards               |

---

## Authentication Flow (Phase 3)

**Not yet implemented, but planned:**

1. **Signup:** Email or Google OAuth → Supabase Auth → JWT token → httpOnly cookie
2. **Session:** Server reads JWT from cookie via `@supabase/ssr`
3. **RLS:** Supabase enforces row-level security (e.g., can only see own results)

---

## Key Technologies & Why

| Tech           | Version | Why                                       |
| -------------- | ------- | ----------------------------------------- |
| **Next.js**    | 16      | App Router, RSC, SSG/ISR, zero-JS default |
| **TypeScript** | 5.9     | Type safety, IDE support                  |
| **Supabase**   | 2.92    | PostgreSQL + Auth + RLS, free tier        |
| **Prisma**     | 7.3     | Type-safe ORM, migrations, introspection  |
| **Tailwind**   | v4      | JIT, small bundle, shadcn/ui compatible   |
| **shadcn/ui**  | Latest  | Accessible, copy-paste components         |

---

## Development Setup

### Prerequisites

```bash
Node.js 20+
pnpm 9+
```

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Fill in Supabase credentials

# Push schema to database
pnpm dlx prisma db push

# Seed sample data
pnpm dlx prisma db seed

# Start dev server
pnpm dev
```

### Environment Variables

| Variable                        | Purpose                                 | Required |
| ------------------------------- | --------------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                    | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key for browser client           | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Private key for server (Route Handlers) | Yes      |
| `DATABASE_URL`                  | Prisma connection string (pooled)       | Yes      |
| `DIRECT_URL`                    | Direct DB connection (migrations)       | Yes      |

---

## Common Tasks

### Add a New Page

```typescript
// app/subjects/page.tsx
import { prisma } from '@/lib/prisma';

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { orderIndex: 'asc' }
  });
  return <SubjectList subjects={subjects} />;
}
```

### Create a Client Component

```typescript
// components/forms/exercise-form.tsx
'use client';
import { useState } from 'react';

export function ExerciseForm({ lessonId }) {
  const [score, setScore] = useState<number | null>(null);

  async function handleSubmit() {
    const res = await fetch('/api/results', {
      method: 'POST',
      body: JSON.stringify({ lessonId, answers })
    });
    const result = await res.json();
    setScore(result.score);
  }

  return <div>...</div>;
}
```

### Add a Route Handler (API Endpoint)

```typescript
// app/api/results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { lessonId, answers } = await request.json();

  const result = await prisma.result.create({
    data: { userId: 'xxx', lessonId, answers, score: 100 },
  });

  return NextResponse.json(result, { status: 201 });
}
```

### Update Database Schema

```bash
# Edit prisma/schema.prisma
# Then:
pnpm dlx prisma migrate dev --name add_new_field
```

---

## Current Limitations & Next Steps

### Implemented ✅

- Next.js + TypeScript setup
- Prisma + Supabase PostgreSQL configured
- 6 database models (User, Subject, Chapter, Lesson, Exercise, Result)
- Homepage with subject grid
- ESLint + Prettier + Husky hooks

### In Progress 🔄

- **Phase 3:** Supabase Auth (email + Google OAuth)
- User profile creation
- Auth middleware/protected routes

### TODO ⏳

- **Phase 4:** Content pages (Vietnamese slugs), lesson display
- **Phase 5:** Exercise system, result tracking
- **Phase 6:** Admin panel (CRUD)
- **Phase 7:** Content pipeline (crawl + AI rewrite, 20 lessons)
- **Phase 8:** Testing, deployment to Vercel

---

## Performance Considerations

### Current Optimizations

- **Server Components:** Zero JS by default
- **Image optimization:** Next.js Image component (configured for future use)
- **Prisma queries:** Connection pooling via Supabase
- **Tailwind:** v4 JIT CSS (only used classes)

### Future Optimizations

- **ISR:** Cache lesson pages (revalidate every hour)
- **Database indexes:** Added on foreign keys + userId
- **CDN caching:** Vercel edge network
- **Compression:** Automatic via Vercel

---

## Security Notes

### Current Setup

- **Environment variables:** Service role key server-only (not exposed to browser)
- **CORS:** Supabase auto-allows same origin
- **RLS:** Configured in Supabase (not yet enforced, Phase 3+)

### Important

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Always validate user input on Route Handlers
- Check authentication before modifying user data

---

## Monitoring & Debugging

### Local Development

```bash
pnpm dev              # Start with Turbopack (fast)
pnpm lint             # Check code
pnpm format:check     # Check formatting
```

### Database Inspection

```bash
pnpm dlx prisma studio  # Open Prisma Studio (http://localhost:5555)
```

### Vercel Deployment

- Automatic on push to main branch
- Preview deployments for PRs
- View logs: Vercel Dashboard → Project → Deployments

---

## Useful Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma ORM:** https://www.prisma.io/docs
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## Contributing Guidelines

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow code standards in `docs/code-standards.md`
3. Commit with conventional format: `feat: add lesson navigation`
4. Run `pnpm lint && pnpm test` before pushing
5. Open PR with description and testing steps

---

## Contact & Support

- **Repository:** [GitHub repo link]
- **MVP Plan:** See `hoc-cung-con-plan.md` and `docs/development-roadmap.md`
- **Issues:** GitHub Issues for bugs/feature requests
