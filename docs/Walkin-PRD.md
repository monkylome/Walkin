# WalkIn — Product Requirements Document

**Version:** 0.2  
**Team:** George Tzimokas & Arsenis Tsn  
**Status:** Draft

> Reconciled against the prototype. Sections marked **Shipped** describe behaviour
> that exists in the app today; everything else is still intent. Where a decision
> below was reversed in the build, the reversal is recorded rather than the
> original decision quietly deleted.

---

## Overview

WalkIn is a product discovery platform that connects people who need a physical item today with local stores that have it in stock right now.

It is not a marketplace and it does not handle delivery. It is a real-time local availability layer that sits between the user's intent and the physical store — answering one question fast and reliably:

> "Where can I find this near me, right now?"

The prototype extended that question with a second one that turned out to matter just as much:

> "…and is it on my way?"

---

## Problem

When someone needs a specific product today, their options are poor:

- Google Maps shows stores, not products
- E-commerce shows products, but not local availability
- Calling stores is slow and unreliable
- Going in blind wastes time and often fails

The result: people default to online orders even when they need something immediately, and local stores lose foot traffic to purchases that could have been theirs.

Local stores have the opposite problem: they carry specific inventory that people nearby would buy, but they're invisible online at the product level. A hardware store 300m away might have exactly the part someone needs — but neither side knows it.

---

## Goals

- Give users fast, accurate answers about local product availability
- Give stores a simple way to become discoverable for their specific inventory
- Build a trust-first product where accuracy is the core value, not breadth
- Start small, dense, and reliable — one neighborhood at a time

---

## Non-Goals

The following are explicitly out of scope, both now and in the near term:

- **No payment processing** — WalkIn does not charge cards or move money. The reservation sheet offers a "Pay now & pick up" option, but nothing is processed; it exists to test whether users want it. What happens in the store (cash, card, whatever) stays outside the platform.
- **No delivery** — We are a discovery tool, not a logistics platform.
- **No marketplace dynamics** — Stores are not competing on price through WalkIn.
- **No social features** — No reviews, no follows, no feeds.

---

## Users

### Consumer

People who need a specific item today and want to know where to find it before making a trip.

**Primary segment:** Urban adults 20–45 who are comfortable with mobile apps and expect fast, reliable answers.

**Secondary segments:**
- Tradespeople and professionals (electricians, plumbers, contractors) who need specific parts during a job
- Tourists or new residents unfamiliar with the local area
- Anyone searching for a niche or hard-to-find item

**Core need:** Confidence before the trip. Not browsing — deciding.

---

### Store / Merchant

Local physical stores that carry durable goods and want to be discoverable for their specific inventory.

**Two roles within a store:**
- **Store admin** — manages the account, subscription, and item catalog. Primarily on web.
- **Floor/warehouse staff** — updates stock quantities on the go, from the warehouse or shop floor. Primarily on mobile.

**Core need:** Visibility for the items they actually have. They don't need another platform to manage — they need something simple enough that keeping it updated feels worth it.

---

## Core User Flows

### Consumer Flow — Shipped

1. Opens WalkIn and signs in (see *Accounts* below)
2. Types or speaks a natural language query — either a plain one ("I need Depon right now") or one that names a route ("Going to Piraeus, I need a phone charger on the way")
3. WalkIn returns nearby stores carrying the item, ranked by detour by default, with price and stock as alternative sorts
4. Each result shows: store name, item, price, quantity in stock, minutes of detour, and the neighbourhood the store sits in
5. A map draws the actual route — user → store → destination — when a destination was named, or price pins around the user when it wasn't
6. User either taps Directions, which opens Google Maps with the store pre-inserted as a waypoint, or reserves the item first
7. User walks in and buys

### Store Onboarding Flow

1. Store registers on WalkIn (web)
2. Selects up to 10 items — either by searching WalkIn's product catalog, adding them manually, or importing via an existing XML product feed (e.g. Skroutz)
3. Inputs current stock quantity for each item
4. Goes live — their inventory is now visible to nearby users

### Stock Update Flow (Store Staff)

1. Staff member opens WalkIn on their phone (in warehouse or on shop floor)
2. Sees their item list with current quantities
3. Updates quantities as stock changes — manually, in real time
4. Changes reflect immediately in consumer-facing results

---

## Features & Requirements

### Consumer App (Web + Mobile)

**Shipped:**
- Natural language search with AI-powered query parsing, by text or voice (Web Speech API)
- Route-aware search — the AI infers which neighbourhoods a stated journey passes through and ranks stores by detour off that route
- Results showing: store name, item name, qty available, price, detour minutes, neighbourhood; sortable by detour, price, or stock
- Map view alongside list view, including a drawn route with the store as a waypoint
- "Get directions" button that hands off to Google Maps with the store pre-inserted as a stop
- Reservation with a pickup code (see *Reservations* below)
- Location-based — requires user location permission
- **Account required.** The home, stores, order and profile tabs redirect to sign-in without one. This reverses the original "no account required to search" requirement; reservations need an identity to attach a hold to, and the OTP flow was cheap enough that gating the whole app was simpler than gating half of it.

**Not yet built:**
- Item staleness surfaced to consumers ("last updated X days ago")
- Inaccuracy reporting flow

### Store Dashboard (Web + Mobile)

> **Prototype status:** the dashboard exists as a static mock only. Figures on it
> (items listed, walk-ins, revenue) and its inventory table are hardcoded, and the
> Inventory, Orders and Analytics nav entries are dead links. Nothing below is
> wired to real store data yet.

- Store registration and profile (name, address, category)
- Item catalog management: add/edit/remove items (up to plan limit)
- XML feed import — stores already on Skroutz or similar platforms can import their existing product feed to populate their catalog without manual data entry
- Per-item stock quantity input — simple number, updated manually
- Real-time sync — updates reflect immediately on consumer side
- Items not updated for an extended period display a "last updated X days ago" warning to consumers — data is never silently hidden, but staleness is surfaced honestly
- Mobile-optimised for warehouse/floor use (quick tap-to-update flow)
- Basic analytics: how many users saw each item, how many tapped directions

### AI Layer

**Shipped:**
- Parses free-text and voice queries into structured product searches, then calls a single `search_walkin` tool against live inventory
- **Route reasoning** — given "metro from Korydallos to Nea Ionia", the model infers the line and the neighbourhoods it passes through, and filters stores to that corridor. The user never names the intermediate stops; the model supplies the geography. This is the feature the product is pitched on and it was not in v0.1 of this document.
- Infers sort intent from phrasing ("cheapest" → price, "on the way" → detour)
- Answers in one or two sentences naming store, price and detour, and is constrained to only report what the tool returned

**Not yet built:**
- Synonym and description handling for imprecise language ("that hex screwdriver thing" → Allen key)
- Closest-available-match suggestion when no exact result exists, with an explanation of the near-match

---

## Design Decisions

### Reservations — reversed in the prototype

**Original decision (v0.1):** WalkIn shows available quantity only. Users cannot reserve items. The reasoning was that reservations add real complexity on both sides — stores physically pulling and holding stock, no-shows, expired holds — while "is it there, should I go?" is already answered by a live quantity.

**What shipped:** reservations exist. A user reserves from the result card and gets a three-digit pickup code with a short expiry (three minutes in the prototype, a demo-length figure and not a product decision). Active reservations surface on the home screen and in a dedicated order tab. The sheet also offers "Pay now & pick up" alongside "Pay at store", though as noted in Non-Goals no payment is processed.

**Why it changed:** the reservation is what converts "I might go" into "I am going", and it is the moment that makes the store's side of the exchange concrete. The original objection stands and is unresolved — nobody has yet decided what a store does when a hold expires, or what happens on a no-show. Treat the current implementation as a demo of the interaction, not as a settled design.

**Open before this is real:** hold duration, what the store sees, no-show handling, and whether "pay now" becomes an actual transaction (which would contradict the payments non-goal, and so needs a deliberate decision rather than drift).

---

### Consumables are in scope after all

**Original decision (v0.1):** groceries, medicine and fuel out of scope; focus on durable goods.

**What shipped:** pharmacies are the densest category in the prototype — six of eleven stores, and five of twenty catalogue items are medicines. The canonical demo query is for Depon.

**Why it changed:** over-the-counter pharmacy stock turned out to be the sharpest illustration of the problem. It is urgent by nature, genuinely stocked unevenly across nearby stores, and nobody waits two days for a delivery of paracetamol. Prescription medicine remains out of scope, and that boundary should be stated explicitly before any real pharmacy is onboarded.

---

### Accounts — reversed in the prototype

**Original decision (v0.1):** no account required to search.

**What shipped:** the app gates behind a sign-in. Home, stores, order and profile all redirect to an OTP flow when there is no user. Auth is currently mocked — the code is generated client-side and the user is persisted in `localStorage` — so it is a shape, not a security boundary.

**Why it changed:** a reservation needs an identity to attach the hold to, and splitting the app into a public half and a private half cost more than gating all of it. The original instinct was right about friction, though: search is the thing that proves the product's value, and putting a sign-in in front of it before the user has seen a single result is the wrong order. Worth revisiting so that search is public and only reservation requires an account.

---

### Manual stock updates (for now)

**Decision:** Stores update stock quantities manually through the dashboard. No POS or ERP integration in v1.

**Why:** The free tier targets stores with 10 items. At that scale, manual updates are totally manageable and keep the onboarding barrier near zero. Asking a store to integrate their ERP before they've seen any value from the platform is a deal-breaker. Once stores see traffic and trust the platform, automated sync via POS/ERP APIs becomes a natural upsell. This is a deliberate sequencing decision, not a technical limitation.

---

### Free tier capped at 10 items

**Decision:** Stores on the free tier can list a maximum of 10 items.

**Why:** This solves the cold start problem. Stores have no reason to join before users exist. A free, low-effort entry point removes that barrier. Capping at 10 items also has a secondary benefit: stores are forced to pick their most important items, which means they're more likely to keep those items accurately updated. A store with 500 items and no incentive to maintain them is worse for the platform than a store with 10 items they check every day. Accuracy is the product — the cap enforces it.

---

### Subscription model (stores pay, users are free)

**Decision:** The app is free for consumers. Stores pay a flat monthly subscription — never a per-sale commission.

**Why:** WalkIn cannot and should not touch the transaction between user and store. The user might pay cash. The store might give a discount. None of that is our business. More importantly, delivery platforms like Wolt and Efood already charge stores 20–30% per order — a model stores increasingly resent. WalkIn's pitch is the opposite: a flat monthly fee, no commission, no delivery overhead, and the store keeps everything they sell. That's a meaningful and honest differentiator when talking to merchants. Charging stores a subscription for visibility is clean, predictable, and aligns incentives — stores pay to be found, they stay because it drives real foot traffic.

---

### Both platforms (web + mobile) for both sides

**Decision:** Consumer-facing and store-facing products each have a web version and a mobile app.

**Why:** Consumers are primarily mobile, but a web version ensures accessibility and no download friction. For stores, the web dashboard is the primary management interface (admin tasks, catalog setup), but mobile is essential for floor and warehouse staff who need to update stock on the go — a warehouse agent checking inventory shouldn't need to go back to a desktop to update a quantity. Both sides need both surfaces.

---

## Business Model

**Free for consumers — always.**

Stores subscribe based on how many items they want to list and how much visibility they want:

| Tier | Items | Visibility | Price |
|---|---|---|---|
| **Free** | 10 | Standard, within proximity | €0 |
| **Starter** | Up to 50 | Standard + category boosting | €39 (indicative) |
| **Growth** | Unlimited | Priority placement in results | €79 (indicative) |

The prototype's pricing screen shows €0 / €39 / €79. Those numbers were chosen to
make the screen concrete, not from pilot data — treat them as placeholders until
the pilot says otherwise. The free tier is permanent; it funds supply-side growth.

Subscription pricing affects result ranking and item count. It does not fabricate availability — a store with a Growth subscription does not appear if they don't have the item in stock.

---

## Go-to-Market

**Supply-first, neighborhood-first.**

The platform has no value to users without stores. The platform has no value to stores without users. The only way to break this is to solve supply density in a small, contained area before opening to the public.

**Phase 1 — Pilot neighborhood (Athens)**

1. Manually recruit 20–30 stores in a single dense neighborhood
2. Onboard them for free — we do the setup with them if needed
3. They list their top 10 items and go live
4. Once coverage is sufficient, open the consumer app to users in that area
5. Measure: do users show up at stores? Do stores see it as worth maintaining?

**Phase 2 — Expand neighborhood by neighborhood**

Repeat the supply-first process in adjacent or new neighborhoods. Never open a new area to consumers before store coverage is in place.

**Phase 3 — Thessaloniki, then EU**

Same platform, same model, local store partnerships.

---

## Platform Strategy

| Surface | Primary Users | Priority |
|---|---|---|
| Consumer mobile app | End users searching for products | Primary for consumers |
| Consumer web app | Same, lower friction for first-time users | Secondary |
| Store web dashboard | Store admins managing catalog & account | Primary for store management |
| Store mobile app | Warehouse/floor staff updating stock | Primary for stock updates |

---

## Risks

**Accuracy decay** — If stores stop updating their stock, the data becomes stale and users get burned. One bad experience kills trust.

Mitigation is layered:
- Automated reminders prompt stores to review and confirm stock on a regular cadence
- Users can flag an item as inaccurate ("this wasn't actually in stock when I arrived")
- The reporting flow is intentionally high-friction — not a one-tap button — to prevent false or lazy reports
- A verified inaccuracy report counts as one strike against the store
- Three strikes and the store is removed from the platform
- Small free-tier catalog (10 items) keeps the maintenance burden manageable so stores have no excuse

Accuracy is the entire product. A store with stale data is worse than no store at all.

---

**Store acquisition** — Even free, stores need a reason to spend time onboarding. Mitigation: we do the first onboarding manually, side by side with the store owner. Remove every possible point of friction.

---

**Delivery platform expansion** — Wolt, Glovo, and similar platforms already have established relationships with local stores and the infrastructure to know what's in stock. If they move into product discovery, they have a head start on supply. Mitigation: WalkIn is not a logistics play — no delivery, no commission, no complexity. The pitch to stores is simpler and cheaper. Speed and focus are the advantage while we're small.

Note: Google is sometimes cited as a risk here, but their in-store availability feature only works with large chains that submit structured data feeds (e.g. IKEA, MediaMarkt). Independent local stores are outside their model and outside their interest. This is not a meaningful near-term threat.

---

## Future Expansion

**Vending machines and automated retail**

The long-term frame for WalkIn is any physical point where something is available — not just staffed stores. Vending machines are a natural extension: they track inventory digitally by default, they're always "open", and they're common in transit stations, universities, and office buildings. Automated lockers and smart shelves follow the same logic. These require separate operator relationships and a different onboarding model, but the consumer experience is identical. Treated as a v2+ opportunity once the core store model is validated.
