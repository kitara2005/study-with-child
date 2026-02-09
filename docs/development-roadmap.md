# Development Roadmap

## MVP Timeline (8 Phases, 4-5 weeks)

### Phase 1: Project Setup ✅

**Status:** COMPLETE | **Duration:** 1 week | **Owner:** Founding Engineer

- Next.js 16 + TypeScript scaffold
- Supabase project setup (PostgreSQL)
- ESLint + Prettier + Husky hooks
- Environment configuration (.env.example)
- GitHub repo, CI/CD pipeline
- **Deliverable:** `/package.json`, `ESLint/.prettierrc`, pre-commit hooks working

### Phase 2: Database Schema ✅

**Status:** COMPLETE | **Duration:** 1 week | **Owner:** DB Architect

- Prisma schema (6 models: User, Subject, Chapter, Lesson, Exercise, Result)
- RLS policies (Supabase)
- Seed data: 8 subjects (Toán, Tiếng Việt, etc.), sample content
- Database indexes for common queries
- Connection pooling config
- **Deliverable:** `/prisma/schema.prisma`, `/prisma/seed.ts`, Supabase RLS enabled

### Phase 3: Authentication ✅

**Status:** COMPLETE | **Duration:** 1 week | **Completed:** 2026-02-08

- Supabase Auth (email + Google OAuth)
- User profiles (email, fullName, avatarUrl, role, grade)
- Session management (@supabase/ssr client + server)
- Protected admin routes (role-based access)
- Signup/login UI (shadcn/ui forms with validation)
- **Deliverable:**
  - `/auth/signup` & `/auth/login` pages functional
  - `app/(auth)/layout.tsx` handles sessions
  - `app/admin/layout.tsx` validates ADMIN role
  - All routes tested with E2E tests

### Phase 4: Content Navigation ✅

**Status:** COMPLETE | **Duration:** 1 week | **Completed:** 2026-02-08

- Subject pages with chapter list
- Chapter pages with lessons list
- Lesson pages with theory content + exercises
- Vietnamese slug routing: `/mon/[subjectSlug]/[chapterSlug]/[lessonSlug]`
- ISR caching (1hr revalidate) on content pages
- **Deliverable:**
  - `app/mon/[subjectSlug]/page.tsx` (subject view)
  - `app/mon/[subjectSlug]/[chapterSlug]/page.tsx` (chapters)
  - `app/mon/[subjectSlug]/[chapterSlug]/[lessonSlug]/page.tsx` (lesson + exercises)
  - LessonView component renders JSON content
  - All links functional, caching optimized

### Phase 5: Exercise System ✅

**Status:** COMPLETE | **Duration:** 1 week | **Completed:** 2026-02-08

- 3 exercise types: MULTIPLE_CHOICE, FILL_BLANK, TRUE_FALSE
- ExerciseForm component with client-side state (React)
- Auto-grading logic with instant feedback
- Score: 0-100%, Stars: 0-3 (based on score thresholds)
- Result storage with answers JSON + metadata
- **Deliverable:**
  - `app/api/exercises/submit/route.ts` - POST exercise submission
  - ExerciseForm component with answer validation
  - Result display with score, stars, feedback
  - 120 exercises across 20 lessons
  - All E2E tested

### Phase 6: Admin Panel ✅

**Status:** COMPLETE | **Duration:** 1 week | **Completed:** 2026-02-08

- Admin auth protection (role-based access control)
- Dashboard: subjects, chapters, lessons, exercises CRUD
- Forms with Zod validation
- Input checking + error handling
- **Deliverable:**
  - `/admin` dashboard page
  - `/admin/subjects` - list + create form
  - `/admin/lessons` - list + create/edit forms
  - `/admin/exercises` - list + create/edit forms
  - `/admin/users` - users list view
  - All protected by ADMIN role check
  - API routes: POST/PUT/DELETE with validation

### Phase 7: Content Pipeline ✅

**Status:** COMPLETE | **Duration:** 1-2 weeks | **Completed:** 2026-02-08

- Reference content scraper (crawl textbook sites)
- Claude AI rewriting script (not verbatim copy)
- Content import tool (seed Lesson + Exercise records)
- Content structure in JSON files (8 subjects, 32 chapters, 20 lessons)
- Manual content creation + AI refinement
- Exercise sets (120 exercises across 3 types)
- **Deliverable:**
  - `/content/toan/` - Math lessons with exercises
  - `/content/tieng-viet/` - Vietnamese lessons with exercises
  - All 8 subjects seeded in database
  - ISR cached content pages

### Phase 8: Testing & Deployment ✅

**Status:** COMPLETE | **Duration:** 1 week | **Completed:** 2026-02-08

- Unit tests (Vitest) - 43 tests total
- E2E tests (Playwright) - critical user flows
- Security validation (RLS policies, auth flows)
- GitHub Actions CI pipeline
- Vercel deployment automation
- **Deliverable:**
  - `tests/unit/` - utility tests passing
  - `tests/e2e/` - auth + exercise flows validated
  - `.github/workflows/ci.yml` - auto-lint, test, build
  - Live at Vercel (auto-deploy on push to main)
  - ISR cache optimized, <1s page load

---

## Post-MVP Expansion (Phases 9+)

### Phase 9: AI Tutor Integration ($10-50/month)

**Timeline:** 2-3 weeks post-MVP
**Effort:** Medium | **Team:** 1 backend engineer, 1 prompt engineer

**What:** Per-lesson chat with Claude AI, instant homework help.

**How to Implement:**

1. **Claude API Setup**

   ```typescript
   // app/api/lessons/[id]/tutor/route.ts
   import Anthropic from '@anthropic-sdk/sdk';

   export async function POST(request: Request) {
     const { message, lessonId } = await request.json();
     const session = await getSession(); // Auth check

     // Load lesson context
     const lesson = await prisma.lesson.findUnique({
       where: { id: lessonId },
       include: { chapter: { include: { subject: true } } },
     });

     // System prompt with lesson context
     const response = await anthropic.messages.create({
       model: 'claude-3-5-sonnet-20241022',
       max_tokens: 500,
       system: `You are a helpful tutor for Grade 4 students learning "${lesson.subject.name}".
                Current lesson: "${lesson.title}". Be concise, encouraging, and age-appropriate.
                Do NOT provide complete answers; guide the student to discover answers themselves.`,
       messages: [{ role: 'user', content: message }],
     });

     // Log for moderation (optional)
     await prisma.tutorChat.create({
       data: {
         userId: session.user.id,
         lessonId,
         message,
         response: response.content[0].text,
       },
     });

     return Response.json({ message: response.content[0].text });
   }
   ```

2. **Cost Control**
   - Rate limit: 10 messages/student/lesson (avoid abuse)
   - Cache system prompts (Anthropic prompt caching, -50% cost)
   - Estimate: $0.001-0.01 per lesson request
   - **Budget:** 1000 students × 10 requests × $0.005 = $50/month

3. **Safety Filters**

   ```typescript
   // Prevent off-topic questions
   const bannedTopics = ['politics', 'violence', 'adult content'];
   if (bannedTopics.some((t) => message.toLowerCase().includes(t))) {
     return Response.json({ error: 'Topic not allowed' }, { status: 400 });
   }
   ```

4. **UI Component**

   ```typescript
   // components/TutorChat.tsx
   "use client";
   import { useState } from "react";

   export function TutorChat({ lessonId }: { lessonId: string }) {
     const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
     const [input, setInput] = useState("");

     async function handleSend() {
       const res = await fetch(`/api/lessons/${lessonId}/tutor`, {
         method: "POST",
         body: JSON.stringify({ message: input, lessonId })
       });
       const { message } = await res.json();
       setMessages([...messages, { role: "user", text: input }, { role: "assistant", text: message }]);
       setInput("");
     }

     return (
       <div className="space-y-4">
         {messages.map((m, i) => (
           <div key={i} className={m.role === "user" ? "text-right" : ""}>
             {m.text}
           </div>
         ))}
         <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." />
         <button onClick={handleSend}>Send</button>
       </div>
     );
   }
   ```

5. **Post-MVP Decisions**
   - Only for Tier 1 (premium) students? Or free for all?
   - Moderation dashboard for reviewing flagged conversations?
   - Multi-language tutor (just English in MVP)?

**Success Metrics:** >30% of students use tutor >5 times/week, <5% API errors.

---

### Phase 10: Payment & Freemium Model ($50-200/month)

**Timeline:** 3-4 weeks post-MVP
**Effort:** Medium | **Team:** 1 backend engineer, 1 payment specialist

**Freemium Model:**
| Feature | Free Tier | Premium Tier ($5-10/mo) |
|---------|-----------|------------------------|
| Basic lessons | ✓ | ✓ |
| Exercises (basic) | ✓ | ✓ |
| AI Tutor | ✗ | ✓ |
| Workbooks/PDFs | ✗ | ✓ |
| Progress dashboard | Basic (own only) | Advanced (parent view) |
| Ad-free | ✗ | ✓ |

**Integration Steps:**

1. **Add Stripe/MoMo/ZaloPay**

   ```typescript
   // pages/api/stripe/create-checkout.ts
   import Stripe from 'stripe';

   export async function POST(request: Request) {
     const { userId } = await request.json();
     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       customer_email: user.email,
       line_items: [
         {
           price_data: {
             currency: 'usd',
             product_data: { name: 'Premium Monthly' },
             unit_amount: 999, // $9.99
           },
           quantity: 1,
         },
       ],
       mode: 'subscription',
       success_url: `${process.env.NEXT_PUBLIC_URL}/subscription/success`,
       cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
     });

     return Response.json({ sessionId: session.id });
   }
   ```

2. **Stripe Webhooks (payment confirmation)**

   ```typescript
   // Webhook: customer.subscription.updated → User.subscriptionTier = "PREMIUM"
   ```

3. **Gate Premium Content**

   ```typescript
   // middleware.ts or component-level
   if (lesson.requiredTier === "PREMIUM" && user.subscriptionTier !== "PREMIUM") {
     return <UpgradePrompt />;
   }
   ```

4. **Pricing Page**
   - Display feature comparison table
   - Free tier highlighted as default
   - Premium tier with testimonials

**Revenue Estimate:** 100 premium users × $7/mo avg = $700/mo (covers server costs + AI tutor).

---

### Phase 11: Gamification System

**Timeline:** 2-3 weeks post-MVP
**Effort:** Medium | **Team:** 1 full-stack engineer

**Features:**

- **Badges:** First lesson, 10 lessons, all exercises >80%
- **Streaks:** Consecutive days learning (email reminder if missed)
- **XP/Levels:** 10 XP per exercise, unlock new lessons at level 5
- **Leaderboard:** Top 10 students (optional, privacy concern)

**Schema Extension:**

```prisma
model Achievement {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  type      String   // "FIRST_LESSON", "STREAK_7", etc.
  earnedAt  DateTime @default(now()) @map("earned_at")
  user      User     @relation(fields: [userId], references: [id])
  @@index([userId])
}

model Streak {
  userId        String   @map("user_id") @db.Uuid
  currentDays   Int      @default(0) @map("current_days")
  bestDays      Int      @default(0) @map("best_days")
  lastActivityDate DateTime @map("last_activity_date")
  user          User     @relation(fields: [userId], references: [id])
}
```

**Implementation:**

```typescript
// Hook: After result.create(), check for achievements
async function checkAchievements(userId: string, lessonId: string) {
  const results = await prisma.result.count({ where: { userId } });

  if (results === 1) {
    await prisma.achievement.create({
      data: { userId, type: 'FIRST_LESSON' },
    });
  }

  // Check streak: today's date in results?
  const today = new Date().toDateString();
  const todayResult = await prisma.result.findFirst({
    where: { userId, createdAt: { gte: new Date(today) } },
  });

  if (todayResult) {
    await prisma.streak.update({
      where: { userId },
      data: { currentDays: { increment: 1 } },
    });
  }
}
```

**UI Component:**

```typescript
// Badge display in profile
<div className="space-x-2">
  {achievements.map(a => <Badge key={a.id}>{a.type}</Badge>)}
</div>
```

---

### Phase 12: Progress Dashboards & Analytics

**Timeline:** 2 weeks post-MVP
**Effort:** Medium | **Team:** 1 data engineer, 1 frontend engineer

**Student Dashboard:**

- Lessons completed (count + %)
- Average score trend (line chart)
- Time spent per subject (pie chart)
- Badges earned
- Next recommended lesson

**Parent Dashboard:**

- Child's progress by subject
- Weekly summary (lessons, scores, time)
- Recommended actions (e.g., "Math needs more practice")
- Alerts (low scores, inactivity)

**Implementation:**

```typescript
// lib/analytics.ts
export async function getStudentProgress(userId: string) {
  const results = await prisma.result.findMany({
    where: { userId },
    include: {
      lesson: { include: { chapter: { include: { subject: true } } } },
    },
    orderBy: { completedAt: 'desc' },
  });

  const bySubject = groupBy(results, (r) => r.lesson.chapter.subject.id);
  const avgScore =
    results.reduce((sum, r) => sum + r.score, 0) / results.length;

  return {
    totalLessons: results.length,
    averageScore: avgScore,
    bySubject: Object.entries(bySubject).map(([subjectId, items]) => ({
      subject: items[0].lesson.chapter.subject.name,
      lessons: items.length,
      avgScore: items.reduce((sum, r) => sum + r.score, 0) / items.length,
    })),
  };
}
```

---

### Phase 13: Mobile App (PWA or React Native)

**Timeline:** 4-6 weeks post-MVP
**Effort:** High | **Team:** 1-2 mobile engineers

**Option A: Progressive Web App (Faster)**

- Add `manifest.json` (installable)
- Service Worker for offline mode
- Works on iOS/Android Chrome
- **Time:** 2 weeks

**Option B: React Native (Better UX)**

- Separate Expo project, share API
- Native iOS/Android apps
- Download from App Stores
- **Time:** 6+ weeks

**Recommendation:** Start with PWA (2 weeks, covers 80% of users), then React Native if needed.

---

### Phase 14+: Content Expansion

**Timeline:** Ongoing
**Effort:** Varies

**Roadmap:**

- Month 1: Math + Vietnamese (2 subjects, 20 lessons)
- Month 2: Add Science (10 lessons)
- Month 3: Add History/Geography (10 lessons)
- Month 4: Add Ethics, Music, Art, PE (40 lessons total)
- **2026+:** Other grades (Grade 3, Grade 5)

**Content Production Cost:** ~$100-200 per lesson (AI rewrite + QA), scales with team.

---

## Success Metrics by Phase

| Phase   | Metric                       | Target              |
| ------- | ---------------------------- | ------------------- |
| MVP (8) | Live MVP, 0 security issues  | 100%                |
| 9       | AI Tutor >30% engagement     | Yes                 |
| 10      | 10% students convert to paid | $700/mo revenue     |
| 11      | >50% students earn badge     | Engagement ↑        |
| 12      | Parent signup rate >50%      | Build trust         |
| 13      | PWA downloads >1k            | Retention ↑         |
| 14      | 8 subjects published         | Complete curriculum |

---

## Risk Mitigation

| Risk                   | Phase | Mitigation                     |
| ---------------------- | ----- | ------------------------------ |
| Content quality issues | 7     | Manual QA before publishing    |
| AI tutor costs spiral  | 9     | Implement rate limits, cache   |
| Payment failures       | 10    | Fallback to manual invoicing   |
| Data loss              | All   | Daily Supabase backups         |
| Scaling bottleneck     | 12+   | Database optimization, caching |

---

## Resource Planning

**MVP Team:** 1 founding engineer, 1 part-time content creator
**Post-MVP:** Add backend engineer (AI/payment), data engineer (analytics)

**Estimated Budget:**

- **Hosting:** $0-25/mo (MVP), $50-100/mo (production)
- **AI:** $0 (MVP), $20-50/mo (Phase 9)
- **Payment fees:** 2.9% + $0.30 per transaction (Phase 10)
- **Domain:** $12/year
- **Total Year 1:** $1,000-2,000 (mostly content + labor)
