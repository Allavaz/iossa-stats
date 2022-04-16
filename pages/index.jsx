import Head from "next/head";
import { getMatches, getManyPositions } from "../lib/getFromDB";
import Matches from "../components/matches";
import Positions from "../components/positions";

const minitables = [
  { torneo: "d1t9", header: "Liga D1 T9" },
  { torneo: "d2t9", header: "Liga D2 T9" },
  { torneo: "d3t9", header: "Liga D3 T9" },
  { torneo: "maradeit9a", header: "Copa Maradei T9 - Grupo A" },
  { torneo: "maradeit9b", header: "Copa Maradei T9 - Grupo B" },
  { torneo: "maradeit9c", header: "Copa Maradei T9 - Grupo C" },
  { torneo: "maradeit9d", header: "Copa Maradei T9 - Grupo D" }
];

export async function getServerSideProps() {
  let matches = await getMatches("20");
  let torneos = [];
  for (let i in minitables) {
    torneos.push(minitables[i].torneo);
  }
  let tablas = await getManyPositions(torneos);
  return {
    props: {
      matches: JSON.parse(JSON.stringify(matches)),
      tablas: JSON.parse(JSON.stringify(tablas))
    }
  };
}

export default function Home({ matches, tablas }) {
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
      <div className="colCon">
        <Matches matches={matches} />
        <div className="flexTableDiv" style={{ flexGrow: 1 }}>
          {tablas.map((item, index) => (
            <Positions
              mini
              teams={item}
              key={index}
              header={minitables[index].header}
            />
          ))}
        </div>
      </div>
    </>
  );
}
