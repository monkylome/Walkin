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
Your job: parse what the user wants, figure out which neighborhoods are on their route, call search_walkin, then reply briefly.

## Your tool
search_walkin(query, near?, sortBy?)
  - near: array of neighborhood names from this exact list ONLY:
    ${VALID_NEIGHBORHOODS.join(", ")}
  - sortBy: "detour" (default) | "price" | "stock"

## Route reasoning
When the user mentions a route, infer which neighborhoods they'll pass through:

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
- Mention store name, price, and detour time
- Example: "Farmakeio Athinon in Monastiraki has Depon for €2.90 — just 1 min off your route."
- If no results: "No stores in your area have that in stock right now."
- Never invent stores, prices, or stock. Only use what the tool returns.`;

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
            sortBy: z
              .enum(["detour", "price", "stock"])
              .optional()
              .describe("How to rank results"),
          }),
          execute: async ({ query, near = [], sortBy = "detour" }: {
            query: string;
            near?: string[];
            sortBy?: "detour" | "price" | "stock";
          }) => {
            appliedSortBy = sortBy;
            const nearPoints = resolveNeighborhoodNames(near);
            const results = searchInventory({ q: query, lat, lng, nearPoints, sortBy });
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
      });
    }
    return NextResponse.json(
      { error: "AI search is unavailable right now." },
      { status: 502 }
    );
  }
}
