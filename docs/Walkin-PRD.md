# WalkIn — Product Requirements Document

**Version:** 0.1  
**Team:** George Tzimokas & Arsenis Tsn  
**Status:** Draft

---

## Overview

WalkIn is a product discovery platform that connects people who need a physical item today with local stores that have it in stock right now.

It is not a marketplace. It does not handle payments or delivery. It is a real-time local availability layer that sits between the user's intent and the physical store — answering one question fast and reliably:

> "Where can I find this near me, right now?"

---

## Problem

When someone needs a specific non-consumable product today, their options are poor:

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

- **No payments** — WalkIn does not process transactions. What happens in the store (cash, card, whatever) is not our concern.
- **No delivery** — We are a discovery tool, not a logistics platform.
- **No reservations** — See design decisions below.
- **No marketplace dynamics** — Stores are not competing on price through WalkIn.
- **No social features** — No reviews, no follows, no feeds.
- **No consumables** — Groceries, medicine, fuel are out of scope. Focus is on durable goods: tools, electronics, hardware, apparel, etc.

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

### Consumer Flow

1. Opens WalkIn (web or mobile)
2. Types or speaks a natural language query (e.g. "Allen key M6", "HDMI cable 2m", "work gloves size L")
3. WalkIn returns a list of nearby stores carrying the item, sorted by distance
4. Each result shows: store name, distance, travel time, item price, and current quantity in stock
5. User taps a result to get directions via Google Maps
6. User walks in and buys

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

- Natural language search with AI-powered query parsing
- Results list sorted by distance, showing: store name, item name, qty available, price, distance, estimated travel time
- Map view alongside list view
- "Get directions" button that hands off to Google Maps
- Location-based — requires user location permission
- No account required to search

### Store Dashboard (Web + Mobile)

- Store registration and profile (name, address, category)
- Item catalog management: add/edit/remove items (up to plan limit)
- XML feed import — stores already on Skroutz or similar platforms can import their existing product feed to populate their catalog without manual data entry
- Per-item stock quantity input — simple number, updated manually
- Real-time sync — updates reflect immediately on consumer side
- Items not updated for an extended period display a "last updated X days ago" warning to consumers — data is never silently hidden, but staleness is surfaced honestly
- Mobile-optimised for warehouse/floor use (quick tap-to-update flow)
- Basic analytics: how many users saw each item, how many tapped directions

### AI Layer

- Parses free-text and voice queries into structured product searches
- Handles synonyms, descriptions, and imprecise language (e.g. "that hex screwdriver thing" → Allen key)
- Suggests the closest available match when no exact result exists
- Explains relevance when showing a near-match ("Closest match: Allen key set, includes M6")

---

## Design Decisions

### No reservations

**Decision:** WalkIn shows available quantity only. Users cannot reserve items.

**Why:** Reservations introduce significant complexity on both sides. Stores would need to physically pull and hold items, manage no-shows, and handle expired holds. Users would need accounts and commitment. The core value of WalkIn — "is it there, should I go?" — is fully served by showing live quantity. If there are 3 units in stock, the user has enough information to make the trip. Reservations are a v2 consideration if demand validates it.

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
| **Starter** | Up to 50 | Standard + category boosting | TBD |
| **Growth** | Unlimited | Priority placement in results | TBD |

Pricing TBD based on pilot feedback. The free tier is permanent — it funds supply-side growth.

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
