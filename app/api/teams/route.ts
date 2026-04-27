import { getTeams } from "@/lib/getFromDB";
import { NextResponse } from "next/server";

export async function GET() {
  const teams = await getTeams();
  return NextResponse.json(teams);
}
