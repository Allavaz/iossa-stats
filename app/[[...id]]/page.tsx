import { getManyPositions, getMatches, getPlayers } from "../../lib/getFromDB";
import { Match } from "../../types";
import { getTablas, temporadaActual } from "../../utils/Utils";
import Home from "./home";
import MatchEditor from "../partido/[[...id]]/matchEditor";

async function getPosiciones() {
  const listaTablas = getTablas(temporadaActual());
  const listaPosiciones = await getManyPositions(
    listaTablas.map(item => item.table)
  );
  return listaTablas.map((item, index) => ({
    ...item,
    teams: listaPosiciones[index]
  }));
}

export default async function IndexPage({ params }) {
  if (params.id?.[0] === process.env.ENDPOINT) {
    const players = await getPlayers("mini");
    return (
      <MatchEditor
        match={null}
        players={players}
        create={true}
        table={null}
        challonge={null}
      />
    );
  } else {
    const matches: Match[] = await getMatches("20");
    const tablas = await getPosiciones();
    return <Home matches={matches} tablas={tablas} />;
  }
}
