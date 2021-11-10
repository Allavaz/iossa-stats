import Head from "next/head";
import { getMatches, getManyPositions } from "../lib/getFromDB";
import Matches from "../components/matches";
import MiniPositions from "../components/miniPositions";

const minitables = [
  { torneo: "sd1t8", header: "Superliga D1 T8" },
  { torneo: "lzt8a", header: "Liga Zero T8 - Grupo A" },
  { torneo: "lzt8b", header: "Liga Zero T8 - Grupo B" }
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
            <MiniPositions
              teams={item}
              key={index}
              header={minitables[index].header}
              unificada={minitables[index].torneo.startsWith("sd")}
            ></MiniPositions>
          ))}
        </div>
      </div>
    </>
  );
}
