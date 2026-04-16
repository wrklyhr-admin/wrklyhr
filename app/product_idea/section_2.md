Perfect. Now I have everything I need. Here is the fully rewritten **Section 2**.

---

# wrkly.hr — Product Knowledge Base
## Section 2 of 6: Tech Stack & System Architecture

---

## 2.0 Current State of the Repo

This is what already exists. Do not touch or rebuild any of this.

```
wrklyhr/
├── app/
│   ├── page.tsx              ✅ Landing page — built & deployed
│   ├── layout.tsx            ✅ Root layout — exists
│   ├── globals.css           ✅ Global styles — exists
│   └── auth/
│       └── page.tsx          ✅ Signup UI — design only, not functional
├── components/               ✅ All landing page components — do not touch
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ... (11 more)
├── next.config.mjs           ✅ Exists
├── tailwind.config.ts        ✅ Exists
├── tsconfig.json             ✅ Exists
└── package.json              ✅ Next.js 14.2.29, App Router
```

---

## 2.1 What We Know About the Current Setup

```
Framework:        Next.js 14.2.29
Router:           App Router  ← confirmed (app/ folder exists)
Language:         TypeScript  ← confirmed (tsconfig.json exists)
Styling:          Tailwind CSS v3  ← confirmed
Port (dev):       5000  ← not 3000, Replit changed this

Already installed:
  - framer-motion       (animations, landing page uses it)
  - lucide-react        (icons)
  - react-fast-marquee  (marquee strip on landing page)

NOT installed yet (we will install these, sprint by sprint):
  - NextAuth.js
  - Prisma
  - Mongoose
  - Supabase client
  - Razorpay
  - Resend
  - react-hook-form
  - zod
  - bcryptjs
  - shadcn/ui
```

---

## 2.2 Folder Structure — Final Target

This is what the full project looks like when all sprints are done.
Every Replit agent must only create files inside their assigned sprint scope.

```
wrklyhr/
│
├── app/                          ← All pages & API routes live here
│   │
│   ├── page.tsx                  ← Landing page (already built, don't touch)
│   ├── layout.tsx                ← Root layout (already built, don't touch)
│   ├── globals.css               ← Global styles (already built, don't touch)
│   │
│   ├── auth/                     ← Auth pages
│   │   ├── page.tsx              ← Signup UI (already exists, needs wiring)
│   │   ├── login/
│   │   │   └── page.tsx          ← Login page
│   │   ├── verify-email/
│   │   │   └── page.tsx          ← Email verification page
│   │   └── reset-password/
│   │       └── page.tsx          ← Reset password page
│   │
│   ├── onboarding/               ← Multi-step profile builder (post signup)
│   │   └── page.tsx
│   │
│   ├── dashboard/                ← Talent dashboard (protected)
│   │   └── page.tsx
│   │
│   ├── profile/                  ← Talent profile edit (protected)
│   │   └── page.tsx
│   │
│   ├── plans/                    ← Subscription plans page (protected)
│   │   └── page.tsx
│   │
│   ├── admin/                    ← All admin pages (protected, role-checked)
│   │   ├── page.tsx              ← Admin login page
│   │   ├── dashboard/
│   │   │   └── page.tsx          ← Admin home
│   │   ├── talent/
│   │   │   ├── page.tsx          ← Talent list
│   │   │   └── [id]/
│   │   │       └── page.tsx      ← Single talent detail
│   │   ├── startups/
│   │   │   └── page.tsx          ← Startup CRM
│   │   ├── applications/
│   │   │   └── page.tsx          ← Application logs
│   │   └── team/
│   │       └── page.tsx          ← Team management
│   │
│   └── api/                      ← All backend API endpoints live here
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts      ← NextAuth handler
│       ├── profile/
│       │   └── route.ts
│       ├── resume/
│       │   └── route.ts
│       ├── subscriptions/
│       │   └── route.ts
│       ├── applications/
│       │   └── route.ts
│       ├── startups/
│       │   └── route.ts
│       ├── notifications/
│       │   └── route.ts
│       └── team/
│           └── route.ts
│
├── components/                   ← All reusable UI components
│   ├── (landing page components — already exist, don't touch)
│   ├── ui/                       ← shadcn/ui components go here
│   ├── talent/                   ← Talent-specific components
│   ├── admin/                    ← Admin-specific components
│   └── shared/                   ← Used by both talent and admin
│
├── lib/                          ← Singleton connections & utilities
│   ├── prisma.ts                 ← Prisma client singleton
│   ├── mongoose.ts               ← Mongoose connection singleton
│   ├── auth.ts                   ← NextAuth config
│   ├── resend.ts                 ← Resend email client
│   └── supabase.ts               ← Supabase storage client
│
├── models/                       ← Mongoose models (MongoDB)
│   ├── Application.ts
│   └── Startup.ts
│
├── prisma/
│   └── schema.prisma             ← PostgreSQL table definitions
│
├── middleware.ts                 ← Route protection (root level)
│
├── .env.local                    ← All secrets (never commit)
├── .env.example                  ← All keys with empty values (commit this)
├── .gitignore                    ← Must include .env.local
└── package.json
```

---

## 2.3 Tech Stack — Every Tool, Exact Reason, No Fluff

### Next.js 14 — App Router

```
What it is:
  The core framework. Handles both the frontend (pages)
  and backend (API routes) in one codebase.

Why App Router (not Pages Router):
  App Router is the current standard in Next.js 14.
  It gives us layouts, loading states, and server
  components without extra setup.
  The app/ folder = App Router is already active.

Dev port: 5000 (already configured in package.json)
  → App runs at http://localhost:5000 locally
  → Not 3000. Every agent must know this.
```

### TypeScript

```
What it is:
  JavaScript with types. Every file is .ts or .tsx.

Why it matters for Replit agents:
  Types catch mistakes before the code runs.
  Every function parameter, API response, and
  database model must have a type defined.

Rule: No .js files. No 'any' type unless absolutely
      unavoidable and commented with a reason.
```

### Tailwind CSS v3

```
What it is:
  A CSS framework where you style using class names
  directly in your JSX. No separate .css files needed.

Already installed and configured in:
  - tailwind.config.ts
  - app/globals.css (has the @tailwind directives)

Rule: Do not install any other CSS library.
      Do not write custom CSS unless Tailwind
      cannot achieve the style.
```

### shadcn/ui

```
What it is:
  A collection of pre-built React components
  (Button, Input, Table, Dialog, Form, etc.)
  that are copied into your project.
  They are built on top of Tailwind CSS.

Why not other UI libraries (MUI, Ant Design, Chakra):
  shadcn components are yours — you own the code.
  No version conflicts. No bundle size issues.
  They look clean and work with Tailwind perfectly.

How to install shadcn (run once to init):
  npx shadcn@latest init

How to add a component (example: Button):
  npx shadcn@latest add button
  → This creates components/ui/button.tsx

Where components live: components/ui/

Rule: Before building any UI element, check if
      shadcn has it. Only build custom if it doesn't.
```

### NextAuth.js v5

```
What it is:
  Handles login, logout, and session management
  for Next.js apps.

What we use:
  - Credentials Provider: email + password login
  - JWT strategy: session stored in a secure
    HTTP-only cookie (browser cannot access it
    via JavaScript — prevents theft)

What we do NOT use:
  - Google OAuth (not in MVP)
  - LinkedIn OAuth (not in MVP)
  - Supabase Auth (we only use Supabase for DB
    and file storage, not for auth)

How sessions work:
  1. User logs in with email + password
  2. NextAuth verifies password using bcryptjs
  3. NextAuth creates a JWT, stores in cookie
  4. Every protected page/API checks this cookie
  5. Cookie expires after 30 days

Config file: lib/auth.ts
API route:   app/api/auth/[...nextauth]/route.ts
```

### PostgreSQL via Supabase

```
What it is:
  A hosted PostgreSQL database.
  We use Supabase only as the database host.
  We do NOT use Supabase's own auth or client
  library for database queries.

Free tier:
  - 500MB storage
  - Project pauses after 7 days of no activity
  - To prevent pause: ensure at least one
    DB query happens every few days

Two connection URLs (both in .env.local):
  DATABASE_URL  → pooler (port 6543)
                  Used by the running app
                  Handles many connections safely
                  in Vercel's serverless environment

  DIRECT_URL    → direct (port 5432)
                  Used ONLY by Prisma migrations
                  Never used in app code
```

### Prisma ORM

```
What it is:
  A tool that lets you query PostgreSQL using
  TypeScript instead of raw SQL.

Three things Prisma does:
  1. Schema: You define tables in prisma/schema.prisma
  2. Migrate: npx prisma db push applies schema to DB
  3. Query: prisma.user.create(), prisma.profile.findMany()
     etc. — all type-safe

Critical rule — singleton pattern:
  Next.js on Vercel is serverless. Each API call
  can start a fresh instance of your code.
  If you create a new PrismaClient() in every file,
  you will run out of database connections instantly.
  
  Solution: ONE PrismaClient instance in lib/prisma.ts
  Every file imports from there. Never creates its own.

Commands used in development:
  npx prisma db push      ← applies schema changes to DB
                            uses DIRECT_URL
  npx prisma generate     ← regenerates TypeScript types
                            run this after every schema change
  npx prisma studio       ← opens a visual DB browser
                            useful for checking data
```

### MongoDB Atlas

```
What it is:
  A hosted MongoDB database (document database).
  Stores data as JSON-like documents instead of rows.

Free tier:
  - 512MB storage
  - Shared cluster (M0)
  - No auto-pause like Supabase

What we store here:
  1. Application logs
     (every application our team makes on behalf of talent)
  2. Startup CRM
     (every startup we've found, contacted, or placed with)

Why not store this in PostgreSQL:
  Application logs and CRM entries have flexible,
  unpredictable fields. Sometimes a log has 3 fields.
  Sometimes it has 10. MongoDB handles this naturally.
  PostgreSQL would require migrations for every new field.

Database name: wrklyhr
  (already set in MONGODB_URI)
```

### Mongoose

```
What it is:
  A tool that adds structure and validation
  to MongoDB. Without it, MongoDB has zero
  rules about what goes in.

Where models live: models/ folder
  - models/Application.ts
  - models/Startup.ts

Critical rule — singleton connection:
  Same problem as Prisma — serverless functions
  reconnect to MongoDB on every call if not cached.
  
  Solution: lib/mongoose.ts caches the connection.
  Every API route that uses MongoDB must call:
    await connectMongo()
  as the FIRST line before any Mongoose query.
```

### Supabase Storage

```
What it is:
  A file storage service (like AWS S3 but simpler).
  We use it to store talent resume PDFs.

Free tier: 2GB — enough for hundreds of resumes

Bucket setup:
  Name: resumes
  Access: PRIVATE (not public)
  
  This means: files do NOT have a public URL.
  To download a resume, our backend generates
  a signed URL that expires in 60 minutes.
  Only admins and the talent who owns it can do this.

File path format:
  {userId}/{timestamp}.pdf
  Example: clx123abc/1714000000000.pdf

Client used:
  lib/supabase.ts
  
  Two clients:
    1. Public client  — uses NEXT_PUBLIC_SUPABASE_ANON_KEY
                        used for uploading from browser
    2. Admin client   — uses SUPABASE_SERVICE_ROLE_KEY
                        used SERVER ONLY for admin downloads
                        never import in any client component
```

### Resend

```
What it is:
  A service for sending transactional emails.

Free tier: 3,000 emails/month

Domain: wrklyhr.com (already verified per .env.local)

Emails sent in MVP:
  1. Welcome email        → on signup
  2. Verify your email    → after signup, before full access
  3. Password reset       → when user requests reset
  4. Application sent     → "We applied for you at XYZ Startup"
  5. Status update        → "You have an interview at XYZ Startup"

Client: lib/resend.ts
All email templates live in: lib/emails/ folder
  (plain HTML strings — no React Email in MVP,
   keep it simple)
```

### Razorpay

```
What it is:
  Payment gateway that supports INR.

Status: NOT set up yet — keys are empty in .env.local

When to use: Sprint 4 only (feat/subscription-plans)

Do NOT write any payment code before Sprint 4.

MVP payment flow (simple, no auto-renewal):
  - Talent picks a paid plan
  - Razorpay checkout opens in browser
  - Talent pays
  - Razorpay confirms payment
  - Our API updates subscription table in PostgreSQL
  - Talent manually renews each month
  
  Auto-renewal via webhooks is Phase 2.
```

### Vercel

```
What it is:
  Hosting platform. Next.js deploys here for free.

How it connects to the repo:
  - GitHub repo is linked to Vercel project
  - Every merge to main → auto deploys to wrklyhr.com
  - Every PR → gets a preview URL automatically
    e.g. https://feat-auth-system-wrklyhr.vercel.app
    Use this to test before merging to main.

Environment variables:
  Set in Vercel dashboard:
  Project → Settings → Environment Variables
  Must match exactly what is in .env.local
  Add NEXTAUTH_URL=https://wrklyhr.com for production
```

---

## 2.4 How All Pieces Connect — System Map

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│                                                              │
│  Talent pages          Admin pages        Landing page       │
│  /dashboard            /admin/dashboard   /                  │
│  /onboarding           /admin/talent      (already built)    │
│  /plans                /admin/startups                       │
│  /profile              /admin/team                           │
└────────────────────────────┬─────────────────────────────────┘
                             │  HTTP requests
                             │  (with session cookie)
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                   NEXT.JS 14 ON VERCEL                       │
│                                                              │
│  middleware.ts  ← checks every request first                 │
│  (is user logged in? is user an admin?)                      │
│  if not → redirect to login                                  │
│                                                              │
│  ┌─────────────────┐      ┌──────────────────────────────┐  │
│  │  Frontend       │      │  Backend (app/api/)          │  │
│  │  React + TSX    │ ───► │                              │  │
│  │  Tailwind       │      │  /api/auth/[...nextauth]     │  │
│  │  shadcn/ui      │ ◄─── │  /api/profile                │  │
│  │  framer-motion  │      │  /api/resume                 │  │
│  └─────────────────┘      │  /api/subscriptions          │  │
│                           │  /api/applications           │  │
│                           │  /api/startups               │  │
│                           │  /api/notifications          │  │
│                           │  /api/team                   │  │
│                           └──────────────┬───────────────┘  │
└──────────────────────────────────────────┼───────────────────┘
                                           │
              ┌────────────────────────────┼────────────────────────┐
              │                            │                        │
              ▼                            ▼                        ▼
┌─────────────────────┐   ┌───────────────────────┐  ┌─────────────────────┐
│  Supabase           │   │  MongoDB Atlas         │  │  External Services  │
│  PostgreSQL         │   │  (Mongoose)            │  │                     │
│  (Prisma)           │   │                        │  │  Resend             │
│                     │   │  Collection:           │  │  (emails)           │
│  Tables:            │   │  applications          │  │                     │
│  User               │   │  startups              │  │  Razorpay           │
│  Profile            │   │                        │  │  (payments)         │
│  Subscription       │   │                        │  │                     │
│  Notification       │   │                        │  │  Supabase Storage   │
│  VerifyToken        │   │                        │  │  (resume PDFs)      │
│  ResetToken         │   │                        │  │                     │
└─────────────────────┘   └───────────────────────┘  └─────────────────────┘
```

---

## 2.5 Singleton Files — Write These Once, Never Change

These two files are the most critical in the entire codebase.
Every agent must use these exact implementations.

### lib/prisma.ts

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### lib/mongoose.ts

```typescript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env.local')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as unknown as {
  mongoose: MongooseCache
}

const cached: MongooseCache =
  globalForMongoose.mongoose ?? { conn: null, promise: null }

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached
}

export async function connectMongo() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  cached.conn = await cached.promise
  return cached.conn
}
```

### lib/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js'

// Public client — safe for browser
// Used for: resume uploads from client side
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Admin client — SERVER ONLY
// Used for: admin resume downloads, server-side file ops
// Never import this in any component with 'use client'
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### lib/resend.ts

```typescript
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)
```

---

## 2.6 Route Protection — How middleware.ts Works

This file runs on every single request before the page loads.
It decides: is this person allowed to see this page?

```
Request comes in
      │
      ▼
middleware.ts runs first
      │
      ├── Path is /admin/*
      │     └── Check session
      │           ├── No session → redirect to /admin
      │           ├── Session but role is TALENT → redirect to /dashboard
      │           └── Session, role is SUPER_ADMIN or
      │               PLACEMENT_MANAGER → allow through
      │
      ├── Path is /dashboard, /profile,
      │   /onboarding, /plans
      │     └── Check session
      │           ├── No session → redirect to /auth/login
      │           └── Session exists → allow through
      │
      └── Path is /, /auth/*, /api/*
            └── Allow through (public)
```

```typescript
// middleware.ts (root level — not inside app/)
export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/onboarding/:path*',
    '/plans/:path*',
    '/admin/dashboard/:path*',
    '/admin/talent/:path*',
    '/admin/startups/:path*',
    '/admin/applications/:path*',
    '/admin/team/:path*',
  ],
}
```

---

## 2.7 Packages to Install — Per Sprint

Do not install everything at once. Each sprint installs only what it needs.

```
Sprint 1 — feat/auth-system
  npm install next-auth@beta bcryptjs
  npm install -D @types/bcryptjs
  npx shadcn@latest init
  npx shadcn@latest add button input label card form

Sprint 2 — feat/talent-profile
  npm install react-hook-form zod @hookform/resolvers
  npx shadcn@latest add select textarea badge progress

Sprint 3 — feat/resume-upload
  npm install @supabase/supabase-js

Sprint 4 — feat/subscription-plans
  npm install razorpay
  (Razorpay keys must be filled in .env.local first)

Sprint 5 — feat/talent-dashboard
  npx shadcn@latest add table tabs dialog

Sprint 6 — feat/admin-auth
  (no new packages — uses NextAuth already installed)

Sprint 7 — feat/admin-talent-mgmt
  (no new packages)

Sprint 8 — feat/admin-crm
  npm install mongoose
  npm install -D @types/mongoose

Sprint 9 — feat/application-logger
  (no new packages — uses Mongoose already installed)

Sprint 10 — feat/notifications
  npm install resend
  npm install prisma @prisma/client
  npx prisma generate

Sprint 11 — feat/team-management
  (no new packages)
```

---

## 2.8 Git Branch Rules for Replit Agents

```
main
  └── Never push directly to main
  └── Always work in a feature branch

Branch naming — exact names, no variation:
  feat/auth-system
  feat/talent-profile
  feat/resume-upload
  feat/subscription-plans
  feat/talent-dashboard
  feat/admin-auth
  feat/admin-talent-mgmt
  feat/admin-crm
  feat/application-logger
  feat/notifications
  feat/team-management

Each Replit agent must:
  1. Read this file fully before writing any code
  2. State which branch it is working on
  3. Only create/edit files within its sprint scope
  4. Never modify landing page components
  5. Never modify another sprint's files
  6. Commit with clear messages:
     "feat: add login form with validation"
     "feat: connect signup to PostgreSQL via Prisma"
     "fix: resolve bcrypt import error on Vercel"
```

---

## ✅ Section 2 Complete

**Next → Section 3: System Design & Data Flows**

Every user journey mapped precisely — signup, email verify, onboarding, payment, admin operations — with exact database writes at every step.
