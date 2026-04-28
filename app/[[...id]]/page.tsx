import { getManyPositions, getMatches, getPlayers, getTeams } from "../../lib/getFromDB";
import { buildTeamsMap } from "../../utils/Utils";
import { Match } from "../../types";
import { getTablas, temporadaActual } from "../../utils/Utils";
import Home from "./home";
import MatchEditor from "../partido/[[...id]]/matchEditor";
import { notFound } from "next/navigation";
import { isAdmin } from "../../auth";

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

export default async function IndexPage(props) {
  const params = await props.params;
  if (params.id?.[0] === "create") {
    if (!await isAdmin()) return notFound();
    const players = await getPlayers("mini");
    const allTeams = await getTeams();
    const teamsMap = buildTeamsMap(allTeams);
    return (
      <MatchEditor
        match={null}
        players={players}
        create={true}
        table={null}
        challonge={null}
        teamsMap={teamsMap}
      />
    );
  } else if (params.id?.length > 0) {
    notFound();
  } else {
    const matches: Match[] = await getMatches("20");
    const tablas = await getPosiciones();
    return <Home matches={matches} tablas={tablas} />;
  }
}
