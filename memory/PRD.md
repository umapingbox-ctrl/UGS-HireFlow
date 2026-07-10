# UGS HireFlow — PRD

## Original Problem Statement
Production-ready Consultancy Management System (CMS) called **UGS HireFlow** by UGS IT Solutions to replace 15 years of Excel-based recruitment. 3 roles: Super Admin, Employee/Recruiter, Candidate.

## Stack
- Backend: FastAPI + MongoDB (Motor async)
- Frontend: React 19 + Tailwind + Shadcn/UI + TanStack Query + Recharts + Sonner
- Auth: JWT + RBAC via `require_roles`
- Storage: Emergent Object Storage
- Fonts: Outfit (display) + Manrope (body)
- Palette: Royal Blue #2563EB, Emerald #10B981, gradient logo tint

## Modules — What's Implemented

### Phase 1 (Feb 2026)
- Public site (Home/About/Services/Contact/Register/Login), JWT auth, seed data (1 admin, 2 recruiters, 10 candidates, 5 companies, 10 jobs, 2 batches)
- Candidate CRUD + Companies + Jobs + Batches CRUD, Interview Pipeline Kanban, Dashboards (3 roles), Global Search, Notifications, Activity Log, Reports (charts + placements), CSV Export/Import, File Upload, Dark/Light theme, Settings + Change Password. Test suite 34/34.

### Phase 2 (Feb 2026 — Business Depth)
- **Partners** as first-class entity — created during candidate verification; searchable dropdown; per-partner candidate list & count; filter candidates by partner (`/app/partners`)
- **Comprehensive Candidate Registration** — 4-step wizard, multipart upload of photo/resume/certificates/experience-docs/supporting-docs at signup; reference_name + reference_phone captured
- **Verify V2 Dialog** — admin sees reference info; picks existing partner or creates new (dedupe by phone); links candidate ↔ partner atomically
- **Soft Delete / Archive / Restore / Permanent Delete** — full lifecycle with admin controls
- **Duplicate Detection** + **Merge Candidates** (payments/timeline/notes/documents/skills merged into target; source soft-deleted)
- **Profile Completion %** computed from field/list weights + progress bar
- **Employee Detail** — workload, stage breakdown, assigned candidates, activity, login history (`/app/employees/{id}`)
- **Company Hiring History** — stats + jobs + HR contacts (`/app/companies/{id}`)
- **Job Workspace** — close/reopen/bulk-allocate/remove-candidate/stats (`/app/jobs/{id}`)
- **Batch Detail** — mark running/completed, remove candidate (`/app/batches/{id}`)
- **Excel .xlsx Import** — preview + duplicate detection + skip-duplicates + import summary
- **Excel .xlsx Export** — filtered by status/employee/partner/payment
- **Organization Settings** — company/brand/email/phone/address/working hours/default fee
- **Saved Filters** per user
- **Notifications** — role-based triggers on candidate registered/verified/assigned, interview scheduled/selected/placed/offer, payment updated, company/job/batch created
- **Interconnected Navigation** — every list card links to detail; candidate detail shows Linked Records (Recruiter → Employee page, Company → Company page, Job → Job Workspace, Batch → Batch Detail, Partner → filtered candidate list)
- **Extended Global Search** — candidates, companies, jobs, employees, batches, partners (all sections navigable)
- **Login/Logout Activity Log** — auto-recorded
- **Global Error Handlers** — structured JSON 4xx/5xx responses
- **Branding** — UGS logo everywhere (sidebar, login, register, footer, favicon)

## Deferred (per user)
- PDF Export
- Advanced Report Generation
- WhatsApp/SMS/Email Automation
- Multi-branch
- AI features
- Loading screen animation (not requested in final scope)
- Landing page redesign (Phase 2c — pending)

## Test Credentials
- Admin: `admin@ugs.com` / `Admin@123`
- Recruiter: `priya@ugs.com` / `Employee@123`
- Recruiter: `rahul@ugs.com` / `Employee@123`
- Candidate: `arjun.k@example.com` / `Candidate@123`

## Test Coverage
- `/app/backend/tests/backend_test.py` — Phase 1 (34/34)
- `/app/backend/tests/test_phase2.py` — Phase 2 (39/39)
- Full regression clean. Frontend flows verified end-to-end via playwright.

## Backlog (Version 2 — future)
- PDF Export (reportlab): candidate PDF, filtered reports
- Advanced Analytics: TAT, recruiter leaderboard, monthly placement trends
- Redesigned landing page with animated sections + testimonials + FAQ
- Loading screen with rotating motivational messages
- Email/SMS/WhatsApp automations (SendGrid/Twilio)
- Mobile PWA
- Multi-branch support
