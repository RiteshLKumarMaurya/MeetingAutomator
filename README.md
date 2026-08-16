# Meeting Automator — Consultation Booking System

Meeting Automator is a **build-and-integrate consultation booking system**, not a SaaS subscription product.

It is designed for agencies, consultants and service businesses that need to turn a manual meeting process into a professional workflow:

**Visitor → date/time → guest details → admin approval → Google Calendar/Meet → email → guest reschedule/cancel**

## What this frontend includes

- Conversion-focused marketing website
- Agency/consultant/service-business positioning
- One-to-one consultation booking
- Live availability
- Two-step booking flow: date/time, then details
- Guest booking — no account required
- Secure guest management link
- Guest reschedule and cancellation
- Admin login using the backend JWT/auth system
- Admin consultation desk
- Admin approve / reschedule / cancel / complete actions
- Booking search and status filters
- Meeting Automator-only admin booking filter
- Google Meet / Calendar handoff messaging
- Responsive desktop and mobile UI
- Light / night theme for the public website

## Integration model

Meeting Automator can be:

1. Integrated into an existing agency/service website as the consultation booking layer, or
2. Delivered as a new consultation-focused website and workflow.

It is intentionally positioned as a **system we build around the client's workflow**, rather than a generic SaaS product that every customer configures independently.

## Backend

The frontend uses the shared backend booking APIs.

Default API base URL:

`https://api.grocerflow.com`

Override it with:

`NEXT_PUBLIC_API_BASE_URL`

Guest bookings explicitly send:

`platform=MEETINGAUTOMATOR`

The admin console uses the backend's role-protected `/api/v1/admin/bookings` endpoints.

## Routes

- `/` — marketing website
- `/consultation` — one-to-one booking
- `/booking/manage?token=...` — guest booking management
- `/workflow` — workflow explanation
- `/pricing` — engagement options
- `/admin` — protected consultation operations desk

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm ci
npm run check
npm start
```

`npm run check` runs the TypeScript check followed by the production Next.js build. See `PRODUCTION_QA.md` for the completed contract audit and the live-test limitation of the build environment.

## Important

Do not put backend credentials, Google OAuth secrets, SMTP credentials or admin passwords into the frontend. Authentication and authorization remain backend responsibilities.
