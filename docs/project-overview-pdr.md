# Project Overview & Product Development Requirements

## Vision

Build a free, high-quality online learning platform for Vietnamese Grade 4 students (age 9-10) using the national "Chân Trời Sáng Tạo" (Horizon of Creative Thinking) curriculum.

**Problem:** Lack of engaging, accessible, free Vietnamese educational content aligned with the national curriculum. Parents struggle to find quality supplementary learning resources.

**Solution:** Hypothesis-driven platform combining curriculum-aligned content with interactive exercises, gamification (post-MVP), and parent tracking (post-MVP).

## Target Users

| User Type              | Goal                                     | Needs                                                     |
| ---------------------- | ---------------------------------------- | --------------------------------------------------------- |
| **Students (Grade 4)** | Master curriculum + improve grades       | Interactive lessons, exercises, instant feedback          |
| **Parents**            | Monitor child progress, support learning | Parent dashboard, progress tracking, curriculum alignment |
| **Admins**             | Manage content, monitor platform         | Simple CRUD tools, content approval workflow              |

## MVP Scope (8 Phases, Completed)

| Phase | Status  | Work                                                        |
| ----- | ------- | ----------------------------------------------------------- |
| 1     | ✅ Done | Project setup, Next.js 16 + TypeScript, Supabase, CI/CD     |
| 2     | ✅ Done | Prisma schema (6 models), seed data (8 subjects), homepage  |
| 3     | ✅ Done | Supabase Auth (email + Google OAuth), user profiles         |
| 4     | ✅ Done | Content pages (Vietnamese slugs), chapter/lesson navigation |
| 5     | ✅ Done | Exercise system (3 types), result tracking, auto-grading    |
| 6     | ✅ Done | Admin panel (CRUD subjects, chapters, lessons, exercises)   |
| 7     | ✅ Done | Content pipeline (JSON content, 2 subjects, 20 lessons)     |
| 8     | ✅ Done | Testing (43 Vitest + E2E), GitHub Actions, Vercel deploy    |

## MVP Feature List

**User Management**

- Email + Google OAuth signup/login
- User profiles (name, avatar, role: STUDENT/PARENT/ADMIN)
- Parent-child linking (optional for Phase 3)

**Content Navigation**

- 8 subjects grid (homepage)
- Vietnamese slug URLs: `/mon/{subject-slug}/chuong-{chapter}/bai-{lesson-slug}`
- Chapter list per subject
- Lesson view with theory content + exercises

**Exercise System**

- 3 exercise types implemented: MULTIPLE_CHOICE, FILL_BLANK, TRUE_FALSE
- Auto-grading with instant feedback + explanation
- Score: 0-100%, Stars: 0-3 (80%=1★, 90%=2★, 100%=3★)
- Result storage: answers JSON, score, stars, timeSpent (seconds)

**Admin Panel**

- Basic CRUD: subjects, chapters, lessons, exercises
- No advanced features (no approval workflow, no bulk upload)

**Free Access Policy**

- No lesson locking
- All 8 subjects accessible (2 populated with content, 6 coming soon)
- No payment system in MVP

## Technical Stack (Final)

- **Frontend:** Next.js 16, TypeScript (strict), React 19, Tailwind v4, shadcn/ui (new-york)
- **Backend:** Next.js Route Handlers, Supabase serverless
- **Database:** Supabase PostgreSQL, Prisma v7 with PrismaPg adapter
- **Auth:** Supabase Auth (JWT + @supabase/ssr)
- **Testing:** Vitest (unit), Playwright (E2E), 43 tests
- **Hosting:** Vercel (free tier)
- **Build:** pnpm, GitHub Actions CI

## Content Strategy

- **No verbatim copying:** Only crawl structure + examples from reference textbooks
- **AI rewriting:** Use Claude API to rewrite content in simpler, engaging Vietnamese
- **20 lessons in MVP:** 10 Math, 10 Vietnamese (2 subjects only)
- **Post-MVP:** Expand to all 8 subjects gradually

## Success Metrics (MVP)

- 100+ student accounts in first month
- 60%+ lesson completion rate
- 0 security/auth issues (no RLS violations)
- <1s page load time (Vercel edge caching)
- All exercises working without bugs

## Validated Decisions (Non-negotiable in MVP)

| Decision              | Reason                                   | Post-MVP?              |
| --------------------- | ---------------------------------------- | ---------------------- |
| **No lesson locking** | Free platform philosophy, builds habit   | Maybe (freemium later) |
| **Vietnamese slugs**  | SEO, cultural alignment                  | Yes, expand            |
| **2 subjects only**   | Content quality over quantity            | Add more subjects      |
| **No AI Tutor**       | Scope creep, cost ($$$), safety concerns | Phase 9+               |
| **No gamification**   | Nice-to-have, not MVP-critical           | Phase 9+               |
| **No payment system** | Stay free, establish trust               | Phase 9+               |

## Future Expansion (Post-MVP)

**Phase 9:** AI Tutor (Claude API per-lesson chat)
**Phase 10:** Monetization (freemium, MoMo/ZaloPay payment)
**Phase 11:** Gamification (badges, streaks, XP, leaderboard)
**Phase 12:** Progress dashboards (student/parent analytics)
**Phase 13:** Mobile app (PWA or React Native)
**Phase 14+:** Content expansion (all 8 subjects, other grades)

## Risk Assessment

| Risk                          | Likelihood | Impact               | Mitigation                                |
| ----------------------------- | ---------- | -------------------- | ----------------------------------------- |
| Supabase RLS misconfiguration | High       | Critical (data leak) | Audit RLS rules, test auth flows          |
| Content moderation at scale   | Medium     | Medium (user trust)  | Phase 8: Manual review of AI rewrites     |
| Claude API costs ($$$)        | Medium     | Medium (budget)      | Defer AI Tutor, use cached responses      |
| Student retention             | High       | High (product fail)  | Phase 8+: Gamification, progress tracking |

## Legal & Compliance

- No verbatim textbook content (Vietnamese education law)
- User data: GDPR-compliant (Supabase in EU region available)
- Terms of Service: Non-commercial educational use only
- Age-appropriate content filters (no ads, no external links in MVP)
