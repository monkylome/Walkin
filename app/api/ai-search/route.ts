import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
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
  const body = await req.json();
  const { prompt, lat = 37.9755, lng = 23.7348 } = body as {
    prompt: string;
    lat?: number;
    lng?: number;
  };

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt required" }, { status: 400 });
  }

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  });

  let toolResults: ReturnType<typeof searchInventory> = [];
  let appliedSortBy: "detour" | "price" | "stock" = "detour";

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: SYSTEM_PROMPT,
    prompt,
    tools: {
      search_walkin: tool({
        description: "Search Walkin's real-time inventory for a product near the user's route",
        parameters: z.object({
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
        execute: async ({ query, near = [], sortBy = "detour" }) => {
          appliedSortBy = sortBy;
          const nearPoints = resolveNeighborhoodNames(near);
          const results = searchInventory({ q: query, lat, lng, nearPoints, sortBy });
          toolResults = results;
          return results;
        },
      }),
    },
    maxSteps: 3,
  });

  return NextResponse.json({
    reply: text,
    results: toolResults,
    sortBy: appliedSortBy,
  });
}
