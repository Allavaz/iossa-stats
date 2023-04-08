import PlayerCard from "../../components/playerCard";
import { getPlayerMatches } from "../../lib/getFromDB";
import { getSteamInfo } from "../../lib/getFromSteam";
import PlayerStats from "../../utils/PlayerStats";
import { useState, useEffect } from "react";
import Head from "next/head";
import PlayerTeamsTable from "../../components/playerTeams";
import EfficiencyLine from "../../components/efficiencyLine";
import PlayerMatches from "../../components/playerMatches";
import PlayerTeams from "../../utils/PlayerTeams";

export async function getServerSideProps(context) {
  let playerMatches = await getPlayerMatches(context.params.id[0]);
  if (playerMatches.length === 0) return { notFound: true };
  let statsAll = PlayerStats(playerMatches, context.params.id[0]);
  let statsLast15 = PlayerStats(
    playerMatches.slice(0, 15),
    context.params.id[0]
  );
  let statsLast10 = PlayerStats(
    playerMatches.slice(0, 10),
    context.params.id[0]
  );
  let steamInfo = await getSteamInfo(context.params.id[0]);
  const playerMatchesReversed = [...playerMatches].reverse();
  let playerTeams = PlayerTeams(context.params.id[0], playerMatchesReversed);
  if (!steamInfo) return { notFound: true };
  return {
    props: {
      playerMatches,
      statsAll,
      statsLast15,
      statsLast10,
      steamInfo,
      playerTeams
    }
  };
}

export default function Player({
  playerMatches,
  statsAll,
  statsLast15,
  statsLast10,
  steamInfo,
  playerTeams
}) {
  const [date, setDate] = useState(new Date());

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
          columnGap: "10px"
        }}
        suppressHydrationWarning={true}
      >
        <PlayerTeamsTable teams={playerTeams} />
        {typeof window !== "undefined" && (
          <EfficiencyLine
            playerMatches={playerMatches.slice(0, 10)}
            id={statsAll.steamid}
            type={
              statsLast10.saves > statsLast10.shotsontarget ? "saves" : "goals"
            }
          />
        )}
      </div>
      <PlayerMatches matches={playerMatches} id={statsAll.steamid} />
    </>
  );
}
