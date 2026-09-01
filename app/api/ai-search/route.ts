import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { DEFAULT_ORIGIN } from "@/app/lib/data";
import { searchInventory, resolveNeighborhoodNames } from "@/app/lib/search";

const VALID_NEIGHBORHOODS = [
  "Monastiraki", "Plaka", "Syntagma", "Kolonaki", "Exarchia", "Omonia",
  "Patision", "Kypseli", "Galatsi", "Nea Ionia", "Kifisia", "Glyfada", "Piraeus",
] as const;

const SYSTEM_PROMPT = `You are Walkin's local commerce assistant for Athens, Greece.
Your job: parse what the user wants, call search_walkin immediately, then reply briefly.
The user's GPS coordinates are already provided to the tool automatically — you do NOT need to ask for their location or neighborhood. Always call the tool right away.

## Your tool
search_walkin(query, near?, destination?, sortBy?)
  - query: the product name or category
  - near: (optional) array of neighborhood names to filter by, ONLY when the user mentions a route. Use from this list:
    ${VALID_NEIGHBORHOODS.join(", ")}
  - destination: (optional) the user's final destination neighborhood (from the same list). Set this when the user says where they're going.
  - sortBy: "detour" (default) | "price" | "stock"

If the user just says "I need X" without mentioning a route, call search_walkin with just the query. The tool will find the closest stores using their GPS.

## Route reasoning
ONLY when the user mentions a route/destination, infer which neighborhoods they'll pass through:

METRO lines in Athens:
  M1 (Green line): Kifisia ↔ Piraeus — passes through: Kifisia, Galatsi, Patision, Omonia, Monastiraki, Piraeus
  M2 (Red line): Anthoupoli ↔ Elliniko — passes through: Omonia, Syntagma, Kolonaki
  M3 (Blue line): Nikaia ↔ Airport — passes through: Monastiraki, Syntagma

Example: "metro from Korydallo to Nea Ionia" → M1 line → near: ["Piraeus", "Monastiraki", "Omonia", "Patision"]

DRIVING: pick 2-3 neighborhoods geographically between origin and destination.

If transit mode is not mentioned, assume driving.

## Sorting
- "cheapest" / "lowest price" / "best price" → sortBy "price"
- "fastest" / "least detour" / "on the way" / no preference → sortBy "detour"
- "most stock" / "make sure they have it" → sortBy "stock"

## Reply rules
- 1-2 sentences maximum
- Mention store name, price, and distance/detour time
- Example (route): "Farmakeio Athinon in Monastiraki has Depon for €2.90 — just 1 min off your route."
- Example (nearby): "MediCare Plus has Depon for €3.20, 4 min away."
- If no results: "No stores nearby have that in stock right now."
- Never invent stores, prices, or stock. Only use what the tool returns.
- NEVER ask the user for their location — you already have it.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error("[ai-search] GOOGLE_GENERATIVE_AI_API_KEY is not set — see .env.example");
    return NextResponse.json(
      { error: "AI search is not configured on this server." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const {
    prompt,
    lat = DEFAULT_ORIGIN.lat,
    lng = DEFAULT_ORIGIN.lng,
  } = body as { prompt?: string; lat?: number; lng?: number };

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng must be numbers" }, { status: 400 });
  }

  const google = createGoogleGenerativeAI({ apiKey });

  let toolResults: ReturnType<typeof searchInventory> = [];
  let appliedSortBy: "detour" | "price" | "stock" = "detour";
  let routeMap: { destLat: number; destLng: number; destName: string } | null = null;

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: SYSTEM_PROMPT,
      prompt,
      tools: {
        search_walkin: tool({
          description: "Search Walkin's real-time inventory for a product near the user's route",
          inputSchema: z.object({
            query: z.string().describe("Product name or category to search for"),
            near: z
              .array(z.enum(VALID_NEIGHBORHOODS))
              .optional()
              .describe("Neighborhood names on the user's route"),
            destination: z
              .enum(VALID_NEIGHBORHOODS)
              .optional()
              .describe("The user's final destination neighborhood, if mentioned"),
            sortBy: z
              .enum(["detour", "price", "stock"])
              .optional()
              .describe("How to rank results"),
          }),
          execute: async ({ query, near = [], destination, sortBy = "detour" }: {
            query: string;
            near?: string[];
            destination?: string;
            sortBy?: "detour" | "price" | "stock";
          }) => {
            appliedSortBy = sortBy;
            const nearPoints = resolveNeighborhoodNames(near);

            let destLat: number | undefined;
            let destLng: number | undefined;
            if (destination) {
              const resolved = resolveNeighborhoodNames([destination]);
              if (resolved.length > 0) {
                destLat = resolved[0].lat;
                destLng = resolved[0].lng;
                routeMap = { destLat, destLng, destName: destination };
              }
            }

            const results = searchInventory({ q: query, lat, lng, destLat, destLng, nearPoints, sortBy });
            toolResults = results;
            return results;
          },
        }),
      },
      stopWhen: stepCountIs(3),
    });

    return NextResponse.json({
      reply: text,
      results: toolResults,
      sortBy: appliedSortBy,
      routeMap,
    });
  } catch (err) {
    // Gemini refused, timed out, hit a quota, or the key is invalid. The tool may
    // still have run, so fall back to raw results rather than showing nothing.
    console.error("[ai-search] generateText failed:", err);
    if (toolResults.length > 0) {
      return NextResponse.json({
        reply: "",
        results: toolResults,
        sortBy: appliedSortBy,
        routeMap,
      });
    }
    return NextResponse.json(
      { error: "AI search is unavailable right now." },
      { status: 502 }
    );
  }
}
