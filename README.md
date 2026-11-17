# Bootcamp Commute Sync

Coordinate your AI bootcamp commute — find transit buddies, pick up points, and auto-calculate last-mile cab/auto splits for Bengaluru & Gurugram sessions.

---

## Running Locally

You need **Node.js ≥ 18** and **npm** installed.

### 1. Install dependencies

```bash
cd Bootcamp-Commute-Sync
npm install
```

### 2. Start the API server (Terminal 1)

```bash
npx tsx express-server.ts
```

You should see:
```
🚀 Bootcamp Commute Sync API running at http://localhost:3001
📚 API Docs: http://localhost:3001/docs
```

### 3. Start the Vite frontend (Terminal 2)

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

> The Vite dev server automatically proxies all `/api/*` requests to the Express server on port 3001 — no CORS issues.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | All bootcamp events (Bengaluru + Gurugram) |
| GET | `/api/areas/:city` | Transit hubs & meetup points for a city |
| POST | `/api/commute` | Submit/update RSVP with area & boarding time |
| POST | `/api/commute/arrive` | Toggle "I Have Arrived" at the meetup point |
| GET | `/api/commute/summary/:event_id` | Live headcount, roster & cab-split per hub |
| GET | `/docs` | API documentation page |

---

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite
- **Backend**: Express (TypeScript) — FastAPI-compatible REST API
- **Storage**: In-memory Map (pre-seeded with realistic attendees)
- **Fonts**: Shantell Sans (headlines) + Comic Neue (body)
