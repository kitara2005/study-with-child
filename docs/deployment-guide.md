# Deployment Guide

## Prerequisites

- GitHub repo connected
- [Vercel](https://vercel.com) account (Hobby plan, free)
- [Supabase](https://supabase.com) project (Free plan)
- pnpm installed locally

## 1. Supabase Setup

### Create Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**
2. Choose org, name: `hoc-cung-con`, region: **Southeast Asia (Singapore)**
3. Set database password (save it!)
4. Wait for project to initialize (~2 min)

### Get Credentials

Go to **Settings → API**:

| Variable                        | Where to find               |
| ------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project URL                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key         |
| `SUPABASE_SERVICE_ROLE_KEY`     | `service_role` `secret` key |

Go to **Settings → Database → Connection string → URI**:

| Variable       | Connection type                                     |
| -------------- | --------------------------------------------------- |
| `DATABASE_URL` | Transaction mode (port 6543, add `?pgbouncer=true`) |
| `DIRECT_URL`   | Session mode (port 5432)                            |

### Push Schema & Seed

```bash
cp .env.example .env.local
# Fill in all 5 variables above

pnpm dlx prisma db push
pnpm dlx prisma db seed
```

Verify: **Supabase Dashboard → Table Editor** should show 6 tables with seed data.

## 2. Vercel Deployment

### GitHub Integration

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Root directory: `./`
5. Build command: `pnpm build` (auto)
6. Install command: `pnpm install` (auto)

### Environment Variables (Production)

Set in Vercel project **Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=[your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
DATABASE_URL=[pooler-connection-with-pgbouncer]
DIRECT_URL=[direct-session-connection]
```

Set scope: **Production + Preview + Development** (auto-deploy to staging on PR).

### Automatic Deployment

- Every push to `main` → auto-deploy to production
- PR → auto-deploy preview
- No manual steps needed (GitHub Actions + Vercel sync)

### Custom Domain (Optional)

1. **Settings → Domains → Add**
2. Enter domain: `hoccungcon.vn` or `hoccungcon.com`
3. Update DNS records at registrar:
   - `A` record → `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`
4. SSL auto-provisioned by Vercel

## 3. Production Database Migration

When schema changes in future phases:

```bash
# Generate migration file
pnpm dlx prisma migrate dev --name describe-change

# Apply to production (in CI or manually)
pnpm dlx prisma migrate deploy
```

**Important:** Never use `db push` in production after first deploy. Use `migrate deploy`.

## 4. CI/CD Pipeline (Phase 8)

`.github/workflows/ci.yml` will be added in Phase 8:

```yaml
# Triggers on push to main and PRs
# Steps: install → lint → test → build
# Vercel handles deploy automatically via GitHub integration
```

## 5. Monitoring

### Vercel

- **Analytics:** Built-in Web Vitals (enable in project settings)
- **Logs:** Functions tab → real-time server logs
- **Speed Insights:** Core Web Vitals per page

### Supabase

- **Dashboard → Reports:** DB size, API requests, auth users
- **Logs:** API logs, Postgres logs, Auth logs
- **Alerts:** Set usage alerts at 80% of free tier limits

### Free Tier Limits

| Service       | Limit                            | When to upgrade           |
| ------------- | -------------------------------- | ------------------------- |
| Vercel Hobby  | 100GB bandwidth/mo               | >1K daily users           |
| Supabase Free | 500MB DB, 50K rows, 2GB transfer | >500 active users         |
| Total cost    | $0/mo                            | Scale triggers at ~1K MAU |

## 6. Rollback

```bash
# Vercel: instant rollback in dashboard
# Deployments tab → click previous deploy → "Promote to Production"

# Database: rollback last migration
pnpm dlx prisma migrate resolve --rolled-back [migration-name]
```

## Troubleshooting

| Issue                        | Fix                                                        |
| ---------------------------- | ---------------------------------------------------------- |
| Build fails on Vercel        | Check env vars are set, run `pnpm build` locally           |
| DB connection refused        | Verify DATABASE_URL, check Supabase is not paused          |
| Supabase paused (inactivity) | Free projects pause after 7 days idle, resume in dashboard |
| Prisma generate fails        | Run `pnpm dlx prisma generate` before build                |
| 500 errors on API routes     | Check Vercel function logs, verify env vars                |
