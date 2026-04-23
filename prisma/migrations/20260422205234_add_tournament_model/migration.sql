/*
  Warnings:

  - You are about to drop the column `tournament` on the `Match` table. All the data in the column will be lost.
  - Added the required column `tournamentId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "tournament",
ADD COLUMN     "tournamentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TournamentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "queryCode" TEXT,
    "logo" TEXT NOT NULL DEFAULT '',
    "tier" TEXT,
    "isSelecciones" BOOLEAN NOT NULL DEFAULT false,
    "promotionBetween1Id" INTEGER,
    "promotionBetween2Id" INTEGER,

    CONSTRAINT "TournamentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "queryCode" TEXT,
    "season" INTEGER,
    "tournamentTypeId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentType_name_key" ON "TournamentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentType_queryCode_key" ON "TournamentType"("queryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_name_key" ON "Tournament"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_queryCode_key" ON "Tournament"("queryCode");

-- AddForeignKey
ALTER TABLE "TournamentType" ADD CONSTRAINT "TournamentType_promotionBetween1Id_fkey" FOREIGN KEY ("promotionBetween1Id") REFERENCES "TournamentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentType" ADD CONSTRAINT "TournamentType_promotionBetween2Id_fkey" FOREIGN KEY ("promotionBetween2Id") REFERENCES "TournamentType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_tournamentTypeId_fkey" FOREIGN KEY ("tournamentTypeId") REFERENCES "TournamentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
