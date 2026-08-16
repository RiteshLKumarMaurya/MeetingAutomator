# Meeting Automator — Final Hosting V2

This is the final frontend polish version.

## Visual changes
- Hero flow card has restrained automatic floating motion.
- Desktop pointer movement adds a small 3D tilt.
- Hover adds a subtle lift/glow and a light sweep.
- Click gives a short press response.
- "Ready" status has a quiet pulse.
- Pricing page has a cleaner hierarchy, subtle card glow, service-row motion, and a refined CTA interaction.
- `prefers-reduced-motion` is respected.

## Functional/hosting changes
- Existing Meeting Automator public assets and branding are preserved.
- Known `PhoneField` CountryCode typing issue is corrected.
- `deploy.sh` is included for the current VPS setup (Next.js on port 3001 behind Nginx).

## Deploy
```bash
cd /opt/meetingautomator
chmod +x deploy.sh
./deploy.sh
```

The deployment script pulls `main`, installs dependencies, builds Next.js, starts/restarts PM2 on port 3001, checks the local app, validates Nginx, and reloads Nginx.

Before making the version public, run the build on the VPS and confirm `meetingautomator.com` in both light and dark mode.

## Backend alignment in this delivery
- Uses `https://api.grocerflow.com` by default, matching the current shared backend.
- Guest booking requests explicitly send `platform=MEETINGAUTOMATOR`.
- Pricing continues to load only `meeting-automation-launch` and `meeting-automation-integration`.
- Guest reschedule messaging now matches the current backend behavior: the same secure management token remains valid after rescheduling.
- No Google OAuth, Calendar, SMTP, mailbox passwords, or backend secrets are bundled in the frontend.
