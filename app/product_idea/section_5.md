# wrkly.hr — Product Knowledge Base
## Section 5 of 6: API Design

---

## 5.0 Rules Every Replit Agent Must Follow

```
RULE 1: All API routes live in app/api/
        Every route file is named route.ts
        Example: app/api/profile/route.ts

RULE 2: Every route handler checks the session FIRST
        before doing anything else.
        If no session → return 401 immediately.
        If wrong role → return 403 immediately.

RULE 3: Every request body is validated with zod
        before touching the database.
        If validation fails → return 400 with
        exact field errors.

RULE 4: Never return passwordHash to the client.
        Always destructure it out before returning.

RULE 5: Every route returns a consistent shape:
        Success: { success: true, data: {...} }
        Error:   { success: false, error: "message" }

RULE 6: Use correct HTTP status codes always:
        200 → OK (GET, PATCH, DELETE success)
        201 → Created (POST success)
        400 → Bad request (validation failed)
        401 → Not logged in
        403 → Logged in but wrong role
        404 → Resource not found
        409 → Conflict (duplicate email etc.)
        429 → Too many requests (plan limit hit)
        500 → Unexpected server error

RULE 7: Every 500 error must console.error the
        actual error for debugging on Vercel logs.
        Never swallow errors silently.

RULE 8: API routes that use MongoDB must call
        await connectMongo() as the very first
        line inside the handler, before any query.
```

---

## 5.1 How Every Route Handler is Structured

This is the exact template. Every route follows this pattern.

```typescript
// app/api/example/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Step 1: Define the validation schema
const bodySchema = z.object({
  fieldName: z.string().min(1, 'Field is required'),
})

export async function POST(req: NextRequest) {
  try {
    // Step 2: Check session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Step 3: Check role if needed
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Step 4: Parse and validate body
    const body = await req.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Step 5: Do the database work
    const result = await prisma.someTable.create({
      data: { ...parsed.data }
    })

    // Step 6: Return success
    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    )

  } catch (error) {
    // Step 7: Catch unexpected errors
    console.error('[POST /api/example]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 5.2 Auth Routes

### POST /api/auth/signup

```
Purpose:    Create a new talent account
Auth:       None (public route)
Used by:    Signup page (/auth/page.tsx)

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "email":           string, required, valid email format
  "password":        string, required, min 8 chars,
                     must contain 1 uppercase + 1 number
  "confirmPassword": string, required, must equal password
}

─────────────────────────────────────────────────
ZOD SCHEMA
─────────────────────────────────────────────────
const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Must contain at least 1 number'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
)

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Validate body with zod
2. Check if email exists in User table
3. If exists → 409
4. Hash password: bcrypt.hash(password, 12)
5. Create User + Subscription in a transaction
6. Create VerifyToken (expires 24hrs)
7. Send verification email via Resend
8. Return 201

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
201: { success: true, data: { message: "Verification email sent" } }
400: { success: false, error: { fieldErrors } }
409: { success: false, error: "Email already in use" }
500: { success: false, error: "Internal server error" }
```

---

### GET /api/auth/verify-email

```
Purpose:    Verify a user's email using token from URL
Auth:       None (public route)
Used by:    /auth/verify-email?token=xxx page

─────────────────────────────────────────────────
QUERY PARAMS
─────────────────────────────────────────────────
token: string, required

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Read token from URL: req.nextUrl.searchParams.get('token')
2. Find VerifyToken WHERE token = ?
3. If not found → 400 "Invalid link"
4. If expired (expiresAt < now) → delete token → 400 "Link expired"
5. Set User.emailVerified = true
6. Delete the VerifyToken row
7. Return 200

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { message: "Email verified" } }
400: { success: false, error: "Invalid link" }
400: { success: false, error: "Link has expired" }
500: { success: false, error: "Internal server error" }
```

---

### POST /api/auth/forgot-password

```
Purpose:    Request a password reset email
Auth:       None (public route)
Used by:    Login page "Forgot password" link

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "email": string, required, valid email format
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Validate email with zod
2. Look up User WHERE email = ?
3. Whether or not user exists → always return 200
   (never reveal if email is registered)
4. If user exists:
   - Create ResetToken (expires 1hr)
   - Send reset email via Resend
5. Return 200

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { message: "If this email exists, a reset link was sent" } }
500: { success: false, error: "Internal server error" }
```

---

### POST /api/auth/reset-password

```
Purpose:    Set a new password using reset token
Auth:       None (public route)
Used by:    /auth/reset-password?token=xxx page

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "token":       string, required
  "newPassword": string, required, same rules as signup
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Validate body with zod
2. Find ResetToken WHERE token = ?
3. If not found → 400 "Invalid link"
4. If expired → delete token → 400 "Link has expired"
5. Hash new password: bcrypt.hash(newPassword, 12)
6. Update User.passwordHash
7. Delete the ResetToken row
8. Return 200

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { message: "Password updated" } }
400: { success: false, error: "Invalid link" }
400: { success: false, error: "Link has expired" }
500: { success: false, error: "Internal server error" }
```

---

### POST /api/auth/resend-verification

```
Purpose:    Resend the email verification link
Auth:       None (public route)
Used by:    Verify email page "Resend" button

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "email": string, required
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Find User WHERE email = ?
2. If not found → 200 (do not reveal if email exists)
3. If emailVerified is already true → 200 "Already verified"
4. Delete any existing VerifyToken for this user
5. Create new VerifyToken (expires 24hrs)
6. Send verification email via Resend
7. Return 200

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { message: "Verification email sent" } }
500: { success: false, error: "Internal server error" }
```

---

## 5.3 Profile Routes

### POST /api/profile

```
Purpose:    Create or update talent profile (onboarding)
Auth:       Required — TALENT role only
Used by:    /onboarding page (final step submit)

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "fullName":        string, required, min 2 chars
  "location":        string, required
  "timezone":        string, required,
                     enum: ["IST","GMT","EST","PST","CET"]
  "linkedInUrl":     string, optional,
                     must start with "linkedin.com" if provided
  "skills":          string[], required, min 1 skill
  "experienceYears": number, required, min 0 max 40
  "roleType":        string, required,
                     enum: ["Software Engineer","DevOps Engineer"]
  "availability":    string, required,
                     enum: ["hourly","contract","both"]
  "rateUsd":         number, required, min 5 max 200
  "weeklyHours":     number, required,
                     enum: [10, 20, 40]
  "resumeUrl":       string, required
                     (Supabase file path from upload step)
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. Validate body with zod
3. Upsert Profile:
   - If Profile exists for userId → update all fields
   - If not → create new row
4. Set completionPct: 100
5. Return 201

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
201: { success: true, data: { profile } }
400: { success: false, error: { fieldErrors } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
500: { success: false, error: "Internal server error" }
```

---

### GET /api/profile

```
Purpose:    Get the logged-in talent's own profile
Auth:       Required — TALENT role only
Used by:    /dashboard, /profile edit page

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. Find Profile WHERE userId = session.user.id
3. If not found → 404
4. Return profile

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { profile } }
401: { success: false, error: "Not authenticated" }
404: { success: false, error: "Profile not found" }
500: { success: false, error: "Internal server error" }
```

---

## 5.4 Resume Routes

### POST /api/resume

```
Purpose:    Upload a resume PDF to Supabase Storage
Auth:       Required — TALENT role only
Used by:    /onboarding Step 4

─────────────────────────────────────────────────
REQUEST
─────────────────────────────────────────────────
Content-Type: multipart/form-data
Body: FormData with field "resume" containing the PDF file

─────────────────────────────────────────────────
VALIDATION
─────────────────────────────────────────────────
- File must exist
- File type must be "application/pdf"
- File size must be under 5MB (5 * 1024 * 1024 bytes)

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. Parse FormData: const formData = await req.formData()
3. Get file: const file = formData.get('resume') as File
4. Validate file type and size
5. Convert file to buffer:
   const buffer = Buffer.from(await file.arrayBuffer())
6. Generate file path:
   const path = `${session.user.id}/${Date.now()}.pdf`
7. Upload to Supabase Storage using supabaseAdmin client:
   supabaseAdmin.storage
     .from('resumes')
     .upload(path, buffer, { contentType: 'application/pdf' })
8. If upload fails → 500
9. Return the file path (NOT a signed URL)

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
201: { success: true, data: { resumeUrl: "userId/timestamp.pdf" } }
400: { success: false, error: "Only PDF files are allowed" }
400: { success: false, error: "File size must be under 5MB" }
401: { success: false, error: "Not authenticated" }
500: { success: false, error: "Upload failed" }
```

---

### GET /api/resume/[userId]

```
Purpose:    Generate a signed download URL for a resume
Auth:       Required
            TALENT: can only get their own resume
            SUPER_ADMIN / PLACEMENT_MANAGER: can get any
Used by:    Admin talent detail page, talent dashboard

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session
2. If TALENT and userId !== session.user.id → 403
3. Find Profile WHERE userId = userId
4. If no profile or no resumeUrl → 404
5. Generate signed URL (expires in 60 minutes):
   supabaseAdmin.storage
     .from('resumes')
     .createSignedUrl(profile.resumeUrl, 3600)
6. Return signed URL

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { signedUrl: "https://..." } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
404: { success: false, error: "Resume not found" }
500: { success: false, error: "Internal server error" }
```

---

## 5.5 Subscription Routes

### GET /api/subscriptions

```
Purpose:    Get current plan for logged-in talent
Auth:       Required — TALENT role only
Used by:    /dashboard, /plans page

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. Find Subscription WHERE userId = session.user.id
3. Return subscription

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { subscription } }
401: { success: false, error: "Not authenticated" }
404: { success: false, error: "Subscription not found" }
500: { success: false, error: "Internal server error" }
```

---

### POST /api/subscriptions

```
Purpose:    Activate the FREE plan (no payment needed)
Auth:       Required — TALENT role only
Used by:    /plans page "Continue with Free" button

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "plan": "FREE"    ← only FREE is accepted here
                       paid plans use /create-order
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. Validate plan = "FREE"
3. Upsert Subscription:
   plan: FREE, status: active,
   razorpayId: null, endDate: null
4. Return 200

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { subscription } }
400: { success: false, error: "Invalid plan" }
401: { success: false, error: "Not authenticated" }
500: { success: false, error: "Internal server error" }
```

---

### POST /api/subscriptions/create-order

```
Purpose:    Create a Razorpay order for a paid plan
Auth:       Required — TALENT role only
Used by:    /plans page when paid plan is selected

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "plan": string, required, enum: ["STARTER","GROWTH","PRO"]
}

─────────────────────────────────────────────────
PLAN AMOUNTS (in paise — 1 INR = 100 paise)
─────────────────────────────────────────────────
STARTER → 49900   (₹499)
GROWTH  → 99900   (₹999)
PRO     → 199900  (₹1999)

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. Validate plan is one of STARTER, GROWTH, PRO
3. Map plan to amount in paise
4. Create Razorpay order:
   razorpay.orders.create({ amount, currency: "INR" })
5. Return orderId and amount

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { orderId, amount, currency: "INR" } }
400: { success: false, error: "Invalid plan" }
401: { success: false, error: "Not authenticated" }
500: { success: false, error: "Failed to create order" }
```

---

### POST /api/subscriptions/verify

```
Purpose:    Verify Razorpay payment and activate plan
Auth:       Required — TALENT role only
Used by:    /plans page after Razorpay checkout succeeds

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "razorpay_payment_id": string, required
  "razorpay_order_id":   string, required
  "razorpay_signature":  string, required
  "plan":                string, required,
                         enum: ["STARTER","GROWTH","PRO"]
}

─────────────────────────────────────────────────
SIGNATURE VERIFICATION
─────────────────────────────────────────────────
Razorpay signs payments using HMAC-SHA256.
We verify it like this:

import crypto from 'crypto'

const body = razorpay_order_id + "|" + razorpay_payment_id
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  .update(body)
  .digest('hex')

const isValid = expectedSignature === razorpay_signature

If isValid is false → payment is tampered → reject it.

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. Validate body with zod
3. Verify Razorpay signature (above)
4. If invalid → 400
5. Update Subscription:
   plan, status: active, razorpayId: payment_id
   startDate: now, endDate: now + 30 days
6. Return 200

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { subscription } }
400: { success: false, error: "Payment verification failed" }
401: { success: false, error: "Not authenticated" }
500: { success: false, error: "Internal server error" }
```

---

## 5.6 Application Routes

### POST /api/applications

```
Purpose:    Log a new application on behalf of a talent
Auth:       Required — SUPER_ADMIN or PLACEMENT_MANAGER
Used by:    Admin talent detail page

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "talentId":       string, required
  "startupName":    string, required, min 1 char
  "startupWebsite": string, optional, valid URL if provided
  "role":           string, required, min 1 char
  "source":         string, required,
                    enum: ["Crunchbase","LinkedIn","YC",
                           "AngelList","Sequoia","Direct","Other"]
  "appliedAt":      string, required, valid ISO date string
  "notes":          string, optional
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be SUPER_ADMIN or PLACEMENT_MANAGER
2. Validate body with zod
3. Verify talentId exists in PostgreSQL User table
4. Get talent's subscription plan
5. Count applications this month for talent in MongoDB
6. Check against plan limit:
   FREE: 2, STARTER: 8, GROWTH: 20, PRO: unlimited
7. If limit hit → 429
8. await connectMongo()
9. Create Application document in MongoDB
10. Create Notification in PostgreSQL
11. If plan is STARTER or above → send email via Resend
12. Return 201

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
201: { success: true, data: { applicationId } }
400: { success: false, error: { fieldErrors } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
404: { success: false, error: "Talent not found" }
429: { success: false, error: "Monthly application limit reached for this talent's plan" }
500: { success: false, error: "Internal server error" }
```

---

### GET /api/applications

```
Purpose:    Get applications list
Auth:       Required
            TALENT: returns only their own applications
            ADMIN: must pass talentId as query param
Used by:    Talent dashboard, Admin application log page

─────────────────────────────────────────────────
QUERY PARAMS
─────────────────────────────────────────────────
talentId: string, required only for ADMIN role

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session
2. Determine talentId:
   - TALENT → use session.user.id
   - ADMIN  → use talentId from query param
3. await connectMongo()
4. Find all Applications WHERE talentId = ?
   Sort: appliedAt descending
5. Return list

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { applications: [...] } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
500: { success: false, error: "Internal server error" }
```

---

### PATCH /api/applications/[applicationId]

```
Purpose:    Update status of an application
Auth:       Required — SUPER_ADMIN or PLACEMENT_MANAGER
Used by:    Admin applications page status dropdown

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "status": string, required,
            enum: ["APPLIED","INTERVIEWING","PLACED","REJECTED"]
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be admin role
2. Validate body with zod
3. await connectMongo()
4. Find application by applicationId
5. If not found → 404
6. Update status and updatedAt in MongoDB
7. Create Notification in PostgreSQL for the talent
8. If talent plan is STARTER or above → send email via Resend
9. Return updated application

─────────────────────────────────────────────────
NOTIFICATION MESSAGES BY STATUS
─────────────────────────────────────────────────
INTERVIEWING: "You have an interview opportunity at {startupName}"
PLACED:       "Congratulations! You have been placed at {startupName}"
REJECTED:     "An update on your application at {startupName}"

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { application } }
400: { success: false, error: { fieldErrors } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
404: { success: false, error: "Application not found" }
500: { success: false, error: "Internal server error" }
```

---

## 5.7 Startup CRM Routes

### POST /api/startups

```
Purpose:    Add a new startup to the CRM
Auth:       Required — SUPER_ADMIN or PLACEMENT_MANAGER
Used by:    Admin startups page

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "name":         string, required
  "website":      string, optional, valid URL if provided
  "country":      string, optional
  "fundingStage": string, optional,
                  enum: ["Pre-Seed","Seed","Series A","Series B","Other"]
  "source":       string, optional,
                  enum: ["Crunchbase","LinkedIn","YC",
                         "AngelList","Sequoia","Direct","Other"]
  "notes":        string, optional
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be admin role
2. Validate body with zod
3. await connectMongo()
4. Create Startup document, crmStatus defaults to "NEW"
5. Return 201

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
201: { success: true, data: { startup } }
400: { success: false, error: { fieldErrors } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
500: { success: false, error: "Internal server error" }
```

---

### GET /api/startups

```
Purpose:    Get all startups, optionally filtered by CRM status
Auth:       Required — SUPER_ADMIN or PLACEMENT_MANAGER
Used by:    Admin startups page

─────────────────────────────────────────────────
QUERY PARAMS
─────────────────────────────────────────────────
status: string, optional
        enum: ["NEW","CONTACTED","RESPONDED","HIRED","REJECTED"]

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be admin role
2. await connectMongo()
3. Build filter: status ? { crmStatus: status } : {}
4. Find Startups with filter, sort by createdAt desc
5. Return list

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { startups: [...] } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
500: { success: false, error: "Internal server error" }
```

---

### PATCH /api/startups/[startupId]

```
Purpose:    Update CRM status or notes for a startup
Auth:       Required — SUPER_ADMIN or PLACEMENT_MANAGER
Used by:    Admin startups page status dropdown

─────────────────────────────────────────────────
REQUEST BODY (all fields optional — send only what changed)
─────────────────────────────────────────────────
{
  "crmStatus": string, optional,
               enum: ["NEW","CONTACTED","RESPONDED","HIRED","REJECTED"]
  "notes":     string, optional
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be admin role
2. Validate body with zod
3. await connectMongo()
4. findByIdAndUpdate startup
5. If not found → 404
6. Return updated startup

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { startup } }
400: { success: false, error: { fieldErrors } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
404: { success: false, error: "Startup not found" }
500: { success: false, error: "Internal server error" }
```

---

## 5.8 Notification Routes

### GET /api/notifications

```
Purpose:    Get notifications for logged-in talent
Auth:       Required — TALENT role only
Used by:    Dashboard notification bell

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. Find all Notifications WHERE userId = session.user.id
   Sort: createdAt descending
   Limit: 20 most recent
3. Return list + unread count

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: {
  success: true,
  data: {
    notifications: [...],
    unreadCount: number
  }
}
401: { success: false, error: "Not authenticated" }
500: { success: false, error: "Internal server error" }
```

---

### PATCH /api/notifications/read

```
Purpose:    Mark all notifications as read
Auth:       Required — TALENT role only
Used by:    When talent opens notification panel

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be TALENT
2. updateMany Notification WHERE
   userId = session.user.id AND read = false
   SET read = true
3. Return 200

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { updated: number } }
401: { success: false, error: "Not authenticated" }
500: { success: false, error: "Internal server error" }
```

---

## 5.9 Admin Talent Routes

### GET /api/admin/talent

```
Purpose:    Get all talent users with profile and subscription
Auth:       Required — SUPER_ADMIN or PLACEMENT_MANAGER
Used by:    Admin talent list page

─────────────────────────────────────────────────
QUERY PARAMS (all optional — for filtering)
─────────────────────────────────────────────────
plan:       enum: ["FREE","STARTER","GROWTH","PRO"]
roleType:   enum: ["Software Engineer","DevOps Engineer"]
availability: enum: ["hourly","contract","both"]

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be admin role
2. Build Prisma where clause from query params
3. Find all Users WHERE role = TALENT
   Include: profile, subscription
   Apply filters if provided
   Sort: createdAt descending
4. Remove passwordHash from every user before returning
5. Return list

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { talents: [...] } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
500: { success: false, error: "Internal server error" }
```

---

### GET /api/admin/talent/[talentId]

```
Purpose:    Get full detail of one talent
Auth:       Required — SUPER_ADMIN or PLACEMENT_MANAGER
Used by:    Admin talent detail page

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be admin role
2. Find User WHERE id = talentId AND role = TALENT
   Include: profile, subscription, notifications
3. If not found → 404
4. Remove passwordHash before returning
5. Return talent

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { talent } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
404: { success: false, error: "Talent not found" }
500: { success: false, error: "Internal server error" }
```

---

## 5.10 Team Management Routes

### POST /api/team/invite

```
Purpose:    Invite a new team member (Placement Manager)
Auth:       Required — SUPER_ADMIN only
Used by:    Admin team management page

─────────────────────────────────────────────────
REQUEST BODY
─────────────────────────────────────────────────
{
  "email": string, required, valid email format
  "role":  string, required, enum: ["PLACEMENT_MANAGER"]
           (only PLACEMENT_MANAGER can be invited in MVP)
}

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be SUPER_ADMIN
2. Validate body with zod
3. Check if email already exists in User table → 409
4. Create User:
   email, role: PLACEMENT_MANAGER
   passwordHash: bcrypt.hash(crypto.randomUUID(), 12)
   emailVerified: false
5. Create VerifyToken (used as invite token, expires 48hrs)
6. Send invite email via Resend:
   Link → /auth/accept-invite?token={token}
7. Return 201

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
201: { success: true, data: { message: "Invite sent" } }
400: { success: false, error: { fieldErrors } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
409: { success: false, error: "Email already in use" }
500: { success: false, error: "Internal server error" }
```

---

### GET /api/team

```
Purpose:    Get all team members (admins)
Auth:       Required — SUPER_ADMIN only
Used by:    Admin team management page

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be SUPER_ADMIN
2. Find all Users WHERE role IN [SUPER_ADMIN, PLACEMENT_MANAGER]
3. Remove passwordHash from all
4. Return list

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { team: [...] } }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
500: { success: false, error: "Internal server error" }
```

---

### DELETE /api/team/[userId]

```
Purpose:    Remove a team member
Auth:       Required — SUPER_ADMIN only
Used by:    Admin team management page "Revoke" button

─────────────────────────────────────────────────
LOGIC
─────────────────────────────────────────────────
1. Check session → must be SUPER_ADMIN
2. Prevent self-deletion:
   if userId === session.user.id → 400
   "You cannot remove yourself"
3. Find User WHERE id = userId
4. Verify role is PLACEMENT_MANAGER
   (cannot delete another SUPER_ADMIN in MVP)
5. Delete User from PostgreSQL
   (Cascade deletes tokens and notifications)
   MongoDB application logs are kept — do not delete
6. Return 200

─────────────────────────────────────────────────
RESPONSES
─────────────────────────────────────────────────
200: { success: true, data: { message: "Team member removed" } }
400: { success: false, error: "You cannot remove yourself" }
401: { success: false, error: "Not authenticated" }
403: { success: false, error: "Forbidden" }
404: { success: false, error: "Team member not found" }
500: { success: false, error: "Internal server error" }
```

---

## 5.11 Complete API Route Map

```
METHOD  ROUTE                              AUTH REQUIRED      ROLE
──────  ─────────────────────────────────  ─────────────────  ──────────────────────
POST    /api/auth/signup                   None               —
GET     /api/auth/verify-email             None               —
POST    /api/auth/forgot-password          None               —
POST    /api/auth/reset-password           None               —
POST    /api/auth/resend-verification      None               —
GET     /api/auth/[...nextauth]            None               —

POST    /api/profile                       Yes                TALENT
GET     /api/profile                       Yes                TALENT

POST    /api/resume                        Yes                TALENT
GET     /api/resume/[userId]               Yes                TALENT (own only)
                                                              SUPER_ADMIN
                                                              PLACEMENT_MANAGER

GET     /api/subscriptions                 Yes                TALENT
POST    /api/subscriptions                 Yes                TALENT
POST    /api/subscriptions/create-order    Yes                TALENT
POST    /api/subscriptions/verify          Yes                TALENT

POST    /api/applications                  Yes                SUPER_ADMIN
                                                              PLACEMENT_MANAGER
GET     /api/applications                  Yes                TALENT (own only)
                                                              SUPER_ADMIN
                                                              PLACEMENT_MANAGER
PATCH   /api/applications/[id]             Yes                SUPER_ADMIN
                                                              PLACEMENT_MANAGER

POST    /api/startups                      Yes                SUPER_ADMIN
                                                              PLACEMENT_MANAGER
GET     /api/startups                      Yes                SUPER_ADMIN
                                                              PLACEMENT_MANAGER
PATCH   /api/startups/[id]                 Yes                SUPER_ADMIN
                                                              PLACEMENT_MANAGER

GET     /api/notifications                 Yes                TALENT
PATCH   /api/notifications/read            Yes                TALENT

GET     /api/admin/talent                  Yes                SUPER_ADMIN
                                                              PLACEMENT_MANAGER
GET     /api/admin/talent/[id]             Yes                SUPER_ADMIN
                                                              PLACEMENT_MANAGER

POST    /api/team/invite                   Yes                SUPER_ADMIN
GET     /api/team                          Yes                SUPER_ADMIN
DELETE  /api/team/[userId]                 Yes                SUPER_ADMIN
```

---

## ✅ Section 5 Complete

**Next → Section 6: Frontend**

Every page, its exact components, what data it fetches, what it renders, and all form validations — with a complete sprint-by-sprint build guide ready for Replit.
