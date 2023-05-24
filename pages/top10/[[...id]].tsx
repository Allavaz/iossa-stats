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
  getTop10Rusticos,
  getTop10Saves
} from "../../lib/getFromDB";
import Selector from "../../components/selector";
import { useRouter } from "next/router";
import Top10Goleadores from "../../components/top10Goleadores";
import Top10Asistidores from "../../components/top10Asistidores";
import Top10Rusticos from "../../components/top10Rusticos";
import Top10Arqueros from "../../components/top10Arqueros";

export async function getServerSideProps(context) {
  let id;
  if (context.params.id) id = context.params.id[0];
  else id = temporadaActual();
  if (getAllQueries().includes(id)) {
    let goleadores = await getTop10Goals(id);
    let asistidores = await getTop10Assists(id);
    let rusticos = await getTop10Rusticos(id);
    let arqueros = await getTop10Saves(id);
    let category = getCategory(id);
    return {
      props: {
        goleadores: JSON.parse(JSON.stringify(goleadores)),
        asistidores: JSON.parse(JSON.stringify(asistidores)),
        rusticos: JSON.parse(JSON.stringify(rusticos)),
        arqueros: JSON.parse(JSON.stringify(arqueros)),
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
  arqueros,
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
      <div className="flex flex-col gap-y-4">
        <Selector
          selectTorneo={selectTorneo}
          selectTemporada={selectTorneo}
          temporada={temporada}
        />
        <div className="flex flex-wrap justify-evenly gap-4">
          <div className="grow overflow-x-auto">
            <Top10Goleadores players={goleadores} category={category} />
          </div>
          <div className="grow overflow-x-auto">
            <Top10Asistidores players={asistidores} category={category} />
          </div>
          <div className="grow overflow-x-auto">
            <Top10Rusticos players={rusticos} category={category} />
          </div>
          <div className="grow overflow-x-auto">
            <Top10Arqueros players={arqueros} category={category} />
          </div>
        </div>
      </div>
    </>
  );
}
