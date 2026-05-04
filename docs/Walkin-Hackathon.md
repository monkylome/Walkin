# WalkIn — Hackathon Scope

**Format:** 12-hour build  
**Constraint:** Web only — no mobile development  
**Goal:** A working demo that proves the core loop: store lists items → user finds them nearby

---

## What We're Proving

One thing, end to end:

> A user types what they need. They see which nearby store has it and how many units are left. They tap directions and go.

Everything else is secondary to making that loop feel fast and real.

---

## What We're Building

### 1. Consumer Web App

The user-facing search interface.

**Must have:**
- Search bar with text input
- Results list: store name, item name, qty in stock, distance, price
- Map view with store pins (Google Maps embed)
- "Get directions" button → opens Google Maps directions
- Location detection (browser geolocation API)

**Skip for hackathon:**
- Voice search
- User accounts
- Filters (distance radius, category)
- Similar product suggestions (AI fallback)

---

### 2. Store Dashboard (Web)

The interface for stores to manage their items and stock.

**Must have:**
- Simple login (email + password, no OAuth)
- Item list view — see all listed items with current qty
- Add item: name, price, current stock quantity
- Edit stock quantity inline (just a number input, update on blur or button press)
- Remove item

**Skip for hackathon:**
- Store registration flow (pre-create store accounts manually)
- Analytics (views, direction taps)
- Mobile-optimised layout
- Item image upload

---

### 3. Backend API

**Endpoints needed:**
- `GET /search?q=...&lat=...&lng=...` — returns matching items + store info sorted by distance
- `GET /stores/:id/items` — returns item list for a store
- `POST /stores/:id/items` — add item
- `PATCH /items/:id` — update stock quantity
- `DELETE /items/:id` — remove item
- `POST /auth/login` — store login

**Database:** PostgreSQL (or SQLite if speed is priority)  
**Seed data:** 5–8 pre-loaded stores in one Athens neighborhood with real addresses and items

---

### 4. AI Query Parsing

**Target:** User types "that hex screwdriver M6" and gets results for "Allen key M6".

**Hackathon approach:** Single API call to Claude/OpenAI — pass the raw query, get back a normalized product name + category. If the API call fails or is too slow, fall back to raw keyword search. Keep it as a thin wrapper, not a dependency.

**Skip for hackathon:**
- Explaining why a result is relevant
- "Did you mean X?" suggestions
- Voice input parsing

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast setup, both apps in one repo |
| Styling | Tailwind CSS | No time for custom CSS |
| Backend | Node.js + Express | Familiar, fast to write |
| Database | PostgreSQL | Simple queries, good geo support |
| Maps | Google Maps JS API | Directions handoff, pins |
| AI | Claude API (claude-haiku-4-5) | Fast + cheap for query parsing |
| Auth | JWT (simple, stateless) | No session management overhead |
| Hosting | Local / localhost | It's a demo |

---

## What's Mocked or Hardcoded

Be upfront about this during the demo:

- **Store locations** are pre-seeded with real Athens addresses — not dynamically registered
- **Product catalog** is a fixed list of ~50 common items — stores pick from it, no free-text item creation in demo
- **User location** defaults to a fixed point in the pilot neighborhood if geolocation is denied
- **Distance calculation** uses straight-line (haversine) — not walking/driving time
- **Stock accuracy** is demonstrated live by updating a store dashboard item and showing it reflect in search results immediately

---

## Demo Script

The demo should tell a story, not show features.

1. **Open store dashboard** — show a hardware store logged in with 8 items listed
2. **Live update** — change stock qty of "Allen key M6" from 0 to 3
3. **Switch to consumer app** — type "Allen key M6" in search
4. **Show result** — the hardware store appears, 3 units, distance shown, pin on map
5. **Tap directions** — Google Maps opens with route
6. **Update qty back to 0** on dashboard — show it disappears from consumer results
7. **Try a messy query** — type "hex screwdriver thing" — AI parses it, same result appears

That's the demo. Seven steps, proves everything.

---

## What We're Not Demoing (and What to Say)

| Feature | Status | What to say |
|---|---|---|
| Mobile apps | Not built | "Both sides have mobile apps — store staff update stock from the warehouse floor. Web-first for today." |
| Voice search | Not built | "Voice input is on the roadmap, parsing logic is identical to text." |
| Reservations | Won't build | "We deliberately chose not to build reservations — live quantity is enough signal for the user to decide." |
| ERP/POS sync | Not built | "Manual updates for v1. POS integration is the natural upsell once stores trust the platform." |
| Store registration | Manual | "Onboarding is intentionally manual in the pilot phase — we sit with the store and do it together." |

---

## Split of Work

| Area | Owner |
|---|---|
| Consumer web app (UI) | TBD |
| Store dashboard (UI) | TBD |
| Backend API + DB | TBD |
| AI query parsing | TBD |
| Seed data + demo setup | Both |
| Demo script + presentation | Both |

---

## Open Questions Before Building

- Which Google Maps API key are we using?
- Which AI API key — Claude or OpenAI?
- Do we seed real Athens store names and addresses, or invent them?
- One repo (monorepo) or two separate repos?
