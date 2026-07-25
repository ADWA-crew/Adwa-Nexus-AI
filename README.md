# Adwa Nexus AI — Visitor Experience Module

Personalized museum visitor experience. Tagline: *Every visitor experiences history differently.*

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + Radix UI
- Zustand + TanStack Query
- React Router v7
- Framer Motion + Lenis
- PWA (vite-plugin-pwa)

## Quick start

### Backend (port 5000)

```bash
cd backend
npm install
npm run dev
```

### Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/onboarding` | Personalization onboarding |
| `/dashboard` | Visitor dashboard |
| `/journey` | Personalized journey |
| `/artifact/:id` | Artifact viewer |
| `/passport` | Passport stamps |
| `/certificate` | Completion certificate |
| `/assistant` | AI companion |
| `/scan` | QR scanner |
| `/map` | Museum map |
| `/explore` | Explore Ethiopia |

## Architecture

Feature-based folders under `frontend/src/features/` with shared UI in `components/`, API clients in `services/api/`, and Zustand stores in `stores/`.

Personalization is driven by `POST /api/visitor/personalize` — the UI renders dynamically from the API response (no hardcoded visitor types in views).
