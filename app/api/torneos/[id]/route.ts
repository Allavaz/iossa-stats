import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { randomBytes } from "crypto";

const createId = () => randomBytes(12).toString("base64url");

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: tournamentTypeId } = await params;
  const body = await req.json();
  const { season, torneo, slug, tabla, tablaLabel, challonge, isSubEntry, parentId } = body;

  if (!torneo) {
    return NextResponse.json({ error: "torneo is required" }, { status: 400 });
  }

  const tournament = await prisma.tournament.create({
    data: {
      id: createId(),
      tournamentTypeId,
      season: season ?? null,
      torneo,
      slug: slug ?? null,
      tabla: tabla ?? null,
      tablaLabel: tablaLabel ?? null,
      challonge: challonge ?? null,
      isSubEntry: isSubEntry ?? false,
      parentId: parentId ?? null,
    },
  });
  return NextResponse.json(tournament, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { season, torneo, slug, tabla, tablaLabel, challonge, winners, isSubEntry, parentId } = body;

  const tournament = await prisma.tournament.update({
    where: { id },
    data: {
      ...(season !== undefined && { season }),
      ...(torneo !== undefined && { torneo }),
      ...(slug !== undefined && { slug }),
      ...(tabla !== undefined && { tabla }),
      ...(tablaLabel !== undefined && { tablaLabel }),
      ...(challonge !== undefined && { challonge }),
      ...(winners !== undefined && { winners }),
      ...(isSubEntry !== undefined && { isSubEntry }),
      ...(parentId !== undefined && { parentId }),
    },
  });
  return NextResponse.json(tournament);
}
