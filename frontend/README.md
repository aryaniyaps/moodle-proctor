## ProctorVision – Teacher Monitoring Dashboard (UI Only)

This is a **Next.js 14 + TypeScript + Tailwind CSS** dark-theme monitoring dashboard for teachers (proctors) in an online proctoring examination system. It uses **mock data** for dashboard entities, and authenticates against **Moodle** for login.

### Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**

### App Structure

- `src/app/login` – Teacher login page
- `src/app/dashboard` – Main dashboard shell (sidebar + top navbar)
  - `/dashboard` – Overview (live grid + alerts + reports snapshot)
  - `/dashboard/monitoring` – Focused live monitoring grid + AI alerts panel
  - `/dashboard/alerts` – AI alerts panel
  - `/dashboard/students` – Students table (20 mock students)
  - `/dashboard/reports` – Reports table (mock exam reports)
  - `/dashboard/settings` – Placeholder settings page
- `src/components` – Reusable UI components
  - `Sidebar`, `TopNavbar`, `StudentCard`, `StudentsGrid`, `AlertPanel`, `ReportTable`, `StatusBadge`
- `src/mock` – `data.ts` with mock **students**, **alerts**, **exam reports**
- `src/types` – Shared TypeScript interfaces
- `src/styles` – Tailwind-powered global styles

### Running the Project

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` – you will be redirected to `/login`. Logging in will navigate to `/dashboard`.

### Moodle Authentication Setup

Create `frontend/.env.local`:

```bash
MOODLE_BASE_URL=http://localhost:8080
MOODLE_SERVICE=moodle_mobile_app
```

Notes:

- `MOODLE_SERVICE` is the Moodle **external service shortname** used by `POST /login/token.php`.
- After login, a Moodle token is stored in an **HttpOnly cookie** and `/dashboard/*` is protected via middleware.

