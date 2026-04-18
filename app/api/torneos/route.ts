import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const types = await prisma.tournamentType.findMany({
    orderBy: { order: "asc" },
    include: {
      Tournament: {
        orderBy: { season: "desc" },
      },
    },
  });
  return NextResponse.json(types);
}
