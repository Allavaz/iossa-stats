import { getTeams, createTeam, updateTeam, updateTeamAliases, teamNameExists } from "@/lib/getFromDB";
import { isAdmin } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const teams = await getTeams();
  return NextResponse.json(teams);
}

export async function POST(request: Request) {
  if (!await isAdmin()) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  const { name, shortname, logofilename } = body;
  if (!name || !shortname || !logofilename) return new Response("Missing data", { status: 400 });
  if (await teamNameExists(name)) return new Response("Team name already exists", { status: 409 });
  await createTeam(name, shortname, logofilename);
  return new Response("Success");
}

export async function PATCH(request: Request) {
  if (!await isAdmin()) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  const { name, shortname, logofilename, aliases } = body;
  if (!name || !shortname || !logofilename) return new Response("Missing data", { status: 400 });
  await updateTeam(name, shortname, logofilename);
  if (aliases !== undefined) await updateTeamAliases(name, aliases);
  return new Response("Success");
}
