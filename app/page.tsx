import { getMatches, getManyPositions } from "../lib/getFromDB";
import Matches from "../components/matches";
import PositionsComponent from "../components/positions";
import { getTablas, temporadaActual } from "../utils/Utils";
import { Match } from "../types";

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

export default async function Home() {
  const matches: Match[] = await getMatches("20");
  const tablas = await getPosiciones();

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:flex-nowrap">
      <div className="grow">
        <Matches matches={matches} />
      </div>
      <div className="flex grow flex-col gap-y-4 sm:grow-0">
        {tablas.map(
          (item, index) =>
            item.teams.length > 0 && (
              <PositionsComponent
                mini
                teams={item.teams}
                key={index}
                header={item.name}
              />
            )
        )}
      </div>
    </div>
  );
}
