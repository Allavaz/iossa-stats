import PlayerCard from "../../components/playerCard";
import { getPlayerMatches, getPlayerScoredTeams } from "../../lib/getFromDB";
import { getSteamInfo } from "../../lib/getFromSteam";
import PlayerStats from "../../utils/PlayerStats";
import Head from "next/head";
import PlayerTeamsTable from "../../components/playerTeams";
import PlayerMatches from "../../components/playerMatches";
import PlayerTeams from "../../utils/PlayerTeams";
import { GetServerSideProps } from "next";
import PlayerMostScoredTeams from "../../components/playerMostScoredTeams";

export const getServerSideProps: GetServerSideProps = async context => {
  const [playerMatches, steamInfo, teamsMostScored] = await Promise.all([
    getPlayerMatches(context.params.id as string),
    getSteamInfo([context.params.id as string]),
    getPlayerScoredTeams(context.params.id as string)
  ]);
  if (playerMatches.length === 0) return { notFound: true };
  if (!steamInfo) return { notFound: true };
  const statsAll = PlayerStats(playerMatches, context.params.id);
  const playerMatchesReversed = [...playerMatches].reverse();
  const playerTeams = PlayerTeams(
    context.params.id as string,
    playerMatchesReversed
  );
  return {
    props: {
      playerMatches,
      statsAll,
      teamsMostScored,
      steamInfo: steamInfo[0],
      playerTeams
    }
  };
};

export default function Player({
  playerMatches,
  statsAll,
  teamsMostScored,
  steamInfo,
  playerTeams
}) {
  return (
    <>
      <Head>
        <title>{statsAll.name} | IOSoccer Sudamérica</title>
        <meta name="title" content={`${statsAll.name} | IOSoccer Sudamérica`} />
        <meta name="description" content={statsAll.team} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
        <meta
          property="og:title"
          content={`${statsAll.name} | IOSoccer Sudamérica`}
        />
        <meta property="og:description" content={statsAll.team} />
        <meta property="og:image" content={steamInfo.avatarfull} />
      </Head>
      <div className="flex flex-col gap-y-4">
        <PlayerCard statsAll={statsAll} steamInfo={steamInfo} />
        <div className="flex flex-wrap gap-4">
          <div className="grow overflow-x-auto">
            <PlayerTeamsTable teams={playerTeams} />
          </div>
          <div className="grow overflow-x-auto">
            <PlayerMostScoredTeams teams={teamsMostScored} />
          </div>
        </div>
        <PlayerMatches matches={playerMatches} id={statsAll.steamid} />
      </div>
    </>
  );
}
