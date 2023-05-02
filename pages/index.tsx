import Head from "next/head";
import { getMatches, getManyPositions } from "../lib/getFromDB";
import Matches from "../components/matches";
import PositionsComponent from "../components/positions";
import { getTablas, temporadaActual } from "../utils/Utils";
import { Match, Positions } from "../types";

export async function getServerSideProps() {
  let matches = await getMatches("20");
  let listaTablas = getTablas(temporadaActual());
  let listaPosiciones = await getManyPositions(
    listaTablas.map(item => item.table)
  );
  let result = listaTablas.map((item, index) => ({
    ...item,
    teams: listaPosiciones[index]
  }));
  return {
    props: {
      matches: JSON.parse(JSON.stringify(matches)),
      tablas: JSON.parse(JSON.stringify(result))
    }
  };
}

interface Props {
  matches: Match[];
  tablas: {
    table: string;
    name: string;
    teams: Positions[];
  }[];
}

export default function Home({ matches, tablas }: Props) {
  return (
    <>
      <Head>
        <title>IOSoccer Sudamérica</title>
        <meta name="title" content="IOSoccer Sudamérica" />
        <meta
          name="description"
          content="Comunidad sudamericana de IOSoccer. Resultados, estadísticas, rankings y más."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="IOSoccer Sudamérica" />
        <meta
          property="og:description"
          content="Comunidad sudamericana de IOSoccer. Resultados, estadísticas, rankings y más."
        />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
      </Head>
      <div className="flex flex-wrap gap-4 sm:flex-nowrap justify-center">
        <div className="grow">
          <Matches matches={matches} />
        </div>
        <div className="flex flex-col gap-y-4 sm:grow-0 grow">
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
    </>
  );
}
