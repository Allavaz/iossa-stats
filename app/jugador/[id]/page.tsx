import { notFound } from "next/navigation";
import {
  getPlayer,
  getPlayerMatches,
  getPlayerPositions,
  getPlayerScoredTeams,
  getPlayerTournaments,
  getTournamentPosition
} from "../../../lib/getFromDB";
import { getSteamInfo } from "../../../lib/getFromSteam";
import PlayerTeams from "../../../utils/PlayerTeams";
import { temporadaActual } from "../../../utils/Utils";
import PlayerCard from "./playerCard";
import PlayerLigas from "./playerLigas";
import PlayerMatches from "./playerMatches";
import PlayerMostScoredTeams from "./playerMostScoredTeams";
import PlayerTeamsTable from "./playerTeams";

export async function generateMetadata(props) {
  const params = await props.params;
  const steamid = decodeURIComponent(params.id);
  const player = await getPlayer(steamid, "all");

  if (!player) notFound();

  return {
    title: `${player.name}`
  };
}

export default async function Jugador(props) {
  const params = await props.params;
  const steamid = decodeURIComponent(params.id);

  const [
    playerMatches,
    steamInfo,
    teamsMostScored,
    player,
    playerPositions,
    playerTournaments
  ] = await Promise.all([
    getPlayerMatches(steamid),
    getSteamInfo([steamid]),
    getPlayerScoredTeams(steamid),
    getPlayer(steamid, "all"),
    getPlayerPositions(steamid, temporadaActual()),
    getPlayerTournaments(steamid)
  ]);

  if (playerMatches.length === 0) notFound();

  if (!steamInfo || steamInfo.length === 0) notFound();

  const playerTeams = PlayerTeams(steamid, playerMatches);

  if (!playerTournaments || playerTournaments.length === 0) notFound();

  for (const tournament of playerTournaments) {
    if (
      /liga|division/i.test(tournament._id) &&
      !/playoff/i.test(tournament._id) &&
      !/grupo/i.test(tournament._id) &&
      !/desempate/i.test(tournament._id) &&
      !/promoción/i.test(tournament._id)
    ) {
      const position = await getTournamentPosition(
        tournament.team,
        tournament._id
      );
      tournament.position = position;
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <PlayerCard
        player={player}
        steamInfo={steamInfo[0]}
        playerPositions={playerPositions}
        playerMatches={playerMatches}
      />
      <div className="flex flex-wrap justify-center gap-4">
        <div className="max-w-xl grow overflow-x-auto">
          <PlayerTeamsTable teams={playerTeams} />
        </div>
        <div className="max-w-xl grow overflow-x-auto">
          <PlayerLigas
            tournaments={playerTournaments.filter(t => t.position)}
          />
        </div>
        <div className="max-w-xl grow overflow-x-auto">
          <PlayerMostScoredTeams teams={teamsMostScored} />
        </div>
      </div>
      <PlayerMatches matches={playerMatches} id={player.steamid} />
    </div>
  );
}
