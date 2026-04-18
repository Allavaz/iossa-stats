import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { randomBytes } from "crypto";

const createId = () => randomBytes(12).toString("base64url");

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, order, category } = body;

  if (!name || !slug || !category) {
    return NextResponse.json({ error: "name, slug, and category are required" }, { status: 400 });
  }

  const type = await prisma.tournamentType.create({
    data: { id: createId(), name, slug, order: order ?? 0, category },
  });
  return NextResponse.json(type, { status: 201 });
}
