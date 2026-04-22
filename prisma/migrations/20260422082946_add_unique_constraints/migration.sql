/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "mongoID" DROP NOT NULL,
ALTER COLUMN "filename" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
