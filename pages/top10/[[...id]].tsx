import Head from "next/head";
import {
  getAllQueries,
  getCategory,
  getTemporada,
  temporadaActual
} from "../../utils/Utils";
import {
  getTop10Assists,
  getTop10Goals,
  getTop10Rusticos
} from "../../lib/getFromDB";
import Selector from "../../components/selector";
import { useRouter } from "next/router";
import Top10Goleadores from "../../components/top10Goleadores";
import Top10Asistidores from "../../components/top10Asistidores";
import Top10Rusticos from "../../components/top10Rusticos";

export async function getServerSideProps(context) {
  let id;
  if (context.params.id) id = context.params.id[0];
  else id = temporadaActual();
  if (getAllQueries().includes(id)) {
    let goleadores = await getTop10Goals(id);
    let asistidores = await getTop10Assists(id);
    let rusticos = await getTop10Rusticos(id);
    let category = getCategory(id);
    return {
      props: {
        goleadores: JSON.parse(JSON.stringify(goleadores)),
        asistidores: JSON.parse(JSON.stringify(asistidores)),
        rusticos: JSON.parse(JSON.stringify(rusticos)),
        category: category,
        temporada: getTemporada(id)
      }
    };
  } else {
    return { notFound: true };
  }
}

export default function Top10({
  goleadores,
  asistidores,
  rusticos,
  category,
  temporada
}) {
  const router = useRouter();

  function selectTorneo(id) {
    router.push("/top10/" + id);
  }

  return (
    <>
      <Head>
        <title>Top 10 {category} | IOSoccer Sudamérica</title>
        <meta
          name="title"
          content={`Top 10 ${category} | IOSoccer Sudamérica`}
        />
        <meta
          name="description"
          content={`Top 10 ${category} de goleadores, asistidores y rústicos`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Top 10 ${category} | IOSoccer Sudamérica`}
        />
        <meta
          property="og:description"
          content={`Top 10 ${category} de goleadores, asistidores y rústicos`}
        />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
      </Head>
      <Selector
        selectTorneo={selectTorneo}
        selectTemporada={selectTorneo}
        temporada={temporada}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly"
        }}
      >
        <Top10Goleadores players={goleadores} category={category} />
        <Top10Asistidores players={asistidores} category={category} />
        <Top10Rusticos players={rusticos} category={category} />
      </div>
    </>
  );
}
