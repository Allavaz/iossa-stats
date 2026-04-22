-- CreateEnum
CREATE TYPE "Side" AS ENUM ('home', 'away');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('GOAL', 'YELLOW_CARD', 'SECOND_YELLOW', 'RED_CARD', 'OWN_GOAL');

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortname" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "steamid" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "mongoID" TEXT NOT NULL,
    "sourceJSON" JSONB NOT NULL,
    "tournament" TEXT NOT NULL,
    "homeScore" INTEGER NOT NULL,
    "awayScore" INTEGER NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "filename" TEXT NOT NULL,
    "secondsPlayed" INTEGER NOT NULL,
    "format" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchPlayer" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "side" "Side" NOT NULL,
    "goals" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "shotsontarget" INTEGER NOT NULL,
    "passes" INTEGER NOT NULL,
    "passescompleted" INTEGER NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "saves" INTEGER NOT NULL,
    "fouls" INTEGER NOT NULL,
    "yellowcards" INTEGER NOT NULL,
    "redcards" INTEGER NOT NULL,
    "owngoals" INTEGER NOT NULL,
    "offsides" INTEGER NOT NULL,
    "distancecovered" DOUBLE PRECISION NOT NULL,
    "possession" DOUBLE PRECISION NOT NULL,
    "corners" INTEGER NOT NULL,
    "throwins" INTEGER NOT NULL,
    "penalties" INTEGER NOT NULL,
    "freekicks" INTEGER NOT NULL,
    "tackles" INTEGER NOT NULL,
    "tacklescompleted" INTEGER NOT NULL,
    "foulssuffered" INTEGER NOT NULL,
    "savescaught" INTEGER NOT NULL,
    "goalkicks" INTEGER NOT NULL,
    "goalsconceded" INTEGER NOT NULL,
    "secondsplayed" INTEGER NOT NULL,
    "keypasses" INTEGER NOT NULL,
    "chancescreated" INTEGER NOT NULL,
    "secondassists" INTEGER NOT NULL,

    CONSTRAINT "MatchPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchEvent" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "eventType" "EventType" NOT NULL,
    "player1Id" INTEGER,
    "player2Id" INTEGER,
    "player3Id" INTEGER,
    "minute" INTEGER NOT NULL,

    CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchPlayerPosition" (
    "id" SERIAL NOT NULL,
    "matchPlayerId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "secondsPlayed" INTEGER NOT NULL,

    CONSTRAINT "MatchPlayerPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_steamid_key" ON "Player"("steamid");

-- CreateIndex
CREATE UNIQUE INDEX "Match_mongoID_key" ON "Match"("mongoID");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayer_matchId_playerId_key" ON "MatchPlayer"("matchId", "playerId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_player3Id_fkey" FOREIGN KEY ("player3Id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayerPosition" ADD CONSTRAINT "MatchPlayerPosition_matchPlayerId_fkey" FOREIGN KEY ("matchPlayerId") REFERENCES "MatchPlayer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
