import Results from "../../components/results";
import { getMatches } from "../../lib/getFromDB";
import Head from "next/head";
import Selector from "../../components/selector";
import { useRouter } from "next/router";
import {
  getAllQueries,
  getCategory,
  getTemporada,
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
    let matches = await getMatches(id);
    let category = getCategory(id);
    return {
      props: {
        matches,
        category: category,
        temporada: getTemporada(id),
        page: page
      }
    };
  } else {
    return { notFound: true };
  }
}

export default function Resultados({ matches, category, temporada, page }) {
  const router = useRouter();

  function selectTorneo(id) {
    router.push("/resultados/" + id);
  }

  return (
    <>
      <Head>
        <title>Resultados {category} | IOSoccer Sudamérica</title>
        <meta
          name="title"
          content={`Resultados ${category} | IOSoccer Sudamérica`}
        />
        <meta name="description" content={`Resultados ${category}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Resultados ${category} | IOSoccer Sudamérica`}
        />
        <meta property="og:description" content={`Resultados ${category}`} />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
      </Head>
      <Selector
        selectTorneo={selectTorneo}
        selectTemporada={selectTorneo}
        temporada={temporada}
      />
      <Results matches={matches} category={category} pagina={page} />
    </>
  );
}
