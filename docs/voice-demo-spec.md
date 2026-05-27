# Walkin Voice Navigation — Demo Spec

**Version:** 0.3
**Author:** George Tzimokas & Arsenis Tsntsgoukian
**Status:** Draft
**Date:** 2026-05-27

---

## Overview

This document describes the design and implementation plan for the Walkin Voice Navigation demo — an interactive proof-of-concept that demonstrates how Walkin integrates with Siri and Google Maps to enable hands-free product discovery while driving.

The goal of this demo is not a production feature. It is a pitch artifact that shows the real-world use case: a user navigating in Google Maps uses Siri to find a product via Walkin, selects a store, optionally reserves the item, and continues navigating — without ever touching their phone.

---

## Problem This Demo Solves

A user is driving and navigating via Google Maps. They realise they need a specific product — a screwdriver, a phone charger, a specific medicine. Their options today are poor:

- Stop the car, open a separate app, search, switch back to navigation
- Call a store and hope someone answers
- Go in blind and waste time

Walkin's vision: the user never touches their phone. They say "Hey Siri, find me a screwdriver on my route via Walkin". Siri queries Walkin, reads back the best option, and Google Maps updates the route — all while driving.

---

## Demo Flow

### Setup State
The demo starts with the phone mounted on the dashboard, Google Maps open, active navigation route visible (e.g. current location → home).

---

### Step 1 — Siri Activation
The user says: **"Hey Siri, find me a screwdriver on my route via Walkin"**

Siri activates the Walkin Shortcut, which:
- Extracts the product query ("screwdriver")
- Calls the Walkin API endpoint with the query + current GPS coordinates

---

### Step 2 — Walkin API Responds
The Walkin API (`/api/search`) searches the store inventory for matching items near the user's location and along the active route.

It returns the top 2–3 results:
```json
[
  {
    "store": "Toolman",
    "item": "Screwdriver set",
    "price": "€4.50",
    "stock": 3,
    "detourMinutes": 2,
    "detourMeters": 200,
    "address": "Ithakis 12, Nea Ionia"
  },
  {
    "store": "PapaGroup",
    "item": "Screwdriver Phillips",
    "price": "€5.90",
    "stock": 1,
    "detourMinutes": 5,
    "detourMeters": 500,
    "address": "Pireos 45, Nea Ionia"
  }
]
```

---

### Step 3 — Siri Reads Results
Siri reads the results aloud:
> *"Walkin found 2 options. Toolman has a screwdriver set for €4.50, 2 minutes off your route. PapaGroup has one for €5.90, 5 minutes off your route. Which one do you want?"*

---

### Step 4 — User Selects
The user says: **"Toolman"**

Siri confirms:
> *"Got it — Toolman. Do you want to reserve the item or just get directions?"*

---

### Step 5a — Reserve (optional)
If the user says **"Reserve it"**:
- Siri calls the Walkin reservations API
- The item is held at the store
- Siri confirms: *"Reserved. Toolman is holding the screwdriver set for you."*

### Step 5b — Just Directions
If the user says **"Just directions"**:
- Siri opens Google Maps with the store as a waypoint on the existing route
- Google Maps recalculates and the user continues navigating

---

### Step 6 — Route Updates in Google Maps
Google Maps shows the updated route with the intermediate stop at Toolman. The user drives there, picks up the item, and Google Maps automatically continues to the original destination.

---

## Architecture

### How Siri Connects to Walkin

The integration uses a **Siri Shortcut** — no native iOS app required for the demo.

```
User: "Hey Siri, find me a screwdriver via Walkin"
    ↓
Siri Shortcut (pre-installed on iPhone)
    ↓ HTTP POST to Walkin API
app/api/search/route.ts
    ↓ searches inventory, calculates proximity
    ↓ returns ranked results as JSON
Siri reads results aloud
    ↓ user selects store
Siri opens Google Maps with waypoint
    ↓ google.navigation:q=<address>&waypoints=<store>
User continues navigating
```

### Reservation Flow (if selected)

```
User: "Reserve it"
    ↓
Siri Shortcut calls Walkin reservations API
app/api/reservations/route.ts
    ↓ creates reservation record
    ↓ notifies store (future: push notification)
Siri confirms reservation
```

---

### New API Endpoints

```
app/api/
├── search/
│   └── route.ts         — GET /api/search?q=screwdriver&lat=...&lng=...
│                           Returns ranked store results with detour estimates
└── reservations/
    └── route.ts         — POST /api/reservations
                           Body: { storeSlug, itemSlug, userId? }
                           Returns: { reservationId, confirmationCode }
```

### Existing Code Already Available

The reservations system has already been partially built (`app/lib/reservations.tsx`, `app/components/reserve-sheet.tsx`). The API endpoint connects this to Siri.

---

## Technology Stack

- **Voice activation** — Siri (native iOS)
- **Shortcut** — Apple Shortcuts app
- **Product search API** — Next.js API route
- **Proximity calculation** — Haversine formula, no external API
- **Route handoff** — Google Maps URL scheme deep link
- **Reservations** — existing reservations system in codebase
- **Text-to-speech** — Siri (native)

No Gemini API required for the demo. Siri handles all voice interaction.

---

## Google Maps Deep Link Format

To add a waypoint to an active Google Maps route:

```
comgooglemaps://?daddr=<destination>&waypoints=<store_address>
```

Or universally (also works on Android / web):
```
https://maps.google.com/maps?daddr=<destination>&waypoints=<store_address>
```

Siri opens this URL after the user selects a store.

---

## Siri Shortcut Definition

The Shortcut pre-installed on the demo iPhone:

1. **Ask for Input** — "What product are you looking for?"
2. **Get Current Location** — captures GPS coordinates
3. **Get Contents of URL** — `GET https://walkin.app/api/search?q=[input]&lat=[lat]&lng=[lng]`
4. **Parse JSON** — extracts top results
5. **Speak** — reads top 2 results aloud
6. **Choose from List** — user selects store by voice
7. **Ask** — "Reserve or just directions?"
8. **If Reserve** → `POST /api/reservations`
9. **Open URL** — Google Maps deep link with selected store as waypoint

---

## What This Demo Is Not

- **Not a Google Maps plugin** — Walkin is a separate service; Siri acts as the bridge
- **Not a full navigation app** — turn-by-turn stays entirely within Google Maps
- **Not a production Siri integration** — uses Shortcuts, not SiriKit or App Intents (those require a native app)

---

## Out of Scope for Demo

- Native iOS app (Shortcuts is sufficient for demo)
- Android / Google Assistant integration
- Real-time stock sync (uses existing static data)
- Store push notifications for reservations
- Payment processing

---

## Success Criteria

The demo is successful if a person watching it understands, without explanation:

1. The user never touched their phone
2. Siri found a product using Walkin's data
3. The route in Google Maps updated to include the stop
4. The user had the option to reserve the item before arriving
5. The whole interaction took under 30 seconds

---

## Demo Reliability Decisions

### Language
All voice responses and UI text are in **English**.

### Hardcoded Demo Route
The demo uses a fixed route to eliminate geolocation delays and ensure the map always looks correct:
- **Origin:** Syntagma Square, Athens (37.9755, 23.7348)
- **Destination:** Nea Ionia, Athens (37.9920, 23.7500)
- **Intermediate stop:** Toolman store (already in data.ts)

This route is hardcoded in `app/demo/page.tsx`. The demo never calls the Geolocation API.

### Offline-Safe Demo Mode
The scripted demo mode (triggered by the hidden button) makes **zero API calls**:
- Search results are hardcoded in the demo component
- Reservation is created locally via the existing `ReservationProvider`
- Google Maps deep link is a static string
- Only the map tiles require internet — if WiFi fails, the demo still runs with a grey map background

The Siri Shortcut path calls the real `/api/search` endpoint and requires internet. Demo mode is the fallback.

### Demo Mode Activation
A floating **"▶ Demo"** button is visible only when the URL contains `?demo=1` (e.g. `localhost:3000/demo?demo=1`). Hidden in normal use, visible during presentation. Runs the full scripted flow automatically with timed transitions.

---

## 10-Hour Build Plan

- **2h** — `app/demo/page.tsx` — Google Maps navigation shell with hardcoded Syntagma → Nea Ionia route
- **1.5h** — `app/components/voice-overlay.tsx` — listening animation + store result cards, slides up from bottom
- **1h** — `app/api/search/route.ts` — search endpoint used by Siri Shortcut
- **0.5h** — Google Maps deep link "Navigate" button via comgooglemaps:// scheme
- **1h** — Demo mode — scripted auto-play with timed transitions, activated via ?demo=1
- **0h** — Reservation flow — already fully built ✅
- **0.5h** — Wire ReserveSheet + ReservationConfirm into the demo flow
- **0.5h** — Siri Shortcut setup in the Shortcuts app (not code)
- **1.5h** — Polish + screen mirror test + rehearsal

**Total: 8.5h**

---

## Open Items

- Gemini API key (awaiting access from collaborator) — not needed for demo, needed for production NLU
- Confirm Google Directions API is enabled on existing Maps key project
- Build and install Siri Shortcut on demo iPhone
- Deploy to a public URL so Siri Shortcut can reach the API (Vercel recommended)
