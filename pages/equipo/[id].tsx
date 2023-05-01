import { GetServerSideProps } from "next";
import Head from "next/head";
import Roster from "../../components/roster";
import TeamCard from "../../components/teamCard";
import TeamGoleadores from "../../components/teamGoleadores";
import TeamLigas from "../../components/teamLigas";
import TeamMatches from "../../components/teamMatches";
import TeamRivals from "../../components/teamRivals";
import {
  getPlayerPositions,
  getPositions,
  getTeamMatches,
  getTeamPlayers,
  getTeamRivals,
  getTeamStats,
  getTeamTournaments,
  getTournamentPosition
} from "../../lib/getFromDB";
import { getSteamInfo } from "../../lib/getFromSteam";
import { Match, Player, Positions, TeamStats } from "../../types";
import { getTeamLogo, temporadaActual } from "../../utils/Utils";
import Torneos from "../../utils/Torneos.json";
import PositionsComponent from "../../components/positions";
import TeamAsistidores from "../../components/teamAsistidores";

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const [
      matches,
      allPlayers,
      roster,
      rosterInfo,
      tournaments,
      rivals,
      stats
    ] = await Promise.all([
      getTeamMatches(context.params.id as string, "all"),
      getTeamPlayers(context.params.id as string, "all"),
      getTeamPlayers(context.params.id as string, temporadaActual()),
      getSteamInfo(
        (
          await getTeamPlayers(context.params.id as string, temporadaActual())
        ).map(player => player._id)
      ),
      getTeamTournaments(context.params.id as string),
      getTeamRivals(context.params.id as string),
      getTeamStats(context.params.id as string, "all")
    ]);

    if (!rosterInfo) return { notFound: true };

    if (!tournaments) return { notFound: true };

    for (const tournament of tournaments) {
      if (
        /liga|division/i.test(tournament._id) &&
        !/playoff/i.test(tournament._id) &&
        !/grupo/i.test(tournament._id) &&
        !/desempate/i.test(tournament._id) &&
        !/promoción/i.test(tournament._id)
      ) {
        const position = await getTournamentPosition(
          context.params.id as string,
          tournament._id
        );
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
      const positions = await getPlayerPositions(player._id);
      player.positions = positions;
    }

    if (matches.length === 0) return { notFound: true };

    let positions: { position: string; seconds: string }[];

    if (isTeamActive(tournaments.filter(t => t.position)[0])) {
      const torneos = Torneos.find(t => t.temporada === temporadaActual())
        .torneos as { torneo: string; query: string }[];
      const id = torneos.find(
        t => t.torneo === tournaments.filter(t => t.position)[0]._id
      ).query;
      positions = await getPositions(id);
    }

    return {
      props: {
        teamname: context.params.id,
        matches,
        tournaments,
        allPlayers,
        roster,
        rivals,
        stats,
        ...(positions ? { positions } : {}),
        logo: getTeamLogo(context.params.id as string)
      }
    };
  } catch (_) {
    return { notFound: true };
  }
};

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

interface Props {
  teamname: string;
  matches: Match[];
  allPlayers: Player[];
  tournaments: {
    _id: string;
    position?: number;
    matches: number;
    firstmatch: string;
    lastmatch: string;
  }[];
  roster: Player[];
  logo: string;
  rivals: {
    _id: string;
    matches: number;
    wins: number;
    draws: number;
    losses: number;
  }[];
  stats: TeamStats;
  positions?: Positions[];
}

export default function EquipoPage(props: Props) {
  return (
    <>
      <Head>
        <title>{props.teamname} | IOSoccer Sudamérica</title>
        <meta
          name="title"
          content={`${props.teamname} | IOSoccer Sudamérica`}
        />
        <meta name="description" content={props.teamname} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
        <meta
          property="og:title"
          content={`${props.teamname} | IOSoccer Sudamérica`}
        />
        <meta property="og:description" content={props.teamname} />
        <meta
          property="og:image"
          content={`https://iosoccer-sa.bid/${props.logo}`}
        />
      </Head>
      <div>
        <TeamCard
          teamname={props.teamname}
          logo={props.logo}
          matches={props.matches}
          lastTournament={props.tournaments.filter(t => t.position)[0]}
          stats={props.stats}
        />
        {props.roster.length > 0 && <Roster roster={props.roster} />}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: "20px",
            justifyContent: "space-evenly",
            rowGap: "20px"
          }}
        >
          {props.positions && (
            <div style={{ marginTop: "-1em", flexGrow: 1 }}>
              <PositionsComponent
                header={
                  "Posiciones " +
                  props.tournaments.filter(t => t.position)[0]._id
                }
                teams={props.positions}
                highlight={props.teamname}
              />
            </div>
          )}
          <TeamLigas tournaments={props.tournaments.filter(t => t.position)} />
          <TeamGoleadores players={props.allPlayers} />
          <TeamAsistidores players={props.allPlayers} />
          <TeamRivals rivals={props.rivals.filter(r => r.matches > 2)} />
        </div>
        <TeamMatches matches={props.matches} teamname={props.teamname} />
      </div>
    </>
  );
}
