-- DropIndex
DROP INDEX "MatchPlayer_matchId_playerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayer_matchId_playerId_side_key" ON "MatchPlayer"("matchId", "playerId", "side");
