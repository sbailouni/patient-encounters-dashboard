// Handles GET /api/encounters/[id]
// Returns one encounter by its id or 404 error if not found
import { NextResponse } from "next/server";
import data from "@/data/encounters.json";
import type { Encounter } from "@/types/encounter";

// load encounters from JSON file
const encounters: Encounter[] = data.encounters;

// context object type Next.js passes to route handlers
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  //function needs to await params since it's a promise object
  const { id } = await context.params;

  // remove spaces from id and set to lowercase 
  const idFromUrl = id.trim().toLowerCase();

  // find the encounter with the same id as the URL parameter
  const encounter = encounters.find(
    (item) => item.id.toLowerCase() === idFromUrl,
  );

  // if no encounter found, return 404 JSON response
  if (!encounter) {
    return NextResponse.json(
      { error: "Encounter not found" },
      { status: 404 },
    );
  }

  // if encounter was found, return encounter wrapped in a JSON object
  return NextResponse.json({ encounter });
}

