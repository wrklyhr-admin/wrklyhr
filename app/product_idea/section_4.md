# wrkly.hr — Product Knowledge Base
## Section 4 of 6: Database Design

---

## 4.0 Before You Start

Every Replit agent working on any sprint that touches the database must:

```
1. Never create a new table or collection
   without it being defined in this document

2. Never change the schema without the founder
   reviewing and merging the change first

3. Always run these two commands after any
   schema change to prisma/schema.prisma:

   npx prisma db push     ← applies to Supabase
   npx prisma generate    ← regenerates TS types

4. Never run prisma migrate dev on Vercel or
   in production. Only run it locally or in Replit.

5. Always import prisma from lib/prisma.ts
   Never create a new PrismaClient() anywhere else

6. Always call connectMongo() before any
   Mongoose query in any API route
```

---

## 4.1 PostgreSQL — Full Prisma Schema

This is the complete, final file.
Save this as `prisma/schema.prisma`.
Do not add or remove anything without approval.

```prisma
// prisma/schema.prisma
// ─────────────────────────────────────────────────
// This file defines every PostgreSQL table.
// After any change:
//   npx prisma db push
//   npx prisma generate
// ─────────────────────────────────────────────────

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")    // pooler — used by app at runtime
  directUrl = env("DIRECT_URL")      // direct — used only for migrations
}

// ─────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────

enum Role {
  TALENT
  SUPER_ADMIN
  PLACEMENT_MANAGER
}

enum Plan {
  FREE
  STARTER
  GROWTH
  PRO
}

// ─────────────────────────────────────────────────
// USER
// One row per person on the platform.
// Talents, Super Admins, and Placement Managers
// all live in this same table.
// The role field tells them apart.
// ─────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          Role      @default(TALENT)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  profile       Profile?
  subscription  Subscription?
  notifications Notification[]
  verifyTokens  VerifyToken[]
  resetTokens   ResetToken[]
}

// ─────────────────────────────────────────────────
// PROFILE
// One row per talent. Created during onboarding.
// Admin users do NOT have a profile row.
// ─────────────────────────────────────────────────

model Profile {
  id              String   @id @default(cuid())
  userId          String   @unique       // one profile per user
  fullName        String
  location        String?                // e.g. "Kolkata, India"
  timezone        String?                // e.g. "IST", "EST"
  linkedInUrl     String?                // optional
  skills          String[]               // e.g. ["React", "Node.js"]
  experienceYears Int?                   // stored as number e.g. 3
  roleType        String?                // "Software Engineer" | "DevOps Engineer"
  availability    String?                // "hourly" | "contract" | "both"
  rateUsd         Float?                 // hourly rate in USD e.g. 25.00
  weeklyHours     Int?                   // 10 | 20 | 40
  resumeUrl       String?                // Supabase Storage file path
                                         // format: {userId}/{timestamp}.pdf
                                         // NOT a public URL
  completionPct   Int      @default(0)   // 0 until onboarding done, then 100
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────────
// SUBSCRIPTION
// One row per talent.
// Created automatically on signup with plan = FREE.
// Updated when talent pays for a plan.
// Admin users do NOT have a subscription row.
// ─────────────────────────────────────────────────

model Subscription {
  id          String    @id @default(cuid())
  userId      String    @unique        // one subscription per user
  plan        Plan      @default(FREE)
  status      String    @default("active")
                                       // "active" | "cancelled" | "expired"
  razorpayId  String?                  // Razorpay payment_id, null for Free plan
  startDate   DateTime  @default(now())
  endDate     DateTime?                // null for Free plan
                                       // set to now + 30 days for paid plans
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────────
// NOTIFICATION
// One row per notification message.
// Created by admin actions (application logged,
// status changed).
// Read by talent on their dashboard.
// ─────────────────────────────────────────────────

model Notification {
  id        String   @id @default(cuid())
  userId    String                       // FK to User.id (the talent)
  message   String                       // plain text message
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────────
// VERIFY TOKEN
// One row per email verification request.
// Created on signup.
// Deleted after it is used or expired.
// Also reused for team member invites.
// ─────────────────────────────────────────────────

model VerifyToken {
  id        String   @id @default(cuid())
  userId    String                        // FK to User.id
  token     String   @unique              // crypto.randomUUID()
  expiresAt DateTime                      // now + 24 hours
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────────────
// RESET TOKEN
// One row per password reset request.
// Created when user clicks "Forgot password".
// Deleted after it is used or expired.
// ─────────────────────────────────────────────────

model ResetToken {
  id        String   @id @default(cuid())
  userId    String                        // FK to User.id
  token     String   @unique              // crypto.randomUUID()
  expiresAt DateTime                      // now + 1 hour
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 4.2 PostgreSQL — Table Relationships

```
User (1) ──────── (1) Profile
  │                     One user has one profile
  │                     Profile is deleted if User is deleted
  │
User (1) ──────── (1) Subscription
  │                     One user has one subscription
  │                     Created on signup with FREE plan
  │                     Deleted if User is deleted
  │
User (1) ──────── (∞) Notification
  │                     One user can have many notifications
  │                     Deleted if User is deleted
  │
User (1) ──────── (∞) VerifyToken
  │                     Can have multiple (resend feature)
  │                     Deleted if User is deleted
  │
User (1) ──────── (∞) ResetToken
                        Can have multiple (multiple reset requests)
                        Deleted if User is deleted
```

---

## 4.3 PostgreSQL — Important Query Patterns

These are the exact Prisma queries used across the app.
Copy these patterns. Do not invent new ones.

### Create a new talent on signup

```typescript
// Creates User + Subscription in one transaction
// A transaction means: both succeed or both fail
// Never create one without the other

const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: {
      email,
      passwordHash,
      role: 'TALENT',
      emailVerified: false,
    },
  })

  const subscription = await tx.subscription.create({
    data: {
      userId: user.id,
      plan: 'FREE',
      status: 'active',
    },
  })

  return { user, subscription }
})
```

### Get full talent profile for admin view

```typescript
// Fetches user + profile + subscription in one query
// No separate calls needed

const talent = await prisma.user.findUnique({
  where: { id: talentId },
  include: {
    profile: true,
    subscription: true,
  },
})
```

### Get all talents for admin list page

```typescript
// Returns all TALENT role users
// with their profile and subscription
// Ordered by newest first

const talents = await prisma.user.findMany({
  where: { role: 'TALENT' },
  include: {
    profile: true,
    subscription: true,
  },
  orderBy: { createdAt: 'desc' },
})
```

### Get unread notification count for talent

```typescript
const count = await prisma.notification.count({
  where: {
    userId: session.user.id,
    read: false,
  },
})
```

### Mark all notifications as read

```typescript
await prisma.notification.updateMany({
  where: {
    userId: session.user.id,
    read: false,
  },
  data: { read: true },
})
```

### Verify a token (email verify or password reset)

```typescript
// Pattern is the same for both VerifyToken and ResetToken

const tokenRecord = await prisma.verifyToken.findUnique({
  where: { token },
  include: { user: true },
})

// Check 1: does it exist?
if (!tokenRecord) {
  return { error: 'Invalid link' }
}

// Check 2: has it expired?
if (tokenRecord.expiresAt < new Date()) {
  await prisma.verifyToken.delete({
    where: { id: tokenRecord.id },
  })
  return { error: 'Link has expired' }
}

// All good — use the token, then delete it
await prisma.verifyToken.delete({
  where: { id: tokenRecord.id },
})
```

### Update subscription after payment

```typescript
await prisma.subscription.update({
  where: { userId },
  data: {
    plan: 'STARTER',        // or GROWTH or PRO
    status: 'active',
    razorpayId: paymentId,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            // now + 30 days in milliseconds
  },
})
```

---

## 4.4 MongoDB — Full Mongoose Models

Save these files exactly as shown.

### models/Application.ts

```typescript
// models/Application.ts
// ─────────────────────────────────────────────────
// Stores every application our team makes
// on behalf of a talent.
// talentId links back to PostgreSQL User.id
// ─────────────────────────────────────────────────

import mongoose, { Schema, Document, Model } from 'mongoose'

// TypeScript interface — defines the shape of a document
export interface IApplication extends Document {
  talentId: string        // PostgreSQL User.id of the talent
  startupName: string
  startupWebsite?: string
  role: string            // e.g. "Backend Engineer"
  source: string          // where we found the startup
  appliedBy: string       // PostgreSQL User.id of the admin
  status: 'APPLIED' | 'INTERVIEWING' | 'PLACED' | 'REJECTED'
  notes?: string
  appliedAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    talentId: {
      type: String,
      required: [true, 'talentId is required'],
      index: true,          // indexed — we query by talentId often
    },
    startupName: {
      type: String,
      required: [true, 'startupName is required'],
      trim: true,
    },
    startupWebsite: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'role is required'],
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'source is required'],
      enum: {
        values: ['Crunchbase', 'LinkedIn', 'YC', 'AngelList',
                 'Sequoia', 'Direct', 'Other'],
        message: '{VALUE} is not a valid source',
      },
    },
    appliedBy: {
      type: String,
      required: [true, 'appliedBy is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['APPLIED', 'INTERVIEWING', 'PLACED', 'REJECTED'],
        message: '{VALUE} is not a valid status',
      },
      default: 'APPLIED',
    },
    notes: {
      type: String,
      trim: true,
    },
    appliedAt: {
      type: Date,
      required: [true, 'appliedAt is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
    // timestamps: true automatically adds:
    //   createdAt: Date
    //   updatedAt: Date
    // and updates updatedAt on every save
  }
)

// Compound index — used for monthly application count check
// This makes the query in section 3.11 fast
ApplicationSchema.index({ talentId: 1, appliedAt: 1 })

// Prevent model recompilation in Next.js serverless
// Without this check, Next.js throws:
// "Cannot overwrite model once compiled"
const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>('Application', ApplicationSchema)

export default Application
```

### models/Startup.ts

```typescript
// models/Startup.ts
// ─────────────────────────────────────────────────
// Stores startups our team has found and is
// tracking in the CRM.
// ─────────────────────────────────────────────────

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStartup extends Document {
  name: string
  website?: string
  country?: string
  fundingStage?: string
  source?: string
  crmStatus: 'NEW' | 'CONTACTED' | 'RESPONDED' | 'HIRED' | 'REJECTED'
  addedBy: string           // PostgreSQL User.id of the admin
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const StartupSchema = new Schema<IStartup>(
  {
    name: {
      type: String,
      required: [true, 'Startup name is required'],
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    fundingStage: {
      type: String,
      enum: {
        values: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Other'],
        message: '{VALUE} is not a valid funding stage',
      },
    },
    source: {
      type: String,
      enum: {
        values: ['Crunchbase', 'LinkedIn', 'YC', 'AngelList',
                 'Sequoia', 'Direct', 'Other'],
        message: '{VALUE} is not a valid source',
      },
    },
    crmStatus: {
      type: String,
      enum: {
        values: ['NEW', 'CONTACTED', 'RESPONDED', 'HIRED', 'REJECTED'],
        message: '{VALUE} is not a valid CRM status',
      },
      default: 'NEW',
    },
    addedBy: {
      type: String,
      required: [true, 'addedBy is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index on crmStatus — admin filters by this often
StartupSchema.index({ crmStatus: 1 })

const Startup: Model<IStartup> =
  mongoose.models.Startup ||
  mongoose.model<IStartup>('Startup', StartupSchema)

export default Startup
```

---

## 4.5 MongoDB — Important Query Patterns

### Log a new application

```typescript
import { connectMongo } from '@/lib/mongoose'
import Application from '@/models/Application'

await connectMongo()

const application = await Application.create({
  talentId,
  startupName,
  startupWebsite,
  role,
  source,
  appliedBy: session.user.id,
  status: 'APPLIED',
  notes,
  appliedAt: new Date(),
})
```

### Get all applications for one talent

```typescript
await connectMongo()

const applications = await Application.find({ talentId })
  .sort({ appliedAt: -1 })   // newest first
  .lean()                     // returns plain JS objects
                              // not Mongoose documents
                              // faster, use when not saving back
```

### Count applications this month (limit enforcement)

```typescript
await connectMongo()

const now = new Date()

// First day of current month at 00:00:00
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

// First day of next month at 00:00:00
// (MongoDB $lt is exclusive, so this captures the whole month)
const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

const count = await Application.countDocuments({
  talentId,
  appliedAt: {
    $gte: startOfMonth,
    $lt: startOfNextMonth,
  },
})
```

### Update application status

```typescript
await connectMongo()

const updated = await Application.findByIdAndUpdate(
  applicationId,
  {
    status: newStatus,
    updatedAt: new Date(),
  },
  { new: true }   // returns the updated document, not the old one
)

if (!updated) {
  // applicationId did not match any document
  return { error: 'Application not found' }
}
```

### Add a startup to CRM

```typescript
await connectMongo()

const startup = await Startup.create({
  name,
  website,
  country,
  fundingStage,
  source,
  crmStatus: 'NEW',
  addedBy: session.user.id,
  notes,
})
```

### Get all startups filtered by CRM status

```typescript
await connectMongo()

// Pass status as a query param from admin UI
// If no status filter, return all
const filter = status ? { crmStatus: status } : {}

const startups = await Startup.find(filter)
  .sort({ createdAt: -1 })
  .lean()
```

---

## 4.6 Data Rules — Read Before Writing Any Query

```
RULE 1: onDelete: Cascade
  When a User is deleted from PostgreSQL,
  all their related rows are deleted automatically:
  Profile, Subscription, Notifications,
  VerifyTokens, ResetTokens.
  This is already set in the Prisma schema.
  Do not manually delete related rows.

RULE 2: MongoDB data is NOT deleted when
  a User is deleted from PostgreSQL.
  Application logs are kept for record keeping.
  If a talent deletes their account, their
  application history stays in MongoDB.
  This is intentional.

RULE 3: resumeUrl in Profile is a FILE PATH
  NOT a full URL.
  Correct:   "clx123abc/1714000000000.pdf"
  Wrong:     "https://supabase.co/storage/..."
  To get a downloadable link, generate a
  signed URL in the API route. Never in the component.

RULE 4: Never store passwords in plain text
  Always hash with bcryptjs before saving.
  bcrypt.hash(password, 12)
  12 = salt rounds. Do not change this number.

RULE 5: Never return passwordHash to the client
  When a Prisma query returns a User, always
  exclude passwordHash before sending to frontend:

  const { passwordHash, ...safeUser } = user
  return Response.json(safeUser)

RULE 6: Plan limits are enforced server-side only
  Never trust the client to enforce limits.
  Always check the count in MongoDB inside
  the POST /api/applications route handler.

RULE 7: Notification messages are plain text only
  No HTML. No markdown. No emoji in MVP.
  Keep messages short — under 120 characters.
```

---

## 4.7 Database Setup Checklist

Run through this once before Sprint 1 starts.

```
SUPABASE (PostgreSQL)
  □ Project created at supabase.com
  □ DATABASE_URL (pooler, port 6543) copied to .env.local
  □ DIRECT_URL (direct, port 5432) copied to .env.local
  □ prisma/schema.prisma has both url and directUrl set
  □ npx prisma db push run successfully
  □ npx prisma generate run successfully
  □ npx prisma studio opened and tables are visible

MONGODB ATLAS
  □ Cluster created (M0 free tier)
  □ Database user created: admin / nMzq4xDwreQ0N3od
  □ Network access: 0.0.0.0/0 (allow all IPs — needed for Vercel)
  □ MONGODB_URI copied to .env.local
  □ Connection tested successfully

SUPABASE STORAGE
  □ Bucket named "resumes" created
  □ Bucket set to PRIVATE (not public)
  □ NEXT_PUBLIC_SUPABASE_URL in .env.local
  □ NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
  □ SUPABASE_SERVICE_ROLE_KEY in .env.local
```

---

## ✅ Section 4 Complete

**Next → Section 5: API Design**

Every API route, exact URL, method, request body, response shape, auth requirement, and error codes — ready to be built sprint by sprint.
