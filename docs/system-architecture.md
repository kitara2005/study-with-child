# System Architecture

## Overview

**Học cùng con** uses a **server-first, edge-optimized** architecture:

- **Frontend:** Next.js 16 App Router (Server Components by default)
- **Backend:** Next.js Route Handlers + Supabase serverless functions
- **Database:** Supabase PostgreSQL with Prisma ORM
- **Auth:** Supabase Auth (JWT + session cookies via @supabase/ssr)
- **Hosting:** Vercel (edge functions, automatic scaling)

```
┌─────────────────────────────────────────────────┐
│          Vercel Edge Network                     │
│  (Next.js Server Components + ISR Cache)         │
└──────────────────┬──────────────────────────────┘
                   │
          ┌────────┴────────┐
          │                 │
    ┌─────▼──────┐   ┌─────▼──────────┐
    │ Next.js    │   │ Supabase Auth  │
    │ Route      │   │ (JWT + RLS)    │
    │ Handlers   │   └────────────────┘
    └─────┬──────┘
          │
          │ Prisma ORM (connection pooling)
          │
    ┌─────▼──────────────────┐
    │ Supabase PostgreSQL    │
    │ - Users (linked to JWT)│
    │ - Subjects, Chapters   │
    │ - Lessons, Exercises   │
    │ - Results (RLS)        │
    └────────────────────────┘
```

## Why This Stack?

| Component       | Pros                                     | Cons                 | Alternative           |
| --------------- | ---------------------------------------- | -------------------- | --------------------- |
| **Next.js 16**  | RSC, SSG/ISR, zero-JS, built-in routing  | Learning curve       | Remix, SvelteKit      |
| **Supabase**    | Postgres + Auth built-in, free tier ($0) | Cold starts (~500ms) | Firebase, PlanetScale |
| **Prisma**      | Type-safe ORM, migrations, seed scripts  | Runtime overhead     | Raw SQL, Drizzle      |
| **Tailwind v4** | JIT, small bundle, shadcn/ui compatible  | Not CSS-in-JS        | Styled-components     |
| **Vercel**      | Zero-config Next.js deploy, edge caching | Vendor lock-in       | AWS Lambda, Railway   |

**Trade-off:** Startup time (~2-3s cold) acceptable for educational platform, not real-time app.

## Database Design

### 6 MVP Models (Prisma Schema)

**Relationships:**

```
User
  ├─ parent: User (optional, self-join for Parent-Child)
  └─ results: Result[]

Subject
  └─ chapters: Chapter[]

Chapter
  ├─ subject: Subject
  └─ lessons: Lesson[]

Lesson
  ├─ chapter: Chapter
  ├─ exercises: Exercise[]
  └─ results: Result[]

Exercise
  └─ lesson: Lesson

Result
  ├─ user: User
  └─ lesson: Lesson
```

### Key Decisions

1. **JSON columns for exercise options & answers**
   - `Exercise.options`: `[{ label: "A) ...", value: "a" }]`
   - `Result.answers`: `[{ exerciseId: "uuid", answer: "a", correct: true }]`
   - Avoids N+1 queries, flat structure

2. **Slug-based URLs instead of IDs**
   - `/mon/toan/chuong-1/bai-tim-so-thieu` (Vietnamese, SEO-friendly)
   - Composed unique constraints: `@@unique([subjectId, slug])`, `@@unique([chapterId, slug])`

3. **Result storage model**
   - Records score (0-100%), stars (0-3), user answers
   - Enables progress tracking, remedial content (post-MVP)
   - Time tracking (`timeSpent` seconds) for learning analytics

4. **Soft deletes vs hard deletes**
   - MVP uses hard deletes (`onDelete: Cascade`)
   - Post-MVP: Add `deletedAt` timestamp for audit trail

### Indexes (Performance)

```sql
-- Auto-indexed by Prisma @id, @unique
-- Manual indexes for common queries:
Chapter.subjectId        -- Filter chapters by subject
Lesson.chapterId         -- Filter lessons by chapter
Exercise.lessonId        -- Filter exercises by lesson
Result.userId            -- Student progress dashboard
Result.userId + lessonId -- Check if lesson completed
```

## Content Model

### LessonContent JSON Structure

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

**Example (Math, Lesson 1):**

```json
{
  "sections": [
    { "type": "heading", "content": "Phép cộng các số có 4 chữ số" },
    { "type": "paragraph", "content": "Để cộng các số có 4 chữ số..." },
    {
      "type": "visual",
      "visualType": "diagram",
      "data": { "url": "/images/addition-diagram.png" }
    },
    { "type": "example", "question": "1234 + 5678 = ?", "solution": "6912" }
  ],
  "keyPoints": [
    "Cộng từ phải sang trái (hàng đơn vị → hàng chục → ...)",
    "Nếu tổng ≥ 10, nhớ sang hàng kế tiếp",
    "Kiểm tra lại: ước lượng kết quả"
  ]
}
```

**Why JSON?** Flexible schema for different lesson types (math, reading, science) without schema migrations.

## API Design Patterns

### 1. Server Components (Default)

```typescript
// app/mon/[subject]/chuong-[chapter]/bai-[slug]/page.tsx
export default async function LessonPage({ params }) {
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug, chapter: { slug: params.chapter } },
    include: { exercises: true }
  });
  // Data fetched server-side, no JS to client
  return <LessonView lesson={lesson} />;
}
```

**Pros:** Zero JS, fast, SEO-friendly. **Cons:** No interactivity (use Client Components for forms).

### 2. Route Handlers (API Endpoints)

```typescript
// app/api/results/route.ts - POST exercise submission
export async function POST(request: Request) {
  const session = await getSession(); // Supabase Auth
  const { lessonId, answers } = await request.json();

  // Validate answers, calculate score
  const result = await prisma.result.create({
    data: { userId: session.user.id, lessonId, score, answers },
  });
  return Response.json(result);
}
```

**RLS (Row-Level Security):** Supabase enforces `user_id = auth.uid()` at DB level.

### 3. Incremental Static Regeneration (ISR)

```typescript
// Lesson pages (slow-changing content)
export const revalidate = 3600; // Revalidate every hour
export default async function LessonPage({ params }) { ... }

// Not ISR:
// - User dashboard (auth-required, real-time)
// - Exercise results (user-specific)
```

## Auth Flow

**1. Signup (Email or Google OAuth)**

```
Client → Supabase.auth.signUp() → Confirm email → JWT token → Store in httpOnly cookie
```

**2. Session Management**

```typescript
// lib/supabase/server.ts
import { createServerClient, CookieOptions } from '@supabase/ssr';

export function createClient(cookieStore: CookieStore) {
  return new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll: () => cookieStore.getAll(), ... } }
  );
}
```

**3. RLS Policy (Supabase)**

```sql
-- Only users can see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Only users can see their results
CREATE POLICY "Users can view own results" ON results
  FOR SELECT USING (auth.uid() = user_id);
```

## Performance Strategy

| Layer             | Strategy                           | Tools                     |
| ----------------- | ---------------------------------- | ------------------------- |
| **Edge Caching**  | Cache lesson pages in Vercel CDN   | ISR revalidate=3600       |
| **Database**      | Connection pooling, n+1 prevention | Prisma $queryRaw, include |
| **Images**        | Next.js Image optimization         | `<Image>` component, WebP |
| **JS Bundle**     | Server Components (zero JS)        | App Router default        |
| **Observability** | Vercel Analytics, Supabase logs    | Built-in                  |

**Benchmarks (Target):**

- Lesson page load: <1s (cached), <2s (cold)
- Exercise submission: <500ms
- Auth flow: <2s

## Scalability Limits & Roadmap

### Current (MVP)

- **Supabase Free:** 500MB storage, 100k MAU
- **Vercel Free:** 100GB/mo bandwidth
- **Estimated capacity:** 10k students, 500 lessons

### Phase 9+ (Post-MVP)

- **Upgrade Supabase Pro ($25/mo):** 8GB storage, unlimited MAU
- **Add CDN (Cloudflare):** Global edge caching
- **Database optimization:**
  - Read replicas for reporting queries
  - Partitioning by `created_at` for results table (growth)
  - Archive old sessions → cold storage

### AI Tutor Integration (Phase 9)

- Claude API ($0.015/1k tokens, ~$0.001 per lesson)
- Rate limit: 1 lesson/min per student (avoid abuse)
- Cache responses: "Explain multiplication" (same for all students)
- Safety: Filter responses for age-appropriate content, no external links

### Payment Integration (Phase 10)

- MoMo/ZaloPay API for Vietnam market
- Gate: Advanced content (workbooks, answer keys), 1:1 tutor, ad-free
- Keep free tier: All lessons + basic exercises (current MVP)
- Webhook for payment status → User.subscriptionTier

## Security Model

| Layer                | Implementation                                      |
| -------------------- | --------------------------------------------------- |
| **Auth**             | Supabase JWT (exp: 3600s) + refresh token (exp: 7d) |
| **Data Access**      | RLS policies at DB level (no trust client)          |
| **Secrets**          | Env vars (SUPABASE_SERVICE_ROLE_KEY server-only)    |
| **HTTPS**            | Automatic (Vercel + Supabase)                       |
| **CORS**             | Supabase auto-allows same origin                    |
| **Input Validation** | Zod schema on Route Handlers                        |

**Anti-patterns to avoid:**

- ❌ Storing JWT in localStorage (XSS vulnerability)
- ❌ Trusting client `userId` parameter (RLS prevents, but validate anyway)
- ❌ Logging passwords or tokens

## Deployment

**Vercel Setup:**

1. Connect GitHub repo
2. Set env vars (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
3. Auto-deploy on push to main
4. Preview deploys for PRs

**Database Migrations:**

```bash
# Dev: local .env.local
pnpm dlx prisma migrate dev --name add_feature

# Prod: Vercel env vars
pnpm dlx prisma db push
```

## Monitoring & Debugging

- **Vercel Analytics:** Page load time, CLS, throughput
- **Supabase Dashboard:** Query performance, logs, storage usage
- **Browser DevTools:** Network waterfall, React DevTools
- **Error Tracking:** (Post-MVP) Sentry integration
