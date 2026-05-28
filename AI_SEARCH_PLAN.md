# Walkin AI Search — Build Plan

> **Branch:** `ai-search` (off `main`)
> **Budget:** ~10 hours
> **Pitch event:** AI hackathon
> **Status:** Foundation laid (~2h done). Awaiting your sign-off before continuing.

---

## 1. Pitch in one sentence

A natural-language search bar inside Walkin where a user can say
*"I'm going to Nea Ionia via Monastiraki, I want a Depon on the way"* —
Gemini parses the intent, calls Walkin's inventory API, returns real stores with
real stock and prices, and offers a one-tap Google Maps deep link with the
full multi-stop route pre-built.

---

## 2. Why this demo (strategic positioning)

- **Real and shippable today** — no Google cooperation needed, no fake interfaces, no paid subscriptions, on a real phone.
- **The AI does something only AI can do** — parses *"passing from Monastiraki"* as a route waypoint constraint. Substring search can't. Maps' built-in search can't.
- **Walkin does what only Walkin can do** — knows which two pharmacies in Monastiraki have Depon in stock at €2.90, right now.
- **Google Maps does what Google Maps is best at** — the actual driving turn-by-turn.
- **Pitch headline:** *"Walkin is the grounding layer for local commerce. LLMs hallucinate stock and prices. We ground them in real-time hyperlocal inventory."*

Three components, each in their lane. Judges immediately understand the architecture.

---

## 3. Architecture

```
User (phone)
   │
   │  taps floating ✨ button on home page
   ▼
AskSheet (bottom sheet — voice + text input)
   │
   │  POST /api/ai-search
   │  { prompt, lat, lng, destLat?, destLng? }
   ▼
/api/ai-search  (server)
   │  AI SDK + Gemini API
   │  Gemini parses prompt
   │  Gemini decides to call `search_walkin` tool
   │  Tool execute() → calls searchInventory() lib function
   │  Returns SearchResult[] back to Gemini
   │  Gemini composes final natural-language reply
   ▼
{ reply: "Found 2 pharmacies in Monastiraki…",
  results: [ { store, item, price, detourMin, lat, lng, … } ] }
   ▼
AskSheet renders result cards
   │  each card has "Open in Google Maps" CTA
   ▼
https://maps.google.com/?saddr=origin&daddr=destination&waypoints=storeLatLng
   │  multi-stop route pre-built
   ▼
Google Maps takes over for navigation.
```

---

## 4. Files (status)

| File | Status | Purpose |
|------|--------|---------|
| `app/lib/data.ts` | ✅ done | Added `neighborhoods` table (13 Athens areas with centroids) and 2 Monastiraki pharmacies (`Farmakeio Athinon`, `Pharma Plaka`) stocking Depon. |
| `app/lib/items.ts` | ✅ done | Re-exports `neighborhoods`. |
| `app/api/search/route.ts` | ✅ done | HTTP search endpoint. Accepts `q, lat, lng, destLat, destLng, near`. Filters/ranks by detour cost + neighborhood proximity. |
| `app/lib/search.ts` | ⏳ next | Extract shared `searchInventory(params)` so `/api/search` and `/api/ai-search` share one implementation. |
| `app/api/ai-search/route.ts` | ⏳ pending | AI SDK + Gemini with `search_walkin` tool. POST endpoint. |
| `app/components/ask-button.tsx` | ⏳ pending | Floating ✨ button (bottom-right, above bottom nav). |
| `app/components/ask-sheet.tsx` | ⏳ pending | Bottom sheet with voice/text input → `/api/ai-search` → result cards. |
| `app/lib/maps-link.ts` | ⏳ pending | Build Google Maps URLs with origin + waypoint + destination. |
| `app/(tabs)/page.tsx` | ⏳ pending | Mount AskButton/AskSheet. |
| `package.json` | 🔄 installing | `ai`, `@ai-sdk/google`, `zod`. |
| `.env.local` | ⚠️ **you** | Add `GOOGLE_GENERATIVE_AI_API_KEY=...` (your Gemini key from Google AI Studio). |

---

## 5. API contract

### `/api/ai-search` (POST)

```ts
// Request body
{
  prompt: string;     // "Going to Nea Ionia via Monastiraki, want a Depon"
  lat: number;        // user's current lat
  lng: number;        // user's current lng
  destLat?: number;   // optional: final destination if known beforehand
  destLng?: number;
}

// Response
{
  reply: string;            // Gemini's natural-language answer for TTS / display
  results: SearchResult[];  // structured tool output for rendering cards
  toolCalls: Array<{        // for transparency / debug overlay
    name: string;
    args: Record<string, unknown>;
  }>;
}
```

### `search_walkin` tool (Gemini function call)

```ts
{
  query: string;     // "Depon"
  near?: string[];   // ["Monastiraki", "Nea Ionia"] — neighborhood names from Walkin's list
  destLat?: number;  // pulled from request context
  destLng?: number;
}
// → returns SearchResult[]
```

### `SearchResult` shape

```ts
{
  store: string;            // "Farmakeio Athinon"
  item: string;             // "Depon 500mg"
  category: string;         // "Medicine"
  price: number;            // 2.90
  stock: number;            // 18
  storeLat: number;
  storeLng: number;
  distanceM: number;        // from user origin
  detourMinutes: number;    // realistic detour cost
  inNeighborhood: string;   // "Monastiraki"
  storeSlug: string;        // for deep-linking into Walkin's existing store page
  itemSlug: string;
}
```

---

## 6. Gemini system prompt (sketch)

```
You are Walkin's local-inventory assistant for shoppers in Athens, Greece.

Your job is to take a user's natural-language request, identify the product they
want and any route/location constraints, and call the search_walkin tool.

You have ONE tool:
  search_walkin(query, near?, destLat?, destLng?)
  - query: product name or category (e.g. "Depon", "screwdriver", "phone charger")
  - near: optional array of neighborhood names. Valid values:
      Monastiraki, Plaka, Syntagma, Kolonaki, Exarchia, Omonia, Patision,
      Kypseli, Galatsi, Nea Ionia, Kifisia, Glyfada, Piraeus
  - destLat/destLng: optional final destination coordinates

Examples:
  "I want Depon" → search_walkin("Depon")
  "Depon near Monastiraki" → search_walkin("Depon", ["Monastiraki"])
  "Going to Nea Ionia via Monastiraki, want a Depon" →
       search_walkin("Depon", ["Monastiraki", "Nea Ionia"])

After the tool returns results, respond conversationally. Recommend 1-2 best
options. Mention store name, price, and detour minutes. Be concise — 2 sentences.

Do not invent stores or prices. If the tool returns no results, say so.
```

---

## 7. UX flow on the phone

1. User opens Walkin home page.
2. Sees existing search bar + a new **floating ✨ Ask button** (bottom-right, above the bottom nav).
3. Taps ✨ → bottom sheet slides up with a chat-like input area.
4. Two ways to ask:
   - **Type** in the text input.
   - **Voice** — tap mic icon (Web Speech API recognition).
5. Sheet shows *"Thinking…"* shimmer.
6. Gemini's reply renders as a chat bubble (e.g. *"Found 2 pharmacies along your route. Farmakeio Athinon in Monastiraki has Depon for €2.90 — just 1 minute off your route."*).
7. Below the reply: **result cards** — each shows store logo, item, price, detour minutes, stock.
8. Each card has two CTAs:
   - **Open in Google Maps** — deep link with full origin → store → destination route.
   - **View in Walkin** — opens the existing `/store/[slug]` page in-app.
9. Done — user closes sheet and goes about their drive.

---

## 8. Pitch script (90s)

```
[Phone in hand on stage]

"Walkin is hyperlocal inventory — what's in stock at the shop down the street,
right now. But here's the problem: when you ask ChatGPT 'where can I buy a
Depon in Athens,' it'll make something up. LLMs hallucinate stock, prices,
and store hours constantly. They don't have access to local commerce data.

We do. And tonight we hooked Walkin up to Gemini.

Watch this. I'm in central Athens, on my way home to Nea Ionia, and I want
to grab a paracetamol on the way."

[Tap ✨ button, voice]

"Going to Nea Ionia via Monastiraki, I want a Depon on the way."

[Gemini reply renders. Cards appear.]

"Two pharmacies along my route. The cheaper one is Farmakeio Athinon in
Monastiraki — €2.90, 1 minute off route, 18 in stock."

[Tap Open in Google Maps]

"And now Google Maps has the full route — me, the pharmacy, my destination
— locked in. No app-switching, no copy-pasting addresses.

This is Walkin as the grounding layer. We don't try to be a chatbot. We don't
try to be a nav app. We're the inventory layer that makes AI shopping
agents actually useful. Today this runs against Gemini. Tomorrow same backend
runs against ChatGPT, Claude, any MCP-compatible agent."

[Pause. End scene.]
```

---

## 9. Time breakdown

| Phase | Hours | Tasks |
|------|------|------|
| **Foundation** | ~2h ✅ | Branch setup, neighborhoods + Monastiraki stores in data.ts, /api/search with waypoint filter. |
| **AI search backend** | ~2.5h | Install AI SDK, factor search into shared lib, build /api/ai-search route with Gemini + tool calling. |
| **UI** | ~3h | AskButton + AskSheet components, mount on home page, voice input, result card rendering, loading states. |
| **Maps deep link** | ~0.5h | maps-link.ts helper with origin + waypoint + destination URL generation. |
| **Polish** | ~1h | Mobile spacing, animations, error states, dark mode check. |
| **Verify + pitch prep** | ~1h | curl tests, browser smoke test, record backup video, rehearse pitch. |
| **TOTAL** | **~10h** | Tight but doable. |

---

## 10. Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Gemini hallucinates store names not in our catalog | Tool is the *only* way it gets data. Prompt explicitly says "do not invent stores." |
| Web Speech API permission denied / unreliable on iOS | Fall back to text input. Voice is a bonus, not required. |
| Gemini latency feels slow on stage | Use `gemini-2.0-flash` or `gemini-2.5-flash` (fast models). Show shimmer animation so the wait feels intentional. |
| Wifi dies during pitch | **Record a backup video** the night before. Have it queued. |
| No `GOOGLE_GENERATIVE_AI_API_KEY` set | Fallback: in dev mode, return mock results so UI still demos. |
| User asks about a product not in catalog | Tool returns `[]`. Gemini says "no matches found" — honest, not catastrophic. |
| Detour minutes look weird (1 min for everything because all stores cluster) | Acceptable for demo. Differentiation comes from price + neighborhood. |

---

## 11. Open questions for you to confirm

1. **Floating ✨ button vs inline icon in the existing search bar?**
   Current plan: floating button. Cleaner mobile UX. (Confirm or veto.)

2. **Voice input on day one?**
   Current plan: yes, but text-only fallback is fine if voice causes issues.

3. **Add MCP server as a secondary surface for the pitch?**
   Current plan: skip for the 10h window. Mention in pitch but don't build.
   Adds ~30 min but is a credibility flex. (Yes/no?)

4. **Gemini model choice?**
   `gemini-2.0-flash` (default — fast, cheap, generous free tier)
   `gemini-2.5-flash` (newer, slightly better tool use)
   `gemini-2.5-pro` (smartest, slowest, costlier)
   Current plan: `gemini-2.5-flash`.

5. **Demo destination — Nea Ionia or somewhere else?**
   Current plan: Nea Ionia (matches existing app context).

---

## 12. What's done so far (as of this commit)

- ✅ Branched off `main` to `ai-search`
- ✅ Added `neighborhoods` table to `app/lib/data.ts`
- ✅ Added 2 Monastiraki pharmacies (`Farmakeio Athinon`, `Pharma Plaka`) with Depon stock
- ✅ Re-exported `neighborhoods` from `app/lib/items.ts`
- ✅ Created `app/api/search/route.ts` with `near` waypoint filtering
- 🔄 `npm install ai @ai-sdk/google zod` running in background
- ⏸️ Awaiting your sign-off to continue

---

## 13. Next concrete steps (if you say go)

1. Confirm AI SDK packages installed.
2. Extract search logic to `app/lib/search.ts`.
3. Build `app/api/ai-search/route.ts` with Gemini + tool calling.
4. Build `app/components/ask-button.tsx` + `app/components/ask-sheet.tsx`.
5. Add `app/lib/maps-link.ts`.
6. Mount AskButton on `app/(tabs)/page.tsx`.
7. End-to-end smoke test with curl + browser.
8. Commit and push to `ai-search` branch.

Read it through, push back on anything that feels off, then say go.
