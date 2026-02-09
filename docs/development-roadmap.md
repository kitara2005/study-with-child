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

### Phase 3: Authentication (IN PROGRESS)

**Status:** 20% | **Duration:** 1 week | **Target:** Feb 10-16, 2026

- Supabase Auth setup (email + Google OAuth)
- User profile creation & management
- Session management (@supabase/ssr)
- Protected route middleware
- Signup/login UI (shadcn/ui forms)
- **Tasks:**
  - [ ] Configure Google OAuth in Supabase
  - [ ] Build signup page (`/auth/signup`)
  - [ ] Build login page (`/auth/login`)
  - [ ] Implement user profile creation in Prisma
  - [ ] Test auth flow with RLS
  - [ ] Add password reset flow
- **Deliverable:** Working auth flow, user can signup/login, session persists

### Phase 4: Content Navigation

**Status:** 0% | **Duration:** 1 week | **Target:** Feb 17-23, 2026

- Subject pages (detailed view, chapters list)
- Chapter pages (lessons list)
- Lesson pages with theory content display
- Vietnamese slug URL routing
- Breadcrumb navigation
- **Tasks:**
  - [ ] Create `/mon/[subject]/page.tsx`
  - [ ] Create `/mon/[subject]/chuong-[chapter]/page.tsx`
  - [ ] Create `/mon/[subject]/chuong-[chapter]/bai-[slug]/page.tsx`
  - [ ] Build LessonView component (render JSON content)
  - [ ] Add breadcrumb component
  - [ ] Test slug routing with special characters
- **Deliverable:** Click subject → chapters → lessons, all pages load correctly

### Phase 5: Exercise System

**Status:** 0% | **Duration:** 1 week | **Target:** Feb 24-Mar 2, 2026

- Exercise form component (client-side interactivity)
- 4 exercise types UI: multiple choice, fill-blank, drag-drop, true/false
- Answer submission & scoring logic
- Result storage (Prisma)
- Per-exercise feedback display
- **Tasks:**
  - [ ] Build ExerciseForm component
  - [ ] Implement answer validation & scoring
  - [ ] Create `/api/results` endpoint (POST)
  - [ ] Add ExerciseCard display component
  - [ ] Build result summary (score, stars, explanation)
  - [ ] Test exercise submission flow
- **Deliverable:** Student can solve exercises, see score + feedback, result stored in DB

### Phase 6: Admin Panel

**Status:** 0% | **Duration:** 1 week | **Target:** Mar 3-9, 2026

- Admin auth check (role-based)
- Dashboard: subjects, chapters, lessons CRUD
- Simple table-based UI (no advanced UX)
- Content approval state tracking
- **Tasks:**
  - [ ] Add `admin/` routes with auth protection
  - [ ] Build subject management page
  - [ ] Build chapter management page
  - [ ] Build lesson management page
  - [ ] Build exercise management page
  - [ ] Add form validation
- **Deliverable:** Admin can create/edit/delete all content, no content visible until admin approves

### Phase 7: Content Pipeline

**Status:** 0% | **Duration:** 1-2 weeks | **Target:** Mar 10-20, 2026

- Reference content scraper (crawl textbook sites)
- Claude AI rewriting script (not verbatim copy)
- Content import tool (seed Lesson + Exercise records)
- Populate 20 lessons (10 Math + 10 Vietnamese)
- **Tasks:**
  - [ ] Identify reference textbook sources (legal/non-commercial)
  - [ ] Build web scraper (Python Scrapy or Node.js Cheerio)
  - [ ] Integrate Claude API for content rewriting
  - [ ] Build content importer (Prisma createMany)
  - [ ] Populate lessons manually OR via script
  - [ ] QA: Content accuracy, exercise correctness
- **Deliverable:** 20 lessons published, students can see + solve exercises

### Phase 8: Testing & Deployment

**Status:** 0% | **Duration:** 1 week | **Target:** Mar 21-27, 2026

- Unit tests (Vitest) for utilities, API routes
- E2E tests (Playwright) for critical flows (auth, exercise submission)
- Performance testing (Lighthouse, WebPageTest)
- Security audit (auth, RLS, env vars)
- Vercel deployment + custom domain setup
- **Tasks:**
  - [ ] Write tests for API endpoints
  - [ ] Write tests for critical user flows
  - [ ] Run Lighthouse audit (target >90)
  - [ ] Audit RLS policies (no data leaks)
  - [ ] Deploy to Vercel (main branch)
  - [ ] Setup custom domain (optional Phase 8)
  - [ ] Create runbook for deploying schema changes
- **Deliverable:** Live MVP at `hoc-cung-con.vercel.app` (or custom domain), all tests pass, <1s page load

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
