import IndividualStats from "../../components/individualStats";
import { getPlayers } from "../../lib/getFromDB";
import Head from 'next/head';
import Torneos from '../../utils/Torneos.json';
import Selector from '../../components/selector';
import { useRouter } from 'next/router';
import { getAllQueries, temporadaActual } from '../../utils/Utils';

function getCategory(arg) {
  if (arg === 'all') {
    return "Totales";
  } else if (arg.startsWith("t")) {
    return ("Temporada " + arg.replace('t', ''));
  } else if (arg === 'selecciones') {
    return "Selecciones";
  } else {
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        if (arg === Torneos[i].torneos[j].query) {
          return Torneos[i].torneos[j].torneo;
        }
      }
    }
  }
}

function getTemporada(arg) {
  if (arg.startsWith('t') || arg === 'all' || arg === 'selecciones') {
    return arg;
  } else {
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        if (arg === Torneos[i].torneos[j].query) {
          return Torneos[i].temporada;
        }
      }
    }
  }
  if (document.getElementById("selector")) {
    let selector = document.getElementById("selector");
    for (let i in selector.options) {
      if (selector.options[i].value === arg) {
        selector.selectedIndex = i;
      }
    }
  }
}

export async function getServerSideProps(context) {
  let id;
  let page = 0;
  if (context.params.id) {
    id = context.params.id[0];
    if (context.params.id.length === 2) {
      page = context.params.id[1] - 1;
    }
  } else id = temporadaActual;
  if (getAllQueries().includes(id)) {
    let players = await getPlayers(id);
    let category = getCategory(id);
    return ({props: {
      players: JSON.parse(JSON.stringify(players)),
      category: category,
      temporada: getTemporada(id),
      page: parseInt(page)
    }});
  } else {
    return ({ notFound: true });
  }
}

export default function Individuales({ players, category, temporada, page }) {
  const router = useRouter();

  function selectTorneo(id) {
    router.push('/individuales/' + id);
  }

  return (
    <>
      <Head>
        <title>Estadísticas {category} | IOSoccer Sudamérica</title>
        <meta name="title" content={`Estadísticas ${category} | IOSoccer Sudamérica`} />
        <meta name="description" content={`Estadísticas ${category}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Estadísticas ${category} | IOSoccer Sudamérica`} />
        <meta property="og:description" content={`Estadísticas ${category}`} />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content='IOSoccer Sudamérica' />
      </Head>
      <Selector selectTorneo={selectTorneo} selectTemporada={selectTorneo} temporada={temporada}></Selector>
      <IndividualStats players={players} category={category} pagina={page} />
    </>
  )
}