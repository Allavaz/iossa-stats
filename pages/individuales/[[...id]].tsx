import IndividualStats from "../../components/individualStats";
import { getPlayers } from "../../lib/getFromDB";
import Head from "next/head";
import Selector from "../../components/selector";
import { useRouter } from "next/router";
import {
  getAllQueries,
  getTemporada,
  getCategory,
  temporadaActual
} from "../../utils/Utils";

export async function getServerSideProps(context) {
  let id;
  let page = 0;
  const queryparams = new URLSearchParams(context.req.url.split("?")[1]);
  if (queryparams.has("page")) {
    page = parseInt(queryparams.get("page")) - 1;
  }
  if (context.params.id) {
    id = context.params.id[0];
  } else id = temporadaActual();
  if (getAllQueries().includes(id)) {
    let players = await getPlayers(id);
    let category = getCategory(id);
    return {
      props: {
        players: JSON.parse(JSON.stringify(players)),
        category: category,
        temporada: getTemporada(id),
        page: page
      }
    };
  } else {
    return { notFound: true };
  }
}

export default function Individuales({ players, category, temporada, page }) {
  const router = useRouter();

  function selectTorneo(id) {
    router.push("/individuales/" + id);
  }

  return (
    <>
      <Head>
        <title>Estadísticas {category} | IOSoccer Sudamérica</title>
        <meta
          name="title"
          content={`Estadísticas ${category} | IOSoccer Sudamérica`}
        />
        <meta name="description" content={`Estadísticas ${category}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Estadísticas ${category} | IOSoccer Sudamérica`}
        />
        <meta property="og:description" content={`Estadísticas ${category}`} />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
      </Head>
      <Selector
        selectTorneo={selectTorneo}
        selectTemporada={selectTorneo}
        temporada={temporada}
      />
      <IndividualStats players={players} category={category} pagina={page} />
    </>
  );
}
