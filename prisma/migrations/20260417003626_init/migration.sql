-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "torneo" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "vod" TEXT,
    "serverName" TEXT,
    "mapName" TEXT,
    "format" INTEGER,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "periods" INTEGER,
    "sourceJson" JSONB NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "steamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchTeam" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "scoreReceived" INTEGER NOT NULL,
    "result" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "shotsOnTarget" INTEGER NOT NULL,
    "possession" DOUBLE PRECISION NOT NULL,
    "passes" INTEGER NOT NULL,
    "passesCompleted" INTEGER NOT NULL,
    "fouls" INTEGER NOT NULL,
    "yellowCards" INTEGER NOT NULL,
    "redCards" INTEGER NOT NULL,
    "offsides" INTEGER NOT NULL,
    "corners" INTEGER NOT NULL,
    "throwIns" INTEGER NOT NULL,
    "penalties" INTEGER NOT NULL,
    "freeKicks" INTEGER NOT NULL,
    "foulsSuffered" INTEGER NOT NULL,
    "goalsConceded" INTEGER NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "ownGoals" INTEGER NOT NULL,
    "tackles" INTEGER NOT NULL,
    "tacklesCompleted" INTEGER NOT NULL,
    "saves" INTEGER NOT NULL,
    "savesCaught" INTEGER NOT NULL,
    "distanceCovered" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "goalKicks" INTEGER NOT NULL,
    "keyPasses" INTEGER NOT NULL,
    "chancesCreated" INTEGER NOT NULL,
    "secondAssists" INTEGER NOT NULL,
    "periodStats" JSONB,

    CONSTRAINT "MatchTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchPlayer" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "matchTeamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "goals" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "shotsOnTarget" INTEGER NOT NULL,
    "passes" INTEGER NOT NULL,
    "passesCompleted" INTEGER NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "saves" INTEGER NOT NULL,
    "fouls" INTEGER NOT NULL,
    "yellowCards" INTEGER NOT NULL,
    "redCards" INTEGER NOT NULL,
    "ownGoals" INTEGER NOT NULL,
    "offsides" INTEGER NOT NULL,
    "distanceCovered" INTEGER NOT NULL,
    "possession" DOUBLE PRECISION NOT NULL,
    "corners" INTEGER NOT NULL,
    "throwIns" INTEGER NOT NULL,
    "penalties" INTEGER NOT NULL,
    "freeKicks" INTEGER NOT NULL,
    "tackles" INTEGER NOT NULL,
    "tacklesCompleted" INTEGER NOT NULL,
    "foulsSuffered" INTEGER NOT NULL,
    "savesCaught" INTEGER NOT NULL,
    "goalKicks" INTEGER NOT NULL,
    "goalsConceded" INTEGER NOT NULL,
    "secondsPlayed" INTEGER NOT NULL,
    "keyPasses" INTEGER NOT NULL,
    "chancesCreated" INTEGER NOT NULL,
    "secondAssists" INTEGER NOT NULL,
    "positions" JSONB NOT NULL,
    "periodData" JSONB NOT NULL,

    CONSTRAINT "MatchPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchEvent" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "second" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "period" TEXT,
    "team" TEXT NOT NULL,
    "player1SteamId" TEXT NOT NULL,
    "player2SteamId" TEXT,
    "player3SteamId" TEXT,
    "bodyPart" INTEGER,
    "posX" DOUBLE PRECISION,
    "posY" DOUBLE PRECISION,

    CONSTRAINT "MatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "torneo" TEXT NOT NULL,
    "winners" JSONB,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_filename_key" ON "Match"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Player_steamId_key" ON "Player"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchTeam_matchId_teamId_key" ON "MatchTeam"("matchId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayer_matchId_playerId_key" ON "MatchPlayer"("matchId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_torneo_key" ON "Tournament"("torneo");

-- AddForeignKey
ALTER TABLE "MatchTeam" ADD CONSTRAINT "MatchTeam_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTeam" ADD CONSTRAINT "MatchTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_matchTeamId_fkey" FOREIGN KEY ("matchTeamId") REFERENCES "MatchTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
