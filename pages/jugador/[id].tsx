import PlayerCard from "../../components/playerCard";
import { getPlayerMatches, getPlayerScoredTeams } from "../../lib/getFromDB";
import { getSteamInfo } from "../../lib/getFromSteam";
import PlayerStats from "../../utils/PlayerStats";
import { useState, useEffect } from "react";
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
  const statsLast15 = PlayerStats(
    playerMatches.slice(0, 15),
    context.params.id
  );
  const playerMatchesReversed = [...playerMatches].reverse();
  const playerTeams = PlayerTeams(
    context.params.id as string,
    playerMatchesReversed
  );
  return {
    props: {
      playerMatches,
      statsAll,
      statsLast15,
      teamsMostScored,
      steamInfo: steamInfo[0],
      playerTeams
    }
  };
};

export default function Player({
  playerMatches,
  statsAll,
  statsLast15,
  teamsMostScored,
  steamInfo,
  playerTeams
}) {
  const [_, setDate] = useState(new Date());

  useEffect(() => {
    // Este codigo redibuja los graficos cuando se cambia de tema claro
    // a tema oscuro o viceversa
    let observer = new MutationObserver(mutations => {
      if (mutations[0].attributeName === "data-theme") {
        setDate(new Date());
      }
    });

    observer.observe(document.documentElement, { attributes: true });
  }, []);

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
      <PlayerCard
        statsAll={statsAll}
        statsLast15={statsLast15}
        steamInfo={steamInfo}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "stretch",
          justifyContent: "space-between",
          columnGap: "20px"
        }}
      >
        <PlayerTeamsTable teams={playerTeams} />
        <PlayerMostScoredTeams teams={teamsMostScored} />
      </div>
      <PlayerMatches matches={playerMatches} id={statsAll.steamid} />
    </>
  );
}
