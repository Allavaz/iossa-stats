import { notFound } from "next/navigation";
import { getMatch, getPlayers, getPositions } from "../../../lib/getFromDB";
import Torneos from "../../../utils/Torneos.json";
import MatchComponent from "./match";
import MatchEditor from "./matchEditor";

export async function generateMetadata({ params }) {
  const matchId = params.id?.[0];
  const match = await getMatch(matchId);
  if (!match) {
    return notFound();
  }
  return {
    title: `${match.teams[0].teamname} ${match.teams[0].score} - ${match.teams[1].score} ${match.teams[1].teamname}`,
    openGraph: {
      images: [{ url: `/api/matchcard/${matchId}` }]
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/matchcard/${matchId}`]
    }
  };
}

async function getData(matchId: string) {
  const match = await getMatch(matchId);
  if (!match) {
    return notFound();
  }
  let props: any = {};
  props.match = match;
  for (let i in Torneos) {
    for (let j in Torneos[i].torneos) {
      let t: any = Torneos[i].torneos[j];
      if (t.torneo === match.torneo) {
        if (t.challonge) {
          props.challonge = t.challonge;
        } else if (t.tabla) {
          props.table = {
            positions: await getPositions(t.tabla),
            header: t.tablaLabel || t.torneo
          };
        }
      }
    }
  }
  return props;
}

export default async function MatchPage({ params }) {
  const { match, table, challonge } = await getData(params.id?.[0]);

  if (params.id?.[1] === process.env.ENDPOINT) {
    const players = await getPlayers("mini");
    return (
      <MatchEditor
        match={match}
        players={players}
        create={false}
        table={table}
        challonge={challonge}
      />
    );
  } else {
    return <MatchComponent match={match} table={table} challonge={challonge} />;
  }
}
