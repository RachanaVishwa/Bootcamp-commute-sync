# Bootcamp Commute Sync - Implementation Plan

A full-stack web application designed for technical builders attending intensive AI bootcamps to coordinate their morning/evening commute, find nearby peers sharing metro/bus stops, calculate last-mile auto/cab splits, and coordinate arrival statuses ("I have arrived").

## User Review & Critical Decisions

> [!IMPORTANT]
> - **Default City**: Both Bengaluru and Gurugram will be supported with an easy city toggle switch.
> - **Arrival Coordination**: Added an interactive "I Have Arrived" check-in status so attendees waiting at the transit hub or venue entrance can signal peers to meet up and travel together.
> - **Backend/API Stack**: Fully functional Express + Vite full-stack architecture with REST endpoints (`/api/events`, `/api/areas/:city`, `/api/commute`, `/api/commute/summary/:eventId`, `/api/commute/arrive`), replicating the requested FastAPI/Python data model and scraping fallback.

- **Confirmed Decision 1**: Multi-city selector for Bengaluru & Gurugram.
- **Confirmed Decision 2**: Interactive "I have arrived" check-in button and peer coordination chat/status board.

---

## 1. Overview & Core Concept

- **What It Does**: Helps bootcamp attendees coordinate their commute, view live community headcounts from their origin transit stop (e.g. Indiranagar Metro, Cyber City Rapid Metro), estimate last-mile cab/auto splits, and toggle RSVP status (YES / NO) with persistent user tokens (`localStorage`).
- **Target Audience**: Software engineers and ML developers attending Bootcamp sessions.
- **Key Value**: Eliminates solo commute friction, saves money via last-mile ride sharing, and builds camaraderie before sessions start.

## 2. User Experience & Visual Design

- **Aesthetic Direction**: Playful Developer Console + Subtle Glassmorphism based on the Stitch UI specification (`#0F131D` dark slate void, electric blue `#3B82F6`, emerald green `#10B981`, radiant amber `#F59E0B`).
- **Typography**: Comic Relief for friendly headlines, Comic Neue for technical labels and timestamps.
- **Key Views & Flows**:
  1. **City & Event Selector**: Switch between Bengaluru and Gurugram upcoming sessions (Morning 9 AM - 1 PM, Evening 2 PM - 6 PM).
  2. **RSVP Card**: Binary YES / NO decision. Clicking YES unlocks origin area selector, transit stop picker, and boarding time chips. Clicking NO shows a polite acknowledgment with a modify link.
  3. **Live Community Headcount & Huddle Manifest**: Shows active builders boarding from the selected hub, member initials avatars, and last-mile cab split recommendations.
  4. **Arrival & Huddle Coordination Board**: New interactive section enabling attendees to click "I Have Arrived" at the meetup landmark and view who else is currently waiting to walk/ride in together.

## 3. Key Product Decisions & Trade-Offs

- **Node.js / Express Full-Stack Backend**: Uses Express backend in `server.ts` to host REST API endpoints with in-memory SQLite/JSON persistence so multi-user RSVP summaries and "I have arrived" check-ins work in real-time across browser sessions.
- **Scraper Fallback**: Built-in scraper simulation with rich pre-seeded data for Bengaluru and Gurugram transit hubs ensuring 100% reliability in the AI Studio preview environment.

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                      React Frontend                    │
│  (Tailwind CSS v4, Comic Fonts, LocalStorage Token)    │
└───────────────────────────┬────────────────────────────┘
                            │ REST API Calls (/api/*)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express Backend                      │
│   (server.ts with /api/events, /api/areas, /api/commute)│
└───────────────────────────┬────────────────────────────┘
                            │ Persistent State / SQLite
                            ▼
┌────────────────────────────────────────────────────────┐
│            In-Memory / JSON DB & Scraper               │
└────────────────────────────────────────────────────────┘
