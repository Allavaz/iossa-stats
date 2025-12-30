import { notFound } from "next/navigation";
import {
  getPalmares,
  getPlayerPositions,
  getTeamMatches,
  getTeamPlayers,
  getTeamRivals,
  getTeamStats
} from "../../../lib/getFromDB";
import { getSteamInfo } from "../../../lib/getFromSteam";
import { getTeamLogo, temporadaActual } from "../../../utils/Utils";
import Palmares from "./palmares";
import Roster from "./roster";
import TeamArqueros from "./teamArqueros";
import TeamAsistidores from "./teamAsistidores";
import TeamCard from "./teamCard";
import TeamGoleadores from "./teamGoleadores";
import TeamHistoricos from "./teamHistoricos";
import TeamMatches from "./teamMatches";
import TeamRivals from "./teamRivals";
import TeamDefensores from "./teamDefensores";

export async function generateMetadata({ params, searchParams }) {
  const teamName = decodeURIComponent(params.id);

  return {
    title: teamName
  };
}

export default async function EquipoPage({ params, searchParams }) {
  const teamName = decodeURIComponent(params.id);

  const [matches, allPlayers, roster, rosterInfo, rivals, stats, palmares] =
    await Promise.all([
      getTeamMatches(teamName, "all"),
      getTeamPlayers(teamName, "all"),
      getTeamPlayers(teamName, temporadaActual()),
      getSteamInfo(
        (
          await getTeamPlayers(teamName, temporadaActual())
        ).map(player => player._id)
      ),
      getTeamRivals(teamName),
      getTeamStats(teamName, "all"),
      getPalmares(teamName)
    ]);

  if (matches.length === 0) return notFound();

  for (const data of [matches, allPlayers, roster, rosterInfo, rivals, stats]) {
    if (!data) return notFound();
  }

  const teamLogo = getTeamLogo(teamName);

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

  return (
    <div className="flex flex-col gap-y-4">
      <TeamCard
        teamname={teamName}
        logo={teamLogo}
        matches={matches}
        stats={stats}
      />
      {palmares.length > 0 && <Palmares palmares={palmares} />}
      {roster.length > 0 && <Roster roster={roster} />}
      <div className="flex flex-wrap justify-center gap-4">
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
          <TeamDefensores players={allPlayers} />
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
