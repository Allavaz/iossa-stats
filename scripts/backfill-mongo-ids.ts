import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const matches = await prisma.match.findMany({
    where: { mongoId: null },
    select: { id: true, sourceJson: true },
  });

  console.log(`Found ${matches.length} matches without mongoId`);

  let updated = 0;
  let skipped = 0;

  for (const match of matches) {
    const src = match.sourceJson as any;
    const mongoId = src?._id?.$oid ?? src?._id?.toString?.() ?? null;
    if (!mongoId) {
      skipped++;
      continue;
    }
    await prisma.match.update({
      where: { id: match.id },
      data: { mongoId },
    });
    updated++;
  }

  console.log(`Done. Updated: ${updated}, Skipped (no _id): ${skipped}`);
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
