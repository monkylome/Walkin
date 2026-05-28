# Walkin AI Search — Hackathon Plan

> **Stack:** Next.js App Router · AI SDK · Gemini 2.5 Flash · Web Speech API
> **Total estimate:** ~6h

---

## The demo moment

User taps ✨ on the home screen, hits the mic, and says:

> "I'm going from Korydallo to Nea Ionia by metro, I want Depon"

Gemini knows the M1 line. It infers the route passes through Monastiraki → Omonia → Nea Ionia. Calls `search_walkin`. Two pharmacies appear with prices, stock, detour minutes. One tap opens Google Maps with the full multi-stop route pre-built.

**The user never said "Monastiraki." The AI reasoned the geography.**

---

## What's already built

- `app/lib/data.ts` — 13 neighborhood centroids, 9 stores, 20 items
- `app/api/search/route.ts` — haversine distance, detour math, neighborhood filter
- `app/components/bottom-sheet.tsx` — reuse this for AskSheet
- `app/(tabs)/page.tsx` — home page, mount button here

---

## What we're NOT building

- ❌ Google Directions API — haversine detour is fine for the demo
- ❌ Metro topology in code — Gemini knows Athens metro, let it reason
- ❌ Streaming text — adds frontend complexity, post-hackathon
- ❌ MCP server — mention in pitch, don't build

---

## Architecture

```
User speaks / types in AskSheet
        │
        ▼
POST /api/ai-search  { prompt, lat, lng }
        │
        ├─ Gemini 2.5 Flash
        │  Knows Athens M1/M2/M3 metro lines
        │  Extracts: product, route neighborhoods, sort preference
        │  Calls search_walkin tool
        │
        ├─ search_walkin({ query, near[], sortBy })
        │  → searchInventory() from app/lib/search.ts
        │  → SearchResult[]
        │
        └─ Gemini: 1-2 sentence reply
                │
                ▼
{ reply, results, sortBy }
                │
                ▼
AskSheet: reply bubble + result cards + sort chips
                │
         [Open in Maps] → maps-link.ts
```

---

## Phases

### Phase 1 — Backend (1.5h)

**1a. Install packages** (5 min)
```bash
pnpm add ai @ai-sdk/google zod
```

**1b. `app/lib/search.ts` — shared search function** (25 min)

Extract the core logic from `/api/search/route.ts` into:

```ts
export function searchInventory(params: {
  q: string
  lat: number
  lng: number
  destLat?: number
  destLng?: number
  near?: string[]
  sortBy?: "detour" | "price" | "stock"
}): SearchResult[]
```

Sorting rules:
- `detour` (default): sort by `detourMinutes` asc
- `price`: sort by `price` asc
- `stock`: sort by `stock` desc

Update `/api/search/route.ts` to call `searchInventory()`.

**1c. `app/api/ai-search/route.ts`** (1h)

POST endpoint. Gemini 2.5 Flash + `search_walkin` tool.

Tool schema:
```ts
search_walkin({
  query: string,          // "Depon"
  near?: string[],        // neighborhoods Gemini infers from the route
  destLat?: number,
  destLng?: number,
  sortBy?: "detour" | "price" | "stock"
})
// → SearchResult[]
```

Response:
```ts
{ reply: string, results: SearchResult[], sortBy: string }
```

System prompt — the key to "it figures out Monastiraki itself":

```
You are Walkin's local commerce assistant for Athens, Greece.
Parse what the user wants, figure out where to look, call search_walkin, reply briefly.

## Tool
search_walkin(query, near?, destLat?, destLng?, sortBy?)
  near — only these valid neighborhood names:
  Monastiraki, Plaka, Syntagma, Kolonaki, Exarchia, Omonia, Patision,
  Kypseli, Galatsi, Nea Ionia, Kifisia, Glyfada, Piraeus

## Route reasoning
DRIVING: pick neighborhoods roughly between origin and destination.
METRO lines:
  M1 (Green): Kifisia ↔ Piraeus via Patision, Omonia, Monastiraki
  M2 (Red): Anthoupoli ↔ Elliniko via Omonia, Syntagma, Kolonaki
  M3 (Blue): Nikaia ↔ Airport via Monastiraki, Syntagma
Pass the on-route neighborhoods as `near`.
If transit mode is unspecified, infer from context or assume driving.

## Sorting
"cheapest" / "lowest price" → sortBy "price"
"fastest" / "least detour" / "on the way" → sortBy "detour" (default)
"most stock" / "make sure they have it" → sortBy "stock"

## Reply
1-2 sentences. Store name, price, detour. E.g.:
"Farmakeio Athinon in Monastiraki has Depon for €2.90 — 1 min off your route."
If no results: "No stores in your area have that in stock right now."
Never invent stores, prices, or stock.
```

---

### Phase 2 — Maps deep link (20 min)

`app/lib/maps-link.ts`

```ts
export function buildMapsUrl({
  originLat, originLng,
  waypointLat, waypointLng,
  destLat?, destLng?,
  mode?: "driving" | "transit" | "walking"
}): string
```

URL format:
```
https://www.google.com/maps/dir/?api=1
  &origin={lat},{lng}
  &destination={destLat},{destLng}   // store if no dest, or final dest
  &waypoints={waypointLat},{waypointLng}
  &travelmode={mode}
```

---

### Phase 3 — Core UI, text-only (1.5h)

**3a. `app/components/ask-button.tsx`** (15 min)

Floating ✨ button, `fixed bottom-20 right-4 z-50`. Opens AskSheet on tap.

**3b. `app/components/ask-sheet.tsx`** (1h 15min)

Reuses `bottom-sheet.tsx`. Layout:

```
┌────────────────────────────┐
│  ─── handle ───            │
│                            │
│  [reply bubble]            │
│  or placeholder            │
│                            │
│  ┌────────────────────┐    │
│  │ Store · €2.90      │    │
│  │ 1 min · 18 in stock│    │
│  │ [Maps] [View]      │    │
│  └────────────────────┘    │
│                            │
│  [Least Detour✓][Cheapest][Most Stock]  │
│                            │
│  ┌───────────────────┐     │
│  │ Ask...        [→] │     │
│  └───────────────────┘     │
└────────────────────────────┘
```

States: idle → loading (shimmer) → results → error

Sort chips re-sort client-side — no second API call. All three values (detourMinutes, price, stock) already in the result.

**3c. Mount on home page** (15 min)

Add `<AskButton>` + `<AskSheet>` to `app/(tabs)/page.tsx`.

---

### Phase 4 — Voice input (30 min)

Add to `AskSheet`. Browser Web Speech API — zero dependencies.

```ts
const SpeechRecognition =
  window.SpeechRecognition ?? (window as any).webkitSpeechRecognition

const recognition = new SpeechRecognition()
recognition.lang = "en-US"
recognition.continuous = false
recognition.interimResults = false

recognition.onresult = (e) => {
  const transcript = e.results[0][0].transcript
  setInput(transcript)
  // auto-submit after voice
  handleSubmit(transcript)
}
recognition.onerror = () => setRecording(false) // silent fallback
```

UX:
- Replace the `[→]` send button area with a mic icon when input is empty
- Mic icon pulses red while recording
- On result: fills input, auto-submits immediately (no extra tap)
- If `SpeechRecognition` is undefined (Firefox, some iOS): mic icon hidden, text only

**Works great on Android Chrome. On iOS Safari: works on HTTPS only. Deploy before testing.**

---

### Phase 5 — Polish + smoke test (45 min)

- Test full flow on your phone: speak → results → tap Maps → route opens
- Test: product not in catalog → graceful "no results"
- Test: no destination → Maps link goes origin → store only
- Check tap target sizes (min 48px)
- Record backup video of the full demo working

---

## Go/no-go checkpoints

| Checkpoint | On time | Behind |
|------------|---------|--------|
| After Phase 1 | Continue | UI demo with curl is already credible |
| After Phase 2 | Continue | Skip Maps link, just show results |
| After Phase 3 | Continue | Ship text-only, skip voice |
| After Phase 4 | Polish | Skip polish, go straight to recording backup |

**Minimum shippable:** Phase 1 + Phase 3 (no Maps link, no voice). Everything else is multiplier.

---

## Risk table

| Risk | Mitigation |
|------|-----------|
| Gemini wrong on metro route | Results still show Athens stores — not catastrophic |
| Voice permission denied on demo device | Text fallback always present |
| Voice doesn't work on iOS | Demo on Android, or use text on iOS |
| All current stores cluster in Nea Ionia | Add 2-3 stores in Piraeus/Glyfada to data.ts — 10 min |
| Maps deep link wrong format | Test on your phone before stage |
| Wi-Fi dies | Backup video recorded in Phase 5 |

---

## Pitch hook (15 seconds)

> "When you ask ChatGPT where to buy Depon in Athens it makes something up.
> We grounded Gemini in real local inventory.
> Watch — metro, Korydallo to Nea Ionia."
> [tap mic, speak]
> "It figured out I'd pass through Monastiraki. Farmakeio Athinon. €2.90. One tap."
> [tap Maps]
> "Full route. No hallucinations. Real stock."
