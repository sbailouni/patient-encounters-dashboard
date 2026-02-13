// Handles GET api/encounters
// Returns a filtered list of encounters based on query parameters 
import { NextResponse } from "next/server";
import data from "@/data/encounters.json";
import type { Encounter } from "@/types/encounter";

// load encounters from JSON file
const encounters: Encounter[] = data.encounters;

export async function GET(request: Request) {
  // read query parameters from the URL
  const { searchParams } = new URL(request.url);

  // get query parameter for status filter (if exists)
  // example: "completed,pending"
  const statusParam = searchParams.get("status");

  // get query parameter for patient name search (if exists)
  // example: ?q=smith
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

  // convert status string into array
  // or leave as null if no status filter was given
  let statuses: string[] | null = null;
  if (statusParam) {
    statuses = statusParam
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
  }

  // filter encounters by status and name
  const filtered = encounters.filter((encounter) => {
    //if no statuses are selected, show all encounters (first case)
    //if there are statuses selected, show only encounters with those statuses
    const matchesStatus =
      !statuses || statuses.length === 0 || statuses.includes(encounter.status.toLowerCase());

    //checks whether patient name contains the typed input
    const matchesQuery =
      query.length === 0 || encounter.patientName.toLowerCase().includes(query);

    //return encounters that match selected statuses *and* patient name input
    return matchesStatus && matchesQuery;
  });

  // return filtered encounters as JSON
  return NextResponse.json({ encounters: filtered });
}
