# Adwa Nexus AI — Backend

Express + Prisma + Neon, aligned with the React frontend visitor journey.

## Setup

```bash
cp .env.example .env   # set DATABASE_URL, DIRECT_URL, JWT_SECRET
npm install
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

Frontend `VITE_API_URL` should be `http://localhost:5000/api`.

## Visitor journey

```
Landing → Start Journey → Personalization Form
  → POST /api/v1/visitors/sessions
  → { sessionId, token, visitor, experience }
  → Personalized Experience Page
```

Store `token` in `localStorage.visitorToken` and send `x-visitor-token` on later calls.

### Start session body

```json
{
  "fullName": "Selam Tesfaye",
  "visitorType": "tourist",
  "ageGroup": "above18",
  "education": "university"
}
```

### Start session response

```json
{
  "sessionId": "...",
  "token": "<visitor token>",
  "createdAt": "...",
  "visitor": { "fullName", "visitorType", "ageGroup", "education" },
  "experience": {
    "profile": "tourist",
    "tone": "narrative",
    "readingLevel": "standard",
    "contentDepth": "standard",
    "features": {},
    "recommendedRoutes": [],
    "summary": "..."
  }
}
```

## API map (frontend base `/api`)

| Method | Path | Token |
|--------|------|-------|
| POST | `/v1/visitors/sessions` | — (returns visitor `token`) |
| GET | `/v1/visitors/sessions/me` | `x-visitor-token` |
| GET | `/v1/visitors/sessions/me/experience` | `x-visitor-token` |
| GET/PUT | `/visitors/:id` | — |
| GET | `/museums`, `/museums/:id` | — |
| GET | `/artifacts`, `/artifacts/:id` | — |
| GET | `/routes`, `/routes/:id` | — |
| GET | `/analytics/stats`, `/analytics/visitors` | — |
| POST | `/admin/auth/login` | returns staff JWT |
| GET | `/admin/me` | `Authorization: Bearer <staffToken>` |

### Staff login (seed)

- Email: `admin@adwa.nexus`
- Password: `Admin123!`
