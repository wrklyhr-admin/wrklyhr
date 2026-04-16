# wrkly.hr — Product Knowledge Base
## Section 3 of 6: System Design & Data Flows

---

## 3.0 How to Read These Diagrams

Every flow follows this format:

```
USER ACTION
    │
    ▼
WHAT THE FRONTEND DOES
    │
    ▼
WHAT THE API DOES
    │
    ├── SUCCESS PATH ──► WHAT GETS WRITTEN TO DB ──► WHAT USER SEES
    │
    └── FAILURE PATH ──► WHAT ERROR IS RETURNED ──► WHAT USER SEES
```

Every database write is explicitly called out.
Every redirect is explicitly called out.
No assumptions.

---

## 3.1 Flow 1 — Signup

```
User fills signup form
(email, password, confirm password)
    │
    ▼
Frontend validates with zod:
  - email: valid email format
  - password: min 8 chars, 1 uppercase, 1 number
  - confirmPassword: must match password
    │
    ├── Validation fails
    │     └── Show inline errors, do not call API
    │
    └── Validation passes
          │
          ▼
        POST /api/auth/signup
        Body: { email, password }
          │
          ▼
        API checks: does email already exist?
        SELECT * FROM User WHERE email = ?
          │
          ├── Email exists
          │     └── Return 409
          │           └── Show: "An account with this email already exists"
          │
          └── Email is new
                │
                ▼
              Hash password with bcryptjs (12 rounds)
                │
                ▼
              WRITE to PostgreSQL:
                User table:
                  - id: auto generated (cuid)
                  - email: from form
                  - passwordHash: bcrypt hash
                  - role: TALENT (always, on signup)
                  - emailVerified: false
                  - createdAt: now
                │
                ▼
              WRITE to PostgreSQL:
                Subscription table:
                  - userId: new user's id
                  - plan: FREE
                  - status: active
                  - startDate: now
                │
                ▼
              Generate email verification token:
                - Random string: crypto.randomUUID()
                - Expires: 24 hours from now
                │
                ▼
              WRITE to PostgreSQL:
                VerifyToken table:
                  - userId: new user's id
                  - token: random UUID
                  - expiresAt: now + 24 hours
                │
                ▼
              Send email via Resend:
                To: user's email
                Subject: "Verify your wrkly.hr account"
                Body: Link → /auth/verify-email?token={token}
                │
                ▼
              Return 201: { success: true }
                │
                ▼
              Frontend redirects to:
                /auth/verify-email
                (static page that says "Check your email")
```

---

## 3.2 Flow 2 — Email Verification

```
User receives email, clicks verify link
Link format: /auth/verify-email?token=abc-123-xyz
    │
    ▼
Page loads, reads token from URL query param
    │
    ▼
GET /api/auth/verify-email?token=abc-123-xyz
    │
    ▼
API looks up token in PostgreSQL:
  SELECT * FROM VerifyToken WHERE token = ?
    │
    ├── Token not found
    │     └── Return 400
    │           └── Show: "This link is invalid"
    │
    ├── Token found but expired (expiresAt < now)
    │     └── DELETE token from VerifyToken table
    │           └── Return 400
    │                 └── Show: "This link has expired"
    │                     + Button: "Resend verification email"
    │
    └── Token valid
          │
          ▼
        UPDATE PostgreSQL:
          User table:
            - emailVerified: true
          │
          ▼
        DELETE from PostgreSQL:
          VerifyToken table:
            - remove this token (one-time use)
          │
          ▼
        Return 200: { success: true }
          │
          ▼
        Frontend redirects to:
          /auth/login
          With message: "Email verified! Please log in."
```

---

## 3.3 Flow 3 — Login

```
User fills login form (email, password)
    │
    ▼
Frontend validates with zod:
  - email: valid format
  - password: not empty
    │
    ├── Validation fails → show inline errors
    │
    └── Validation passes
          │
          ▼
        NextAuth signIn('credentials', { email, password })
          │
          ▼
        NextAuth calls our authorize() function in lib/auth.ts:
          │
          ▼
        Look up user in PostgreSQL:
          SELECT * FROM User WHERE email = ?
            │
            ├── User not found
            │     └── Return null → NextAuth returns error
            │           └── Show: "Invalid email or password"
            │
            └── User found
                  │
                  ▼
                Compare password with bcryptjs:
                  bcrypt.compare(inputPassword, user.passwordHash)
                    │
                    ├── Password wrong
                    │     └── Return null → NextAuth returns error
                    │           └── Show: "Invalid email or password"
                    │           NOTE: Never say "wrong password" specifically
                    │                 Security best practice
                    │
                    └── Password correct
                          │
                          ▼
                        Check emailVerified:
                            │
                            ├── false
                            │     └── Return error
                            │           └── Show: "Please verify your email first"
                            │               + Button: "Resend verification email"
                            │
                            └── true
                                  │
                                  ▼
                                NextAuth creates JWT session:
                                  Stored in HTTP-only cookie
                                  Contains: { id, email, role }
                                  Expires: 30 days
                                  │
                                  ▼
                                Check user role:
                                    │
                                    ├── role is TALENT
                                    │     └── Redirect to /onboarding
                                    │         IF profile not complete
                                    │         ELSE redirect to /dashboard
                                    │
                                    └── role is SUPER_ADMIN
                                        or PLACEMENT_MANAGER
                                          └── Redirect to /admin/dashboard
```

---

## 3.4 Flow 4 — Password Reset

```
User clicks "Forgot password" on login page
    │
    ▼
User enters their email address
    │
    ▼
POST /api/auth/forgot-password
Body: { email }
    │
    ▼
API looks up email in PostgreSQL:
  SELECT * FROM User WHERE email = ?
    │
    ├── Email not found
    │     └── Return 200 anyway (do not reveal if email exists)
    │           └── Show: "If this email exists, a reset link was sent"
    │
    └── Email found
          │
          ▼
        Generate reset token:
          - Random string: crypto.randomUUID()
          - Expires: 1 hour from now
          │
          ▼
        WRITE to PostgreSQL:
          ResetToken table:
            - userId: user's id
            - token: random UUID
            - expiresAt: now + 1 hour
          │
          ▼
        Send email via Resend:
          Subject: "Reset your wrkly.hr password"
          Body: Link → /auth/reset-password?token={token}
          │
          ▼
        Return 200
          └── Show: "If this email exists, a reset link was sent"

─────────────────────────────────────────────────────────────

User clicks link in email
Link: /auth/reset-password?token=abc-123
    │
    ▼
Page loads reset form (new password, confirm password)
    │
    ▼
User submits new password
    │
    ▼
POST /api/auth/reset-password
Body: { token, newPassword }
    │
    ▼
API validates token (same as email verify flow):
  - Not found → 400 "Invalid link"
  - Expired   → 400 "Link expired, request a new one"
  - Valid     →
                │
                ▼
              Hash new password with bcryptjs
                │
                ▼
              UPDATE PostgreSQL:
                User table:
                  - passwordHash: new hash
                │
                ▼
              DELETE from PostgreSQL:
                ResetToken table:
                  - remove this token
                │
                ▼
              Return 200
                └── Frontend redirects to /auth/login
                    With message: "Password updated. Please log in."
```

---

## 3.5 Flow 5 — Talent Onboarding (Profile Builder)

```
Triggered when:
  - Talent logs in for the first time
  - Profile completionPct is 0

Redirect: /onboarding

The form has 4 steps.
Each step saves to the same Profile record.
User can go back and forward between steps.
Data is saved to the DB only on final submit.
(Do not save after each step — keep it simple for MVP)

─────────────────────────────────────────────────────────

STEP 1 — Personal Info
Fields:
  - Full name (required, text)
  - Location (required, text, e.g. "Kolkata, India")
  - Timezone (required, dropdown)
    Options: IST, GMT, EST, PST, CET (5 options only)
  - LinkedIn URL (optional, must start with linkedin.com)

STEP 2 — Professional Info
Fields:
  - Role type (required, single select)
    Options: Software Engineer, DevOps Engineer
  - Years of experience (required, single select)
    Options: 0-1, 1-3, 3-5, 5-10, 10+
  - Skills (required, multi-select tags)
    SDE options:   React, Next.js, Node.js, Python,
                   TypeScript, Java, Go, PostgreSQL,
                   MongoDB, AWS, Docker
    DevOps options: AWS, GCP, Azure, Docker, Kubernetes,
                   Terraform, CI/CD, Linux, Ansible,
                   Prometheus, Grafana

STEP 3 — Availability & Rate
Fields:
  - Availability (required, single select)
    Options: Hourly, Contract, Both
  - Preferred rate in USD/hr (required, number input)
    Min: $5, Max: $200
  - Available weekly hours (required, single select)
    Options: 10hrs, 20hrs, 40hrs (full time)
  - Available from (required, date picker)
    Default: today

STEP 4 — Resume Upload
Fields:
  - PDF file upload (required)
  - Max size: 5MB
  - Only .pdf accepted (validate on frontend AND backend)

─────────────────────────────────────────────────────────

On final submit (Step 4 complete):

  1. Frontend uploads PDF to Supabase Storage:
       Path: {userId}/{timestamp}.pdf
       Bucket: resumes (private)
       Returns: file path (not a public URL)

  2. POST /api/profile
     Body: { all fields from steps 1-4, resumePath }

  3. API receives request:
       - Validate session (must be logged in)
       - Validate all fields with zod
         │
         ▼
       WRITE to PostgreSQL:
         Profile table:
           - userId: from session
           - fullName, location, timezone, linkedInUrl
           - skills: array of strings
           - experienceYears: number
           - roleType: string
           - availability: string
           - rateUsd: number
           - weeklyHours: number
           - resumeUrl: Supabase file path
           - completionPct: 100
           - createdAt: now
         │
         ▼
       Return 201: { success: true }
         │
         ▼
       Frontend redirects to /plans
       (talent picks a plan after onboarding)
```

---

## 3.6 Flow 6 — Plan Selection & Payment

```
User lands on /plans after onboarding
Page shows 4 plan cards: Free, Starter, Growth, Pro

─────────────────────────────────────────────────────────

PATH A — User selects FREE plan

  User clicks "Continue with Free"
      │
      ▼
  POST /api/subscriptions
  Body: { plan: "FREE" }
      │
      ▼
  API checks: does Subscription row exist for this user?
      │
      ├── Yes → UPDATE plan to FREE, status to active
      │
      └── No  → CREATE new Subscription row
                  plan: FREE
                  status: active
                  razorpayId: null
      │
      ▼
  Return 200
      │
      ▼
  Frontend redirects to /dashboard
  Show: "Welcome! You're on the Free plan."

─────────────────────────────────────────────────────────

PATH B — User selects PAID plan (Starter/Growth/Pro)

  User clicks "Get Starter" (or Growth or Pro)
      │
      ▼
  POST /api/subscriptions/create-order
  Body: { plan: "STARTER" }
      │
      ▼
  API creates Razorpay order:
    razorpay.orders.create({
      amount: 49900,   ← in paise (₹499 × 100)
      currency: "INR"
    })
    Returns: { orderId: "order_xyz" }
      │
      ▼
  Return 200: { orderId, amount, currency }
      │
      ▼
  Frontend opens Razorpay checkout popup
  (uses NEXT_PUBLIC_RAZORPAY_KEY_ID)
      │
      ▼
  User completes payment in popup
      │
      ├── User closes popup / payment fails
      │     └── Show: "Payment was not completed. Try again."
      │           No DB changes made.
      │
      └── Payment succeeds
            │
            ▼
          Razorpay returns to frontend:
            { razorpay_payment_id, razorpay_order_id,
              razorpay_signature }
            │
            ▼
          POST /api/subscriptions/verify
          Body: { razorpay_payment_id, razorpay_order_id,
                  razorpay_signature, plan }
            │
            ▼
          API verifies signature:
            (proves payment is real, not tampered)
            Using RAZORPAY_KEY_SECRET
              │
              ├── Signature invalid
              │     └── Return 400 "Payment verification failed"
              │           └── Show error, do not update DB
              │
              └── Signature valid
                    │
                    ▼
                  UPDATE PostgreSQL:
                    Subscription table:
                      - plan: STARTER (or GROWTH or PRO)
                      - status: active
                      - razorpayId: razorpay_payment_id
                      - startDate: now
                      - endDate: now + 30 days
                    │
                    ▼
                  Return 200
                    │
                    ▼
                  Frontend redirects to /dashboard
                  Show: "You're now on the Starter plan 🎉"
```

---

## 3.7 Flow 7 — Admin Logs an Application

This is the core daily operation our team performs.

```
Admin is on /admin/talent/[talentId] page
  (viewing a specific talent's profile)
Admin clicks "Log Application" button
    │
    ▼
Modal opens with form:
  Fields:
    - Startup name (required, text)
    - Startup website (optional, URL)
    - Role applied for (required, text)
    - Source (required, select)
      Options: Crunchbase, LinkedIn, YC, AngelList,
               Sequoia, Direct, Other
    - Date applied (required, date — default today)
    - Notes (optional, textarea)
    │
    ▼
Admin submits form
    │
    ▼
POST /api/applications
Body: { talentId, startupName, startupWebsite,
        role, source, appliedAt, notes }
    │
    ▼
API checks:
  - Session exists
  - Role is SUPER_ADMIN or PLACEMENT_MANAGER
  - talentId exists in PostgreSQL User table
    │
    ├── Any check fails → return 401 or 404
    │
    └── All checks pass
          │
          ▼
        await connectMongo()
          │
          ▼
        WRITE to MongoDB:
          applications collection:
            - talentId: from body
            - startupName: from body
            - startupWebsite: from body
            - role: from body
            - source: from body
            - appliedBy: admin's id (from session)
            - status: APPLIED
            - notes: from body
            - appliedAt: from body
            - updatedAt: now
          │
          ▼
        Check: does this talent have a subscription?
          SELECT * FROM Subscription WHERE userId = talentId
          Get their plan → check monthly application limit
          Count applications this month for this talent
          │
          ▼
        WRITE to PostgreSQL:
          Notification table:
            - userId: talentId
            - message: "We applied on your behalf at {startupName}
                        for the role of {role}"
            - read: false
            - createdAt: now
          │
          ▼
        Send email via Resend:
          To: talent's email
          Subject: "We applied on your behalf at {startupName}"
          Body: startup name, role, date, what happens next
          (only if talent plan is STARTER or above)
          │
          ▼
        Return 201: { success: true, applicationId }
          │
          ▼
        Modal closes, table refreshes
        Show: "Application logged ✅"
```

---

## 3.8 Flow 8 — Admin Updates Application Status

```
Admin is on /admin/applications page
Admin finds an application row in the table
Admin changes status dropdown:
  Options: APPLIED → INTERVIEWING → PLACED → REJECTED
    │
    ▼
PATCH /api/applications/[applicationId]
Body: { status: "INTERVIEWING" }
    │
    ▼
API checks:
  - Session exists
  - Role is SUPER_ADMIN or PLACEMENT_MANAGER
    │
    ▼
await connectMongo()
    │
    ▼
UPDATE MongoDB:
  applications collection:
    - status: new status
    - updatedAt: now
    │
    ▼
WRITE to PostgreSQL:
  Notification table:
    - userId: talentId (from application record)
    - message: depends on new status:
        INTERVIEWING → "You have an interview opportunity
                        at {startupName}! Check your email."
        PLACED       → "Congratulations! You've been placed
                        at {startupName} 🎉"
        REJECTED     → "An update on your application
                        at {startupName}."
    - read: false
    │
    ▼
Send email via Resend:
  To: talent's email
  Subject & body depends on status (same messages as above)
  (only if plan is STARTER or above)
    │
    ▼
Return 200: { success: true }
    │
    ▼
Table row updates in UI instantly
```

---

## 3.9 Flow 9 — Talent Views Dashboard

```
Talent navigates to /dashboard
    │
    ▼
middleware.ts runs:
  - Checks session cookie
  - No session → redirect to /auth/login
  - Has session, role is TALENT → allow through
    │
    ▼
Page loads (server component)
Makes 3 parallel data fetches:

  Fetch 1: GET /api/profile
    SELECT * FROM Profile WHERE userId = session.id
    Returns: profile data

  Fetch 2: GET /api/subscriptions
    SELECT * FROM Subscription WHERE userId = session.id
    Returns: current plan, status, endDate

  Fetch 3: GET /api/applications?talentId={id}
    await connectMongo()
    Find all applications WHERE talentId = session.id
    Sort by appliedAt descending
    Returns: list of applications
    │
    ▼
Page renders:
  ┌─────────────────────────────────────────┐
  │  Hi {fullName} 👋                       │
  │  Current Plan: Starter  [Upgrade]       │
  ├─────────────────────────────────────────┤
  │  Applications This Month: 3 / 8        │
  ├─────────────────────────────────────────┤
  │  APPLICATION TRACKER                    │
  │  ┌──────────┬───────────┬────────────┐  │
  │  │ Startup  │ Role      │ Status     │  │
  │  ├──────────┼───────────┼────────────┤  │
  │  │ XYZ Inc  │ SDE       │ APPLIED    │  │
  │  │ ABC Corp │ DevOps    │ INTERVIEW  │  │
  │  └──────────┴───────────┴────────────┘  │
  ├─────────────────────────────────────────┤
  │  🔔 2 unread notifications              │
  └─────────────────────────────────────────┘
```

---

## 3.10 Flow 10 — Admin Team Management

```
INVITE A TEAM MEMBER (Super Admin only)

Super Admin goes to /admin/team
Clicks "Invite Member"
Fills form: { email, role: PLACEMENT_MANAGER }
    │
    ▼
POST /api/team/invite
Body: { email, role }
    │
    ▼
API checks:
  - Session exists
  - Role is SUPER_ADMIN (only super admin can invite)
    │
    ├── Not super admin → return 403 Forbidden
    │
    └── Is super admin
          │
          ▼
        Check: does email already have an account?
          SELECT * FROM User WHERE email = ?
            │
            ├── Already exists → Return 409
            │     └── Show: "This email already has an account"
            │
            └── Does not exist
                  │
                  ▼
                WRITE to PostgreSQL:
                  User table:
                    - email: from form
                    - passwordHash: temporary random hash
                    - role: PLACEMENT_MANAGER
                    - emailVerified: false
                  │
                  ▼
                Generate invite token (same as verify token)
                  WRITE to PostgreSQL:
                    VerifyToken table (reuse for invite)
                  │
                  ▼
                Send email via Resend:
                  Subject: "You've been invited to wrkly.hr"
                  Body: Link to set their password
                        /auth/accept-invite?token={token}
                  │
                  ▼
                Return 201
                  └── Show: "Invite sent to {email}"

─────────────────────────────────────────────────────────

REVOKE ACCESS (Super Admin only)

Super Admin clicks "Revoke" next to a team member
    │
    ▼
DELETE /api/team/[userId]
    │
    ▼
API checks role is SUPER_ADMIN
    │
    ▼
DELETE from PostgreSQL:
  User table: remove this user
  (their application logs in MongoDB remain
   for record keeping — do not delete those)
    │
    ▼
Return 200
  └── Member removed from team list
```

---

## 3.11 Application Limit Enforcement

This runs every time an admin tries to log an application.

```
Plan limits:
  FREE     → 2  applications per calendar month
  STARTER  → 8  applications per calendar month
  GROWTH   → 20 applications per calendar month
  PRO      → unlimited

Check logic (inside POST /api/applications):

  1. Get talent's current plan from PostgreSQL
       SELECT plan FROM Subscription WHERE userId = talentId

  2. If plan is PRO → skip limit check, allow

  3. Otherwise count this month's applications from MongoDB:
       db.applications.countDocuments({
         talentId: talentId,
         appliedAt: {
           $gte: first day of current month,
           $lte: last day of current month
         }
       })

  4. Compare count to limit:
       FREE:    count >= 2  → return 429
       STARTER: count >= 8  → return 429
       GROWTH:  count >= 20 → return 429

  5. On 429 response:
       Admin sees: "This talent has reached their
                    monthly limit ({plan} plan: {limit} apps).
                    They need to upgrade to log more."

  6. The talent is NOT notified about this limit
     (it's an internal admin check)
```

---

## 3.12 PostgreSQL Tables Summary

Every table that needs to exist before Sprint 1 starts.

```
┌─────────────────────────────────────────────────────────┐
│  TABLE: User                                            │
├─────────────────┬───────────────┬───────────────────────┤
│  id             │ String (cuid) │ Primary key           │
│  email          │ String        │ Unique                │
│  passwordHash   │ String        │ bcrypt hash           │
│  role           │ Enum          │ TALENT / SUPER_ADMIN  │
│                 │               │ PLACEMENT_MANAGER     │
│  emailVerified  │ Boolean       │ Default: false        │
│  createdAt      │ DateTime      │ Default: now          │
│  updatedAt      │ DateTime      │ Auto-updated          │
└─────────────────┴───────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TABLE: Profile                                         │
├─────────────────┬───────────────┬───────────────────────┤
│  id             │ String (cuid) │ Primary key           │
│  userId         │ String        │ FK → User.id, unique  │
│  fullName       │ String        │                       │
│  location       │ String?       │ Nullable              │
│  timezone       │ String?       │ Nullable              │
│  linkedInUrl    │ String?       │ Nullable              │
│  skills         │ String[]      │ Array of strings      │
│  experienceYears│ Int?          │ Nullable              │
│  roleType       │ String?       │ Nullable              │
│  availability   │ String?       │ hourly/contract/both  │
│  rateUsd        │ Float?        │ Nullable              │
│  weeklyHours    │ Int?          │ Nullable              │
│  resumeUrl      │ String?       │ Supabase file path    │
│  completionPct  │ Int           │ Default: 0            │
│  createdAt      │ DateTime      │ Default: now          │
│  updatedAt      │ DateTime      │ Auto-updated          │
└─────────────────┴───────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TABLE: Subscription                                    │
├─────────────────┬───────────────┬───────────────────────┤
│  id             │ String (cuid) │ Primary key           │
│  userId         │ String        │ FK → User.id, unique  │
│  plan           │ Enum          │ FREE/STARTER/GROWTH   │
│                 │               │ PRO                   │
│  status         │ String        │ active/cancelled      │
│  razorpayId     │ String?       │ Nullable              │
│  startDate      │ DateTime      │ Default: now          │
│  endDate        │ DateTime?     │ Nullable (Free = null)│
│  createdAt      │ DateTime      │ Default: now          │
│  updatedAt      │ DateTime      │ Auto-updated          │
└─────────────────┴───────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TABLE: Notification                                    │
├─────────────────┬───────────────┬───────────────────────┤
│  id             │ String (cuid) │ Primary key           │
│  userId         │ String        │ FK → User.id          │
│  message        │ String        │                       │
│  read           │ Boolean       │ Default: false        │
│  createdAt      │ DateTime      │ Default: now          │
└─────────────────┴───────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TABLE: VerifyToken                                     │
├─────────────────┬───────────────┬───────────────────────┤
│  id             │ String (cuid) │ Primary key           │
│  userId         │ String        │ FK → User.id          │
│  token          │ String        │ Unique, UUID          │
│  expiresAt      │ DateTime      │                       │
│  createdAt      │ DateTime      │ Default: now          │
└─────────────────┴───────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TABLE: ResetToken                                      │
├─────────────────┬───────────────┬───────────────────────┤
│  id             │ String (cuid) │ Primary key           │
│  userId         │ String        │ FK → User.id          │
│  token          │ String        │ Unique, UUID          │
│  expiresAt      │ DateTime      │                       │
│  createdAt      │ DateTime      │ Default: now          │
└─────────────────┴───────────────┴───────────────────────┘
```

---

## 3.13 MongoDB Collections Summary

```
┌─────────────────────────────────────────────────────────┐
│  COLLECTION: applications                               │
├─────────────────┬───────────────┬───────────────────────┤
│  _id            │ ObjectId      │ Auto generated        │
│  talentId       │ String        │ Postgres User.id      │
│  startupName    │ String        │ Required              │
│  startupWebsite │ String        │ Optional              │
│  role           │ String        │ Required              │
│  source         │ String        │ Required              │
│  appliedBy      │ String        │ Admin's Postgres id   │
│  status         │ String        │ APPLIED/INTERVIEWING  │
│                 │               │ PLACED/REJECTED       │
│  notes          │ String        │ Optional              │
│  appliedAt      │ Date          │ Required              │
│  updatedAt      │ Date          │ Auto-updated          │
└─────────────────┴───────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  COLLECTION: startups                                   │
├─────────────────┬───────────────┬───────────────────────┤
│  _id            │ ObjectId      │ Auto generated        │
│  name           │ String        │ Required              │
│  website        │ String        │ Optional              │
│  country        │ String        │ Optional              │
│  fundingStage   │ String        │ Seed/Series A/B       │
│  source         │ String        │ Crunchbase/YC etc.    │
│  crmStatus      │ String        │ NEW/CONTACTED/        │
│                 │               │ RESPONDED/HIRED/      │
│                 │               │ REJECTED              │
│  addedBy        │ String        │ Admin's Postgres id   │
│  notes          │ String        │ Optional              │
│  createdAt      │ Date          │ Auto                  │
│  updatedAt      │ Date          │ Auto                  │
└─────────────────┴───────────────┴───────────────────────┘
```

---

## ✅ Section 3 Complete

**Next → Section 4: Database Design**

Full Prisma schema, full Mongoose models, indexes, and every rule about how data is stored — ready to copy directly into the codebase.
