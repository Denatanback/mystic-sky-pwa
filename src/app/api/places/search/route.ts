import { NextResponse } from "next/server";
import { searchWorldCities } from "@/lib/locations/worldCitySearch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const places = await searchWorldCities(query, 8);

  return NextResponse.json(places);
}
