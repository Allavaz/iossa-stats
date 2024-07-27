import Roster from "./roster";
import TeamCard from "./teamCard";
import TeamGoleadores from "./teamGoleadores";
import TeamLigas from "./teamLigas";
import TeamMatches from "./teamMatches";
import TeamRivals from "./teamRivals";
import {
  getPlayerPositions,
  getPositions,
  getTeamMatches,
  getTeamPlayers,
  getTeamRivals,
  getTeamStats,
  getTeamTournaments,
  getTournamentPosition
} from "../../../lib/getFromDB";
import { getSteamInfo } from "../../../lib/getFromSteam";
import { getTeamLogo, temporadaActual } from "../../../utils/Utils";
import Torneos from "../../../utils/Torneos.json";
import PositionsComponent from "../../../components/positions";
import TeamAsistidores from "./teamAsistidores";
import TeamHistoricos from "./teamHistoricos";
import TeamArqueros from "./teamArqueros";
import { notFound } from "next/navigation";

function isTeamActive(lastTournament) {
  const temporada = Torneos.find(t => t.temporada === temporadaActual()) as {
    torneos: { torneo: string }[];
  };
  if (temporada.torneos.find(t => t.torneo === lastTournament._id)) {
    return true;
  } else {
    return false;
  }
}

export async function generateMetadata({ params, searchParams }) {
  const teamName = decodeURIComponent(params.id);

  return {
    title: teamName
  };
}

export default async function EquipoPage({ params, searchParams }) {
  const teamName = decodeURIComponent(params.id);

  const [matches, allPlayers, roster, rosterInfo, tournaments, rivals, stats] =
    await Promise.all([
      getTeamMatches(teamName, "all"),
      getTeamPlayers(teamName, "all"),
      getTeamPlayers(teamName, temporadaActual()),
      getSteamInfo(
        (
          await getTeamPlayers(teamName, temporadaActual())
        ).map(player => player._id)
      ),
      getTeamTournaments(teamName),
      getTeamRivals(teamName),
      getTeamStats(teamName, "all")
    ]);

  for (const data of [
    matches,
    allPlayers,
    roster,
    rosterInfo,
    tournaments,
    rivals,
    stats
  ]) {
    if (!data) return notFound();
  }

  const teamLogo = getTeamLogo(teamName);

  for (const tournament of tournaments) {
    if (
      /liga|division/i.test(tournament._id) &&
      !/playoff/i.test(tournament._id) &&
      !/grupo/i.test(tournament._id) &&
      !/desempate/i.test(tournament._id) &&
      !/promoción/i.test(tournament._id)
    ) {
      const position = await getTournamentPosition(teamName, tournament._id);
      tournament.position = position;
    }
  }

  for (const player of roster) {
    const playerInfo = rosterInfo.find(
      (playerInfo: { profilePicture: string; steamid: string }) =>
        playerInfo.steamid === player._id
    );
    if (playerInfo) {
      player.profilePicture = playerInfo.profilePicture;
    }
    const positions = await getPlayerPositions(player._id, temporadaActual());
    player.positions = positions;
  }

  if (matches.length === 0) return { notFound: true };

  let positions: { position: string; seconds: string }[];

  const ligas = tournaments.filter(t => t.position);

  if (ligas.length > 0 && isTeamActive(ligas[0])) {
    const torneos = Torneos.find(t => t.temporada === temporadaActual())
      .torneos as { torneo: string; query: string }[];
    const id = torneos.find(t => t.torneo === ligas[0]._id).query;
    positions = await getPositions(id);
  }

  return (
    <div className="flex flex-col gap-y-4">
      <TeamCard
        teamname={teamName}
        logo={teamLogo}
        matches={matches}
        lastLiga={ligas[0]}
        stats={stats}
      />
      {roster.length > 0 && <Roster roster={roster} />}
      <div className="flex flex-wrap justify-center gap-4">
        {positions && (
          <div className="max-w-xl grow overflow-x-auto">
            <PositionsComponent
              header={"Posiciones " + ligas[0]._id}
              teams={positions}
              highlight={teamName}
            />
          </div>
        )}
        <div className="max-w-xl grow overflow-x-auto">
          <TeamLigas tournaments={tournaments.filter(t => t.position)} />
        </div>
        <div className="max-w-xl grow overflow-x-auto">
          <TeamHistoricos players={allPlayers} />
        </div>
        <div className="max-w-xl grow overflow-x-auto">
          <TeamGoleadores players={allPlayers} />
        </div>
        <div className="max-w-xl grow overflow-x-auto">
          <TeamAsistidores players={allPlayers} />
        </div>
        <div className="max-w-xl grow overflow-x-auto">
          <TeamArqueros players={allPlayers} />
        </div>
        <div className="max-w-xl grow overflow-x-auto">
          <TeamRivals rivals={rivals.filter(r => r.matches > 2)} />
        </div>
      </div>
      <TeamMatches matches={matches} teamname={teamName} />
    </div>
  );
}
