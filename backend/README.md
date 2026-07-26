# Adwa Nexus AI — Backend

<<<<<<< HEAD
Express + Prisma + Neon, aligned with the React frontend visitor journey and exhibit QR flow.
=======
Express + Prisma + Neon, aligned with the React frontend visitor journey.
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

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
<<<<<<< HEAD
  → Scan QR → POST /api/qr/resolve → exhibit DTO
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
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

<<<<<<< HEAD
## Exhibit / QR shape

`GET /artifacts/:id` and `POST /qr/resolve` return the frontend exhibit DTO:

```json
{
  "id": "adwa-victory",
  "title": "The Victory of Adwa",
  "subtitle": "...",
  "era": "1 March 1896",
  "gallery": "Hall of Independence",
  "image": null,
  "paragraphs": ["..."],
  "kidsText": "...",
  "facts": [{ "label": "Date", "value": "1 March 1896" }],
  "youtubeId": "Qp1Kk820zK4",
  "videoCaption": "..."
}
```

Seeded QR codes use the artifact **slug** as the scannable payload (`adwa-victory`, `menelik-ii`, `empress-taytu`, …).

=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
## API map (frontend base `/api`)

| Method | Path | Token |
|--------|------|-------|
| POST | `/v1/visitors/sessions` | — (returns visitor `token`) |
| GET | `/v1/visitors/sessions/me` | `x-visitor-token` |
| GET | `/v1/visitors/sessions/me/experience` | `x-visitor-token` |
<<<<<<< HEAD
| POST | `/v1/visitors/sessions/me/end` | `x-visitor-token` |
| PATCH | `/v1/visitors/sessions/me/profile` | `x-visitor-token` |
| POST | `/v1/visitors/events` | `x-visitor-token` |
| GET | `/v1/visitors/events` | `x-visitor-token` |
| GET | `/v1/visitors/recommendations` | `x-visitor-token` |
| GET/PUT | `/visitors/:id` | — |
| GET | `/museums`, `/museums/:id` | — |
| GET | `/galleries`, `/galleries/:id` | — |
| GET | `/artifacts`, `/artifacts/:id` | — |
| GET | `/artifacts/:id/exhibit` | — |
| GET | `/qr/:code` | — |
| POST | `/qr/resolve` | — body `{ payload }` |
| GET | `/routes`, `/routes/:id` | — (`?profile=tourist\|research\|minor`) |
| GET | `/analytics/stats`, `/analytics/visitors` | — |
| GET | `/reports/engagement` | staff JWT |
| POST | `/admin/auth/login` | returns staff JWT |
| GET | `/admin/me` | `Authorization: Bearer <staffToken>` |
| GET | `/ai/languages` | — |
| POST | `/ai/chat`, `/ai/voice` | — |
=======
| GET/PUT | `/visitors/:id` | — |
| GET | `/museums`, `/museums/:id` | — |
| GET | `/artifacts`, `/artifacts/:id` | — |
| GET | `/routes`, `/routes/:id` | — |
| GET | `/analytics/stats`, `/analytics/visitors` | — |
| POST | `/admin/auth/login` | returns staff JWT |
| GET | `/admin/me` | `Authorization: Bearer <staffToken>` |
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

### Staff login (seed)

- Email: `admin@adwa.nexus`
- Password: `Admin123!`

<<<<<<< HEAD
## Data model (Prisma)

| Table | Role |
|-------|------|
| `museums` / `galleries` | Venue structure |
| `artifacts` | Exhibits + catalogue objects (slug, paragraphs, kidsText, facts, youtube…) |
| `media` | Image / audio / video attachments |
| `qr_codes` / `qr_scans` | Printed labels + scan log |
| `tour_routes` / `tour_route_stops` | Personalized paths with ordered artifact stops |
| `visitor_sessions` / `visitor_events` | Journey + analytics |
| `users` | Staff accounts |

=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
## AI Guide (home page)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/ai/languages` | Language options |
| POST | `/ai/chat` | Text Q&A via **Groq** or **Gemini** |
| POST | `/ai/voice` | Voice → STT → chat reply |

- Text: `GROQ_API_KEY` **or** `GEMINI_API_KEY`
- Voice EN/FR/ZH: Groq Whisper (needs Groq)
- Voice Amharic / Afaan Oromo: **facebook/seamless-m4t-v2-large** via `HF_TOKEN`

### Groq “Verification failed” (Cloudflare)
Use Gemini instead:

1. [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) → Create API key  
2. Set `GEMINI_API_KEY=...` in `backend/.env`  
3. Restart backend — Adwa Guide text chat works without Groq

The guide card sits at the **bottom-right** of the home page.
