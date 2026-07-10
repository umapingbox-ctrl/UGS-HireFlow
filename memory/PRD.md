# UGS HireFlow — PRD

## Original Problem Statement
Build a production-ready Consultancy Management System (CMS) called **UGS HireFlow** by UGS IT Solutions to replace a 15-year Excel-based recruitment process with one centralized web app. Manages the full recruitment lifecycle from candidate registration through placement. Roles: Super Admin, Employee/Recruiter, Candidate.

## Stack Decisions
- **Backend**: FastAPI + MongoDB (Motor async) — production-grade equivalent chosen (problem statement mentioned Postgres/Prisma; platform runs on Mongo).
- **Frontend**: React 19 + Tailwind + Shadcn/UI + TanStack Query + Recharts + Sonner toasts.
- **Auth**: JWT-based custom auth with RBAC middleware (`require_roles`).
- **File Storage**: Emergent Object Storage integration.
- **Design**: Outfit (display) + Manrope (body) fonts. Royal Blue (#2563EB) primary, Emerald Green (#10B981) accent, glassmorphism, dark/light themes.

## User Personas
1. **Super Admin** — sees everything, manages employees, verifies/assigns candidates, tracks revenue.
2. **Employee/Recruiter** — sees only assigned candidates, updates interview stages, records payments.
3. **Candidate** — views own workspace (assigned recruiter, company, job, timeline, payments).

## Core Modules (Static)
Auth · Candidate Registration (public + admin) · Candidate Workspace (Personal, Pipeline, Docs, Payments, Partner, Activity tabs) · Candidate Verification & Assignment · Companies · Jobs · Batches · Interview Pipeline (Kanban) · Payment recording (per-candidate) · Partner info (per-candidate) · Notifications · Activity Logs · Global Search · Dashboards · Reports · CSV Export/Import · Settings.

## What's Been Implemented (2026-02)
- ✅ Public website: Home, About, Services, Contact, Register, Login
- ✅ JWT Auth with RBAC (admin/employee/candidate)
- ✅ Seed data: 1 admin, 2 employees, 10 candidates, 5 companies, 10 jobs, 2 batches, timelines, payments, partner records
- ✅ Full Candidate lifecycle: register → verify → assign → pipeline stages → payment → placed
- ✅ Candidate workspace with 6 tabs (Overview, Pipeline, Documents, Payments, Partner, Activity)
- ✅ Companies / Jobs / Batches CRUD + candidate allocation
- ✅ Interview Pipeline Kanban
- ✅ Dashboards for all 3 roles with KPIs + charts
- ✅ Global Search (candidates/companies/jobs)
- ✅ In-app notifications with unread badge
- ✅ Activity log for every important action
- ✅ CSV Export (candidates) + CSV Import (bulk migrate Excel data)
- ✅ Reports (pie + bar charts + placements table)
- ✅ File upload via Emergent Object Storage (resume/photo/documents)
- ✅ Dark/Light theme toggle
- ✅ Settings + Change Password
- ✅ Responsive layout (desktop/tablet/mobile)

## Test Credentials
- Admin: `admin@ugs.com` / `Admin@123`
- Employee: `priya@ugs.com` / `Employee@123`
- Employee: `rahul@ugs.com` / `Employee@123`
- Candidate: `arjun.k@example.com` / `Candidate@123`

## Backlog (P0/P1/P2 for future iterations)
### P0
- Real Excel (.xlsx) import/export (openpyxl) — CSV works today
- PDF export for reports & candidate profile
- Email/OTP-based Forgot Password (endpoint stubbed, delivery deferred)

### P1
- Advanced analytics: monthly placement trends, TAT (turnaround time), recruiter leaderboard
- Dedicated Payment Module (separate ledger view across candidates)
- Dedicated Partner Module (partners as first-class entities)
- Notifications preferences + email delivery (Resend/SendGrid)

### P2
- Multi-branch support
- AI resume parser + auto-skill extraction
- WhatsApp/SMS automations
- Mobile PWA / native app
- Advanced reporting builder

## API Test Coverage
- Backend: `/app/backend/tests/backend_test.py` — 34/34 passing (auth, RBAC, candidates full lifecycle, employees, companies, jobs, batches, notifications, activity, dashboards, search, reports, CSV).
