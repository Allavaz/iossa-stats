import PlayerCard from "../../components/playerCard";
import {
  getPlayer,
  getPlayerMatches,
  getPlayerPositions,
  getPlayerScoredTeams,
  getPlayerTournaments,
  getTournamentPosition
} from "../../lib/getFromDB";
import { getSteamInfo } from "../../lib/getFromSteam";
import Head from "next/head";
import PlayerTeamsTable from "../../components/playerTeams";
import PlayerMatches from "../../components/playerMatches";
import PlayerTeams from "../../utils/PlayerTeams";
import { GetServerSideProps } from "next";
import PlayerMostScoredTeams from "../../components/playerMostScoredTeams";
import { temporadaActual } from "../../utils/Utils";
import PlayerLigas from "../../components/playerLigas";

export const getServerSideProps: GetServerSideProps = async context => {
  const [
    playerMatches,
    steamInfo,
    teamsMostScored,
    player,
    playerPositions,
    playerTournaments
  ] = await Promise.all([
    getPlayerMatches(context.params.id as string),
    getSteamInfo([context.params.id as string]),
    getPlayerScoredTeams(context.params.id as string),
    getPlayer(context.params.id as string, "all"),
    getPlayerPositions(context.params.id as string, temporadaActual()),
    getPlayerTournaments(context.params.id as string)
  ]);

  if (playerMatches.length === 0) return { notFound: true };

  if (!steamInfo) return { notFound: true };

  const playerTeams = PlayerTeams(context.params.id as string, playerMatches);

  if (!playerTournaments || playerTournaments.length === 0)
    return { notFound: true };

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

  return {
    props: {
      playerMatches,
      player,
      teamsMostScored,
      steamInfo: steamInfo[0],
      playerTeams,
      playerPositions,
      playerTournaments
    }
  };
};

export default function Player({
  playerMatches,
  player,
  teamsMostScored,
  steamInfo,
  playerTeams,
  playerPositions,
  playerTournaments
}) {
  return (
    <>
      <Head>
        <title>{player.name} | IOSoccer Sudamérica</title>
        <meta name="title" content={`${player.name} | IOSoccer Sudamérica`} />
        <meta name="description" content={player.team} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
        <meta
          property="og:title"
          content={`${player.name} | IOSoccer Sudamérica`}
        />
        <meta property="og:description" content={player.team} />
        <meta property="og:image" content={steamInfo.avatarfull} />
      </Head>
      <div className="flex flex-col gap-y-4">
        <PlayerCard
          player={player}
          steamInfo={steamInfo}
          playerPositions={playerPositions}
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
    </>
  );
}
