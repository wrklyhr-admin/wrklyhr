# wrkly.hr — Product Knowledge Base
## Section 6 of 6: Frontend — Pages, User Journey & Design

---

## 6.0 Golden Rules for Every Replit Agent Building UI

```
RULE 1: Use shadcn/ui components first.
        Never build a button, input, card, table,
        dialog, or form from scratch.
        Check shadcn first. Always.

RULE 2: Use Tailwind for all styling.
        No inline styles. No CSS modules.
        No styled-components.

RULE 3: Every form uses react-hook-form + zod.
        No useState for form fields.
        No manual validation logic.

RULE 4: Every page that fetches data shows
        three states:
          - Loading state (skeleton or spinner)
          - Error state (error message + retry)
          - Success state (the actual content)
        Never skip loading or error states.

RULE 5: Every form shows field-level errors
        below the input in red text.
        Errors come from zod via react-hook-form.
        Never use alert() or console.log for errors.

RULE 6: Never fetch data inside a useEffect.
        Use server components for initial data fetch.
        Use SWR or server actions for mutations.

RULE 7: The landing page and its components
        already exist. Never touch these files:
          app/page.tsx
          app/layout.tsx
          components/Hero.tsx
          components/Navbar.tsx
          components/Footer.tsx
          (and all other existing components/)

RULE 8: Color palette — use these exact values
        in tailwind classes throughout the app:
          Primary:    #7C3AED  (violet-600)
          Primary hover: #6D28D9 (violet-700)
          Background: #0F0F0F  (zinc-950) dark
                      #FFFFFF  (white) light
          Surface:    #18181B  (zinc-900)
          Border:     #27272A  (zinc-800)
          Text main:  #FAFAFA  (zinc-50)
          Text muted: #A1A1AA  (zinc-400)
          Success:    #22C55E  (green-500)
          Error:      #EF4444  (red-500)
          Warning:    #F59E0B  (amber-500)

RULE 9: Font — use Inter from Google Fonts.
        Already likely configured via Next.js.
        All text uses font-sans.

RULE 10: The app is dark mode by default.
         Do not add a light/dark toggle in MVP.
```

---

## 6.1 Complete User Journey Map

This is how a user flows through the entire platform from first visit to placed.

```
FIRST TIME VISITOR
        │
        ▼
┌───────────────────────┐
│   Landing Page        │  wrklyhr.com/
│   (old version exits) │
└─────────┬─────────────┘
          │
          ├── Clicks "Get Started" or "Sign Up" CTA
          │         │
          │         ▼
          │   ┌─────────────────┐
          │   │   Signup Page   │  /auth
          │   │ (UI exists,     │
          │   │  needs wiring)  │
          │   └────────┬────────┘
          │            │
          │            ├── Already have account?
          │            │   Clicks "Log in" link
          │            │         │
          │            │         ▼
          │            │   ┌─────────────┐
          │            │   │  Login Page │  /auth/login
          │            │   └──────┬──────┘
          │            │          │
          │            ▼          │
          │   ┌──────────────────────────┐
          │   │  Check Email Page        │  /auth/verify-email
          │   │  "Check your inbox"      │  (static, no token yet)
          │   └──────────┬───────────────┘
          │              │
          │              │  User clicks link in email
          │              ▼
          │   ┌──────────────────────────┐
          │   │  Email Verified          │  /auth/verify-email?token=xxx
          │   │  "Verified! Please login"│
          │   └──────────┬───────────────┘
          │              │
          │              ▼
          │         Login Page
          │              │
          │              ▼
          │   ┌──────────────────────────┐
          │   │  Onboarding              │  /onboarding
          │   │  4-step profile builder  │
          │   │  (first login only)      │
          │   └──────────┬───────────────┘
          │              │
          │              ▼
          │   ┌──────────────────────────┐
          │   │  Plans Page              │  /plans
          │   │  Pick Free or Paid plan  │
          │   └──────────┬───────────────┘
          │              │
          │              ▼
          │   ┌──────────────────────────┐
          │   │  Talent Dashboard        │  /dashboard
          │   │  (home after login)      │
          │   └──────────┬───────────────┘
          │              │
          │    ┌─────────┼──────────┐
          │    ▼         ▼          ▼
          │  /profile  /plans    notifications
          │  (edit)   (upgrade)  (in dashboard)
          │
          └── Clicks "Log In" on navbar
                    │
                    ▼
              Login Page → Dashboard (returning user)


ADMIN JOURNEY (separate, never intersects with talent)

        │
        ▼
  wrklyhr.com/admin
        │
        ▼
  Admin Login Page
        │
        ▼
  Admin Dashboard  /admin/dashboard
        │
   ┌────┴──────────────────┬────────────────┐
   ▼                       ▼                ▼
/admin/talent         /admin/startups  /admin/team
(talent list)         (startup CRM)    (team mgmt)
   │
   ▼
/admin/talent/[id]
(talent detail + log application)
   │
   ▼
/admin/applications
(all application logs)
```

---

## 6.2 Navbar Behaviour (Shared Component)

The Navbar already exists on the landing page. For authenticated pages, a different sidebar/topbar layout is used. Here is the rule:

```
Route starts with /           → Landing page Navbar (already built)
                                Do not touch.

Route starts with /auth       → No navbar at all.
                                Full screen centered layout.

Route starts with /onboarding → No navbar.
                                Full screen stepper layout.

Route starts with /dashboard, → App Topbar (new component)
/profile, /plans                Left sidebar for navigation.

Route starts with /admin      → Admin Topbar (new component)
                                Left sidebar (different links).
```

---

## 6.3 Layouts

Two new layouts need to be created for the app and admin sections.

### Talent App Layout

```
app/(talent)/layout.tsx

┌──────────────────────────────────────────────────┐
│  TOPBAR                                          │
│  [wrkly.hr logo]          [🔔 2]  [avatar menu] │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  SIDEBAR   │   PAGE CONTENT                      │
│            │                                     │
│  Dashboard │                                     │
│  Profile   │                                     │
│  My Plan   │                                     │
│            │                                     │
│            │                                     │
│            │                                     │
└────────────┴─────────────────────────────────────┘

Sidebar links:
  - Dashboard      → /dashboard
  - My Profile     → /profile
  - My Plan        → /plans

Topbar right:
  - Notification bell with unread count badge
  - Avatar with dropdown: "Sign Out"

Design reference:
  https://dribbble.com/shots/16509363-Recruitment-Dashboard-UI-Design
  Take inspiration from: clean sidebar, minimal topbar,
  dark background, card-based content area.
  Content must match wrkly.hr requirements exactly.
```

### Admin Layout

```
app/(admin)/layout.tsx

┌──────────────────────────────────────────────────┐
│  TOPBAR                                          │
│  [wrkly.hr admin]                   [avatar]    │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  SIDEBAR   │   PAGE CONTENT                      │
│            │                                     │
│  Dashboard │                                     │
│  Talent    │                                     │
│  Startups  │                                     │
│  Applications                                   │
│  Team      │                                     │
│  (shown    │                                     │
│   only to  │                                     │
│   SUPER    │                                     │
│   ADMIN)   │                                     │
└────────────┴─────────────────────────────────────┘

Sidebar links:
  - Dashboard      → /admin/dashboard
  - Talent         → /admin/talent
  - Startups       → /admin/startups
  - Applications   → /admin/applications
  - Team           → /admin/team (SUPER_ADMIN only)
```

---

## 6.4 Page-by-Page Specification

---

### PAGE 1 — Signup Page

```
Route:      /auth
File:       app/auth/page.tsx   ← already exists, needs wiring
Sprint:     1 (feat/auth-system)

Design reference:
  https://dribbble.com/search/minimal-dark-ui
  Search: "Clean Sign Up" by Julius Löwe on Dribbble
  URL: dribbble.com/shots/15560326
  Inspiration: centered card, dark bg, minimal fields,
  logo at top, clean typography.
  Content must be wrkly.hr signup — not copied.

Layout:
  Full screen, dark background (#0F0F0F)
  Centered card (max-width: 420px)
  wrkly.hr logo at top of card

Components:
  - Logo (text-based: "wrkly.hr" in violet)
  - Heading: "Create your account"
  - Subtext: "Get remote contract work at funded startups"
  - Form fields:
      Email input
      Password input (with show/hide toggle)
      Confirm Password input (with show/hide toggle)
  - Submit button: "Create Account" (full width, violet)
  - Below button: "Already have an account? Log in" link
                  → links to /auth/login

Form validation (zod, shown below each field):
  Email:
    - Required: "Email is required"
    - Format:   "Please enter a valid email"
  Password:
    - Required:   "Password is required"
    - Min 8:      "Password must be at least 8 characters"
    - Uppercase:  "Must contain at least 1 uppercase letter"
    - Number:     "Must contain at least 1 number"
  Confirm Password:
    - Required: "Please confirm your password"
    - Match:    "Passwords do not match"

States:
  - Default:     form is empty, button enabled
  - Submitting:  button shows spinner, disabled
  - Error:       inline field errors shown
  - API error:   toast notification at top-right:
                 "An account with this email already exists"
  - Success:     redirect to /auth/verify-email
```

---

### PAGE 2 — Login Page

```
Route:      /auth/login
File:       app/auth/login/page.tsx
Sprint:     1 (feat/auth-system)

Layout:
  Same as signup — full screen centered card

Components:
  - Logo: "wrkly.hr"
  - Heading: "Welcome back"
  - Subtext: "Log in to your account"
  - Form fields:
      Email input
      Password input (with show/hide toggle)
  - "Forgot password?" link (right-aligned, above button)
    → links to a static /auth/forgot-password page
  - Submit button: "Log In" (full width, violet)
  - Below button: "Don't have an account? Sign up"
    → links to /auth

Form validation:
  Email:
    - Required: "Email is required"
    - Format:   "Enter a valid email"
  Password:
    - Required: "Password is required"

States:
  - Submitting: button spinner
  - Error: toast: "Invalid email or password"
  - Email not verified: toast: "Please verify your email first"
                        + link "Resend verification email"
  - Success:
      role = TALENT + profile incomplete → /onboarding
      role = TALENT + profile complete   → /dashboard
      role = SUPER_ADMIN or PM           → /admin/dashboard
```

---

### PAGE 3 — Verify Email Page

```
Route:      /auth/verify-email
File:       app/auth/verify-email/page.tsx
Sprint:     1 (feat/auth-system)

TWO STATES based on whether ?token= is in URL:

STATE A — No token (user just signed up):
  Full screen centered card
  Large email icon (lucide-react: MailOpen)
  Heading: "Check your inbox"
  Subtext: "We sent a verification link to your email.
            Click the link to activate your account."
  Note: "Didn't receive it? Check your spam folder."
  Button: "Resend verification email"
    → calls POST /api/auth/resend-verification

STATE B — Token in URL (?token=xxx):
  Page loads and immediately calls GET /api/auth/verify-email
  
  Loading: spinner with "Verifying..."
  
  Success:
    Green checkmark icon
    Heading: "Email verified!"
    Subtext: "Your account is ready."
    Button: "Log in now" → /auth/login
  
  Error (invalid):
    Red X icon
    Heading: "Invalid link"
    Subtext: "This link is not valid."
    Button: "Go to sign up" → /auth
  
  Error (expired):
    Warning icon
    Heading: "Link expired"
    Subtext: "This link has expired. Request a new one."
    Button: "Resend verification email"
```

---

### PAGE 4 — Forgot Password Page

```
Route:      /auth/forgot-password
File:       app/auth/forgot-password/page.tsx
Sprint:     1 (feat/auth-system)

Layout: Full screen centered card

Components:
  - Back arrow link → /auth/login
  - Heading: "Forgot your password?"
  - Subtext: "Enter your email and we'll send you a reset link."
  - Email input
  - Submit button: "Send Reset Link"

States:
  - Submitting: spinner
  - Success (always shown, even if email not found):
      Checkmark icon
      "If this email is registered, a reset link was sent."
      Link: "Back to login"
```

---

### PAGE 5 — Reset Password Page

```
Route:      /auth/reset-password
File:       app/auth/reset-password/page.tsx
Sprint:     1 (feat/auth-system)

Layout: Full screen centered card

Components:
  - Heading: "Set a new password"
  - New password input (with show/hide)
  - Confirm new password input (with show/hide)
  - Submit button: "Update Password"

Validation: same rules as signup password field

States:
  - Invalid/expired token:
      Show error message on page load
      Button: "Request a new reset link" → /auth/forgot-password
  - Success:
      "Password updated. Please log in."
      Redirect to /auth/login after 2 seconds
```

---

### PAGE 6 — Onboarding (Multi-Step Profile Builder)

```
Route:      /onboarding
File:       app/onboarding/page.tsx
Sprint:     2 + 3 (feat/talent-profile + feat/resume-upload)

Design reference:
  https://dribbble.com/shots/15560388-Hiring-Platform-Multi-Step-Form
  Hiring Platform Multi Step Form by Berktug Mutlu
  Inspiration: progress bar at top, left panel with step list,
  right panel with form fields, clean card layout.
  Content must be wrkly.hr onboarding — not copied.

Layout:
  Full screen (no sidebar/topbar)
  Two columns:
    Left (30%):  Step indicator panel
    Right (70%): Active form step

Left panel — Step Indicator:
  Step 1:  Personal Info
  Step 2:  Professional Info
  Step 3:  Availability & Rate
  Step 4:  Upload Resume
  
  Each step shows:
    - Circle: filled violet if complete, outline if upcoming,
              pulsing violet if active
    - Step label
  
  Progress bar at very top: 25% → 50% → 75% → 100%

Right panel — Form per step:

  STEP 1 — Personal Info
    Heading: "Tell us about yourself"
    Fields:
      Full name        (text input, required)
      Location         (text input, required,
                        placeholder: "e.g. Kolkata, India")
      Timezone         (select dropdown, required)
                        Options: IST, GMT, EST, PST, CET
      LinkedIn URL     (text input, optional,
                        placeholder: "linkedin.com/in/yourname")
    Button: "Next →"

  STEP 2 — Professional Info
    Heading: "Your skills & experience"
    Fields:
      Role type        (single select, required)
                        Options: Software Engineer,
                                 DevOps Engineer
      Experience       (single select, required)
                        Options: 0-1 years, 1-3 years,
                                 3-5 years, 5-10 years, 10+ years
      Skills           (multi-select tag input, required,
                        min 1 tag)
                        Options depend on roleType:
                        SDE: React, Next.js, Node.js, Python,
                             TypeScript, Java, Go, PostgreSQL,
                             MongoDB, AWS, Docker
                        DevOps: AWS, GCP, Azure, Docker,
                                Kubernetes, Terraform, CI/CD,
                                Linux, Ansible, Prometheus, Grafana
    Buttons: "← Back"  "Next →"

  STEP 3 — Availability & Rate
    Heading: "Your availability"
    Fields:
      Availability     (single select, required)
                        Options: Hourly, Contract, Both
      Rate (USD/hr)    (number input, required,
                        min: 5, max: 200,
                        placeholder: "e.g. 25")
      Weekly hours     (single select, required)
                        Options: 10 hrs/week,
                                 20 hrs/week,
                                 40 hrs/week (full time)
      Available from   (date picker, required,
                        min: today)
    Buttons: "← Back"  "Next →"

  STEP 4 — Resume Upload
    Heading: "Upload your resume"
    Subtext: "PDF only. Max 5MB."
    Fields:
      File upload area:
        Dashed border box
        Upload icon (lucide: UploadCloud)
        Text: "Drag & drop your PDF here or click to browse"
        On file selected: show filename + green checkmark
        On wrong type: "Only PDF files are allowed"
        On too large: "File must be under 5MB"
    Buttons: "← Back"  "Submit Profile"

  On Submit:
    1. Upload PDF to Supabase → get resumeUrl
    2. POST /api/profile with all collected data
    3. Show full-screen success state:
         Large checkmark
         "Profile complete! Choose your plan."
         Button: "View Plans" → /plans
```

---

### PAGE 7 — Plans Page

```
Route:      /plans
File:       app/plans/page.tsx
Sprint:     4 (feat/subscription-plans)

Design reference:
  https://dribbble.com/shots/18439865-Pricing-Page-Dark-Light-Mode
  Pricing Page Dark & Light Mode by Piotr Baran
  Inspiration: 4 plan cards in a row, one card highlighted
  (recommended), feature list with checkmarks,
  clean typography, one prominent CTA per card.
  Content must be wrkly.hr plans — not copied.

Layout:
  Full screen (no sidebar, no topbar)
  wrkly.hr logo top-left
  Center-aligned content

Components:
  Heading: "Choose your plan"
  Subtext: "We apply on your behalf. You focus on interviews."

  4 plan cards in a row (responsive: 2x2 on mobile):

  FREE CARD:
    Label: "Free"
    Price: "₹0 / month"
    Feature list:
      ✅ 2 applications per month
      ✅ Basic profile
      ✅ Resume upload
      ✅ Application tracking
      ❌ Email updates
      ❌ Resume review
    Button: "Continue for free" (outline, not filled)
    → calls POST /api/subscriptions { plan: "FREE" }
    → redirects to /dashboard

  STARTER CARD:
    Label: "Starter"
    Price: "₹499 / month"
    Feature list:
      ✅ 8 applications per month
      ✅ Full profile
      ✅ Resume upload
      ✅ Application tracking
      ✅ Email updates
      ✅ Resume review
      ❌ Priority queue
    Button: "Get Starter" (filled violet)
    → opens Razorpay checkout

  GROWTH CARD:
    Label: "Growth"
    Badge: "Most Popular" (violet badge top-right of card)
    Price: "₹999 / month"
    Feature list:
      ✅ 20 applications per month
      ✅ Everything in Starter
      ✅ Priority placement queue
      ❌ Dedicated manager
    Button: "Get Growth" (filled violet, slightly larger)
    → opens Razorpay checkout

  PRO CARD:
    Label: "Pro"
    Price: "₹1,999 / month"
    Feature list:
      ✅ Unlimited applications
      ✅ Everything in Growth
      ✅ Dedicated placement manager
      ✅ WhatsApp updates
    Button: "Get Pro" (filled violet)
    → opens Razorpay checkout

  Below cards:
    "Not sure? Start free. Upgrade anytime."

  Current plan indicator:
    If user already has a plan, show
    "Your current plan: Starter" above the cards
    That plan's button changes to "Current Plan" (disabled)
```

---

### PAGE 8 — Talent Dashboard

```
Route:      /dashboard
File:       app/dashboard/page.tsx
Sprint:     5 (feat/talent-dashboard)

Design reference:
  https://dribbble.com/shots/16509363-Recruitment-Dashboard-UI-Design
  Recruitment Dashboard UI by Alamin Hossen
  Inspiration: stat cards at top, table below,
  sidebar navigation, clean dark theme,
  status badges with colors.
  Content must be wrkly.hr data — not copied.

Layout: App Layout (sidebar + topbar)

Components:

  TOP ROW — 3 stat cards:
    Card 1: "Applications This Month"
             Large number: e.g. "3"
             Subtext: "of 8 on Starter plan"
    Card 2: "Interviews"
             Count of applications with INTERVIEWING status
    Card 3: "Placements"
             Count of applications with PLACED status

  MIDDLE ROW — Profile completion alert (conditional):
    Show ONLY if completionPct < 100:
      Yellow warning banner:
      "Your profile is incomplete. Complete it to get applied faster."
      Button: "Complete Profile" → /profile

  MAIN AREA — Application Tracker Table:
    Heading: "My Applications"
    
    Table columns:
      Startup Name  | Role | Date Applied | Status
    
    Status badge colors:
      APPLIED      → blue badge
      INTERVIEWING → amber badge
      PLACED       → green badge
      REJECTED     → red badge
    
    Empty state (no applications yet):
      Illustration or icon
      "No applications yet."
      Subtext: "Our team will start applying on your behalf
                once your profile is approved."
    
    Loading state:
      Skeleton rows (3 rows of gray shimmer)

  RIGHT SIDEBAR PANEL (inside main content):
    "Your Plan" card:
      Current plan name
      Applications used: "3 / 8 this month"
      Progress bar: violet fill
      Button: "Upgrade Plan" → /plans
    
    "Notifications" mini panel:
      Last 3 notifications
      Each: dot + message + time ago
      "View all" link → scrolls to bottom or expands

Data fetched on page load (parallel):
  GET /api/profile
  GET /api/subscriptions
  GET /api/applications
  GET /api/notifications
```

---

### PAGE 9 — Talent Profile Edit Page

```
Route:      /profile
File:       app/profile/page.tsx
Sprint:     2 (feat/talent-profile)

Layout: App Layout (sidebar + topbar)

Components:
  Heading: "My Profile"
  Subtext: "Keep your profile updated to get better matches."

  Same fields as Onboarding Steps 1-3
  Pre-filled with current data from GET /api/profile

  Resume section:
    Current resume: show filename or "No resume uploaded"
    Button: "Replace Resume" → triggers new upload
    (same upload flow as onboarding step 4)

  Save button: "Save Changes"
    → POST /api/profile with updated data
    → Toast: "Profile updated ✅"

  Validation: same zod rules as onboarding
```

---

### PAGE 10 — Admin Login Page

```
Route:      /admin
File:       app/admin/page.tsx
Sprint:     6 (feat/admin-auth)

Layout: Full screen centered (same as talent login)

Components:
  Logo: "wrkly.hr admin"
  Heading: "Admin Login"
  Email input
  Password input
  Button: "Log In"

Note:
  This is the same NextAuth credentials login.
  The difference is: after login, role is checked.
  TALENT role → redirect to /dashboard (not allowed here)
  SUPER_ADMIN or PLACEMENT_MANAGER → /admin/dashboard
  Show error: "You do not have admin access" for TALENT role.
```

---

### PAGE 11 — Admin Dashboard

```
Route:      /admin/dashboard
File:       app/admin/dashboard/page.tsx
Sprint:     6 (feat/admin-auth)

Layout: Admin Layout (admin sidebar + topbar)

Components:
  Heading: "Dashboard"
  Subtext: "Overview of platform activity"

  TOP ROW — 4 stat cards:
    Total Talent:      count of TALENT users
    Active Subscribers: count with plan != FREE
    Applications Today: count logged today in MongoDB
    Placements Total:   count with status = PLACED

  Table: "Recent Applications" (last 10)
    Columns: Talent Name | Startup | Role | Status | Date

  Table: "New Talent Signups" (last 5)
    Columns: Name | Email | Plan | Joined

Data fetched:
  GET /api/admin/talent (for counts)
  GET /api/applications (recent, admin mode)
```

---

### PAGE 12 — Admin Talent List

```
Route:      /admin/talent
File:       app/admin/talent/page.tsx
Sprint:     7 (feat/admin-talent-mgmt)

Layout: Admin Layout

Components:
  Heading: "Talent"
  
  Filter bar (top):
    Plan filter:         All | Free | Starter | Growth | Pro
    Role type filter:    All | Software Engineer | DevOps Engineer
    Availability filter: All | Hourly | Contract | Both

  Table:
    Columns:
      Name | Email | Role | Plan | Skills (tags) | Status | Actions
    
    Actions column per row:
      "View" button → /admin/talent/[id]
    
    Loading: skeleton table rows
    Empty: "No talent found matching filters."

Data fetched:
  GET /api/admin/talent with filter query params
```

---

### PAGE 13 — Admin Talent Detail

```
Route:      /admin/talent/[id]
File:       app/admin/talent/[id]/page.tsx
Sprint:     7 (feat/admin-talent-mgmt)

Layout: Admin Layout

Components:

  LEFT COLUMN (40%):
    Talent profile card:
      Name, email, location, timezone
      Role type, experience
      Skills (badge tags)
      Availability, rate, weekly hours
      LinkedIn link (if provided)
      Plan badge: Free / Starter / Growth / Pro

    Resume section:
      Button: "Download Resume"
        → GET /api/resume/[userId] → signed URL
        → Opens PDF in new tab

  RIGHT COLUMN (60%):
    "Application History" table:
      Columns: Startup | Role | Source | Date | Status

    Above table:
      Button: "+ Log Application" (violet, top right)
        → Opens Dialog modal (see below)

    Status change:
      Each row has a status dropdown
      On change → PATCH /api/applications/[id]
      Toast: "Status updated ✅"

  LOG APPLICATION DIALOG MODAL:
    Triggered by "+ Log Application" button
    Fields:
      Startup Name     (text, required)
      Startup Website  (URL, optional)
      Role             (text, required)
      Source           (select, required)
                        Options: Crunchbase, LinkedIn, YC,
                                 AngelList, Sequoia, Direct, Other
      Date Applied     (date picker, required, default: today)
      Notes            (textarea, optional)
    
    Buttons:
      "Cancel" (outline)
      "Log Application" (filled violet)
    
    On submit:
      POST /api/applications
      Close modal
      Refresh application table
      Toast: "Application logged ✅"
    
    On 429 error:
      Toast (amber warning):
      "Monthly limit reached for this talent's plan."
```

---

### PAGE 14 — Admin Startup CRM

```
Route:      /admin/startups
File:       app/admin/startups/page.tsx
Sprint:     8 (feat/admin-crm)

Layout: Admin Layout

Components:
  Heading: "Startups"
  Subtext: "Track startups you've found and contacted."

  Top row:
    Filter by CRM status:
      All | New | Contacted | Responded | Hired | Rejected
    Button: "+ Add Startup" (top right, violet)
      → Opens Add Startup Dialog

  Table:
    Columns:
      Name | Website | Country | Funding | Source | Status | Notes | Added

    Status column:
      Dropdown per row to change crmStatus
      → PATCH /api/startups/[id]

  ADD STARTUP DIALOG:
    Fields:
      Startup Name     (text, required)
      Website          (URL, optional)
      Country          (text, optional)
      Funding Stage    (select, optional)
                        Pre-Seed, Seed, Series A, Series B, Other
      Source           (select, optional)
                        Crunchbase, LinkedIn, YC, AngelList,
                        Sequoia, Direct, Other
      Notes            (textarea, optional)
    Buttons:
      "Cancel"
      "Add Startup"
    → POST /api/startups
```

---

### PAGE 15 — Admin Applications Log

```
Route:      /admin/applications
File:       app/admin/applications/page.tsx
Sprint:     9 (feat/application-logger)

Layout: Admin Layout

Components:
  Heading: "Applications"
  Subtext: "All applications logged on behalf of talent."

  Filter bar:
    Status filter: All | Applied | Interviewing | Placed | Rejected
    Source filter: All | Crunchbase | LinkedIn | YC | ...

  Table:
    Columns:
      Talent Name | Startup | Role | Source | Date | Status | Logged By

    Status column:
      Dropdown per row
      → PATCH /api/applications/[id]

    Talent Name:
      Clickable → /admin/talent/[id]
```

---

### PAGE 16 — Admin Team Management

```
Route:      /admin/team
File:       app/admin/team/page.tsx
Sprint:     11 (feat/team-management)
Visible to: SUPER_ADMIN only
            PLACEMENT_MANAGER sees 403 if they navigate here

Layout: Admin Layout

Components:
  Heading: "Team"
  Subtext: "Manage who has access to the admin dashboard."

  Table:
    Columns:
      Name | Email | Role | Status | Actions

    Actions column:
      "Revoke" button (only for PLACEMENT_MANAGER rows)
      Super Admin row: no revoke button (cannot remove self)

  Top right:
    Button: "+ Invite Member"
      → Opens Invite Dialog

  INVITE DIALOG:
    Fields:
      Email   (text, required)
      Role    (select, one option only: "Placement Manager")
    Buttons:
      "Cancel"
      "Send Invite"
    → POST /api/team/invite
    On success: toast "Invite sent to {email}"
    On 409: toast "This email already has an account"
```

---

## 6.5 Shared Components to Build Once & Reuse

```
components/shared/PageHeader.tsx
  Props: title, subtitle
  Renders: heading + muted subtext
  Used on: every admin and talent page

components/shared/StatusBadge.tsx
  Props: status (string)
  Renders: colored badge based on status value
  Status → color map:
    APPLIED      → blue
    INTERVIEWING → amber
    PLACED       → green
    REJECTED     → red
    NEW          → gray
    CONTACTED    → blue
    RESPONDED    → violet
    HIRED        → green

components/shared/LoadingSkeleton.tsx
  Props: rows (number)
  Renders: shimmer placeholder rows for tables

components/shared/EmptyState.tsx
  Props: icon, title, subtitle, actionLabel, actionHref
  Renders: centered empty state with optional action button

components/shared/Toast.tsx
  Use shadcn Toaster component
  Place <Toaster /> in root layout.tsx
  Call toast() from anywhere to show notifications

components/shared/ConfirmDialog.tsx
  Props: title, description, onConfirm, onCancel
  Used for: "Revoke team member?" confirmation
```

---

## 6.6 Sprint-by-Sprint Frontend Build Order

```
Sprint 1  — feat/auth-system
  Build:  Signup, Login, Verify Email,
          Forgot Password, Reset Password pages
  Shared: Toast setup in layout

Sprint 2  — feat/talent-profile
  Build:  Onboarding page (Steps 1-3)
          Profile edit page

Sprint 3  — feat/resume-upload
  Build:  Onboarding Step 4 (file upload UI)
          Resume upload + display in Profile page

Sprint 4  — feat/subscription-plans
  Build:  Plans page with Razorpay checkout

Sprint 5  — feat/talent-dashboard
  Build:  Talent App Layout (sidebar + topbar)
          Dashboard page with stat cards + table
          Notification bell

Sprint 6  — feat/admin-auth
  Build:  Admin login page
          Admin Layout (sidebar + topbar)
          Admin Dashboard page

Sprint 7  — feat/admin-talent-mgmt
  Build:  Admin Talent List page
          Admin Talent Detail page
          Log Application modal

Sprint 8  — feat/admin-crm
  Build:  Admin Startups page
          Add Startup modal

Sprint 9  — feat/application-logger
  Build:  Admin Applications Log page

Sprint 10 — feat/notifications
  Build:  Notification bell with unread count
          Notification panel in talent dashboard

Sprint 11 — feat/team-management
  Build:  Admin Team page
          Invite modal
```

---

## ✅ Section 6 Complete — Full Product Knowledge Base Done

---

## What You Now Have

```
Section 1 → Business model, plans, revenue, market
Section 2 → Tech stack, architecture, environment, folder structure
Section 3 → Every user journey and data flow
Section 4 → Full Prisma schema + Mongoose models + query patterns
Section 5 → Every API route with exact request, response, errors
Section 6 → Every page with layout, components, validation, design refs
```

---
