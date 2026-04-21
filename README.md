# wrkly.hr

Marketplace connecting Indian tech talent with US/EU startups.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Prisma · NextAuth v5 · Supabase Postgres · MongoDB Atlas · Resend · Razorpay

---

## Quick start

```bash
npm install
npx prisma generate
npm run dev          # http://localhost:5000
```

Schema push (one-time, against Supabase):

```bash
set -a; . ./.env.local; set +a
DATABASE_URL="$DIRECT_URL_POOLER_SESSION" npx prisma db push
```

Note: Replit's environment auto-injects its own `DATABASE_URL`, which overrides `.env.local`. That's expected — local dev uses Replit's Postgres, Vercel uses Supabase.

---

## Environment variables (reference)

> ⚠️ Personal learning project — credentials checked in intentionally per owner request. Rotate before any real launch.

```bash
# DATABASE — PostgreSQL via Supabase
# Transaction pooler (port 6543) — used by app runtime (serverless-safe)
DATABASE_URL="postgresql://postgres.rwsgdmzukwzbhjaxqwlb:H5W%21V77u8%21I%2B@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct connection (port 5432) — used ONLY for `prisma db push` / migrations
DIRECT_URL="postgresql://postgres:H5W%21V77u8%21I%2B@db.rwsgdmzukwzbhjaxqwlb.supabase.co:5432/postgres"

# Session-mode pooler (port 5432 on pooler host) — fallback for migrations from networks
# that can't reach the direct host (e.g. Replit). Use this as DIRECT_URL when needed.
# postgresql://postgres.rwsgdmzukwzbhjaxqwlb:H5W%21V77u8%21I%2B@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

# DATABASE — MongoDB Atlas (for non-relational data, future use)
MONGODB_URI="mongodb+srv://admin:%3EpDeB88k%5E2Om@wrklyhr.vkuvsd4.mongodb.net/wrklyhr?retryWrites=true&w=majority"

# AUTH — NextAuth v5
NEXTAUTH_SECRET="HUryf35UbRzgkqd5Jyg/8ucD/zzcjfLQvJsORcv1p44="
NEXTAUTH_URL="http://localhost:5000"        # local
# NEXTAUTH_URL="https://wrklyhr.com"        # production (set in Vercel)

# FILE STORAGE — Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://rwsgdmzukwzbhjaxqwlb.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."   # server-only

# EMAIL — Resend (domain wrklyhr.com verified)
RESEND_API_KEY="re_VzCx9z64_Hp2JKMiExTfXpzaFnHjWPLrc"
RESEND_FROM_EMAIL="wrkly.hr <onboarding@wrklyhr.com>"

# PAYMENTS — Razorpay (placeholders, sprint 3+)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
```

---

## Sprints

- **Sprint 1 — Auth system** (`feat/auth-system`, PR #2) — signup, login, email verification, password reset, role-based middleware. ✅
- Sprint 2 — Talent onboarding & profiles
- Sprint 3 — Subscriptions & Razorpay
- Sprint 4 — Recruiter dashboard

See `replit.md` for full architecture & sprint roadmap.
