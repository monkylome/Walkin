# WalkIn

**Platform:** Mobile app (iOS & Android)
**Team:** Walkin (George Tzimokas & Arsenis Tsn)

---

> "You know exactly what you want to buy. You just don't know if it's nearby. That's what WalkIn solves."

---

## The Problem

In everyday life, immediate purchasing needs arise constantly:

- "I need this today"
- "I can't wait for an online order to arrive"
- "I don't know if it's worth making the trip"

Users:

- don't know if a specific product is available at a nearby store
- waste time traveling without certainty
- end up buying online out of necessity, not choice

Existing tools:

- **Google Maps** → shows stores, not products
- **Yelp / Foursquare** → focused on venues, not stock
- **E-commerce** → shows products, but not local real-time availability

**Result:** Wasted time, unnecessary trips, and the weakening of local retail.

---

## Product Vision

WalkIn is a mobile app that helps users make immediate and confident purchasing decisions for physical products they need today.

It's not a browsing app. It's not e-commerce.

It's a tool that answers quickly and reliably:

> "Where can I find this product near me, right now?"

---

## Why Now

- "Near me" mobile searches have surged in recent years — people search locally, but the tools haven't kept up
- Local retail is under intense pressure from e-commerce — it needs digital visibility without having to build an e-shop
- AI technology for natural language search is now mature and accessible
- People are turning back to local — they want to buy nearby, if they know where to look

---

## What WalkIn is NOT

- Not a marketplace
- No online payments
- No delivery
- No social features
- Not for consumable products

**The focus is clear: immediate local purchasing decisions.**

---

## Hero Use Case

The user needs a specific non-consumable product today and wants to know if it's nearby before making the trip.

> "George needs an Allen key for a repair today. He opens WalkIn, types 'Allen key M6', and in 3 seconds sees it's available at a hardware store 400m away, in stock right now."

> "Nick has run a small hardware store in the neighborhood for 15 years. He has everything you need — but nobody knows it. No e-shop, no SEO. WalkIn makes him visible exactly when someone is searching for what he has."

---

## Target Users

**Primary users**

- People aged 20–45
- Living in urban areas
- Want fast, clear answers

**Secondary users**

- Professionals (technicians, engineers, electricians)
- New residents or tourists
- Users searching for rare or very specific items

---

## Core User Flow

1. User opens the app
2. Enters a search in natural language (text or voice)
3. WalkIn returns nearby results with availability
4. User sees: distance, travel time, availability
5. Makes a decision: visit the store or reserve the product

---

## Key Features

- Natural language search (text & voice)
- Proximity filters (200m, 1km, near public transport stations)
- Hybrid view (list + map)
- Product cards with: image, price, distance, availability status
- Product reservation for a limited time
- Navigation via Google Maps
- Similar product suggestions

---

## Moments of Delight

- Small feedback messages (e.g. "You found it 350m away")
- "Available now" badge
- Urgency cue ("reserved for 2 hours")

These build trust and confidence in the decision.

---

## The Role of AI (visible to the user)

The AI doesn't just work in the background — it acts as a **smart local salesperson**.

- Understands free-form product descriptions
- Suggests similar alternatives when there's no exact match
- Explains why a result is relevant

**Example responses:**

- "I didn't find exactly that, but there's a very similar product 300m away"
- "This store has confirmed availability today"

---

## Product Availability

Availability is a critical and clearly defined concept:

- based on data from partner stores
- updated via: manual store update (dashboard) or API integration with their ERP/POS
- displayed as: **available now** or **limited stock**
- supports temporary product reservation (e.g. 2 hours)

Reliability of information is a core pillar of trust.

**Why stores are incentivized to keep data accurate:** every incorrect listing means a user who made a wasted trip — and won't come back. Accuracy isn't an obligation; it's in the store's direct interest.

Every store earns a **Reliability Score** based on data accuracy. High-scoring stores display a **"Verified Stock"** badge — visible to users, rewarding reliability.

---

## Value Proposition

WalkIn:

- drastically reduces the time spent searching for products
- removes uncertainty before visiting a store
- turns search into a clear decision to move
- increases visibility for local businesses
- drives real, targeted offline demand

---

## Social Impact

WalkIn is more than a search tool — it's infrastructure for the local economy.

- Gives digital visibility to small businesses with no e-shop or online presence
- Keeps money and purchasing power in the local market, instead of flowing to Amazon or global platforms
- Bridges the digital gap for merchants struggling to compete with e-commerce
- Reduces unnecessary trips, saving time and lowering environmental footprint

For this reason, our strategy begins with the support of the **ESCE (National Confederation of Greek Commerce)** — a body representing the interests of Greek retail that shares our vision for strengthening the local market.

**Every successful search is a sale for a local merchant that would otherwise have been lost.**

---

## The Technology

- **Frontend:** React Native (iOS & Android)
- **Backend:** Node.js — product search & availability API
- **AI layer:** Fine-tuned LLM trained on the language of retail. Understands how people actually talk about the things they need.
- **Maps & Navigation:** Google Maps API (Places, Directions, Distance Matrix)

---

## Market

**Phase 1 — Greece**

- ~200,000 active local stores
- Urban centers (Athens, Thessaloniki) as pilot
- Low competition in this specific use case

**Phase 2 — International expansion**

- ~6 million local stores across the EU with no real-time product visibility online
- Same platform, local store partnerships

---

## Business Model

The app is **free for users**.

Stores participate through subscription packages:

- **Starter** — Basic visibility within a limited radius. For small businesses that want to be discovered.
- **Dreamer** — Increased visibility & AI recommendations + **Demand Intelligence**: the store sees what users in their area are searching for but not finding. For growing businesses.
- **Wander** — Priority placement & recommended results + full Demand Intelligence analytics. For large businesses or accelerated growth.

Packages affect the user's experience, not just the store listing.

> Demand Intelligence transforms WalkIn from a discovery tool into a **business intelligence platform**: merchants learn what to stock, based on real local demand.

---

## Go-to-Market

**Supply-first strategy with institutional backing:**

- Partnership with **ESCE** for access to the local merchant network — their endorsement drastically reduces onboarding friction
- ESCE has every reason to participate: WalkIn actively strengthens the retail sector it represents
- We onboard 20–30 stores in one pilot neighborhood with a free Starter package for the first 3 months
- Once there's enough stock coverage, we open to users in that area
- We repeat per neighborhood — not city-wide from day one

---

## Validation & Traction

- Merchants lose customers because they're not "findable" online for specific products
- Users have abandoned a store visit because they didn't know if they'd find what they were looking for

---

## Next Steps / Roadmap

**Immediate (post-hackathon)**

- Pilot in one Athens neighborhood with 20–30 stores
- Store dashboard for manual stock updates

**Mid-term**

- POS/ERP integrations for automatic availability updates
- Expansion to Thessaloniki

**Long-term**

- International expansion across European markets
- B2B API: providing local product availability data to third-party platforms

---

## Team

- **George Tzimokas** —
- **Arsenis Tsn** —

---

> *"WalkIn turns 'where can I find it?' into 'I'm on my way.' — a decision to move."*
