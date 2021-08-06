import FullPositions from '../../components/fullPositions';
import { getManyPositions } from '../../lib/getFromDB';
import Head from 'next/head';
import Torneos from '../../utils/Torneos.json';
import { useRouter } from 'next/router';
import { temporadaActual } from '../../utils/Utils';

function getTablas(temp) {
  let tablas = [];
  for (let i in Torneos) {
    if (Torneos[i].temporada === temp) {
      for (let j in Torneos[i].torneos) {
        if (Torneos[i].torneos[j].tabla && 
          (tablas.findIndex(e => e.table === Torneos[i].torneos[j].tabla)) === -1) {
          tablas.push({
            table: Torneos[i].torneos[j].tabla,
            name: Torneos[i].torneos[j].torneo
          })
        }
      }
    }
  }
  return tablas;
}

function getAllTemporadas() {
  let temps = []
  for (let i in Torneos) {
    temps.push(Torneos[i].temporada)
  }
  return temps;
}

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
  if (context.params.id) id = context.params.id[0];
  else id = temporadaActual;
  if (getAllTemporadas().includes(id)) {
    let listaTablas = getTablas(id);
    let ids = [];
    for (let i in listaTablas) {
      ids.push(listaTablas[i].table);
    }
    let tablas = await getManyPositions(ids);
    let category = getCategory(id);
    return ({props: {
      tablas: JSON.parse(JSON.stringify(tablas)),
      category: category,
      temporada: getTemporada(id)
    }});
  } else {
    return ({ notFound: true });
  }
}

export default function Posiciones({ tablas, category, temporada }) {
  const router = useRouter();

  function selectTemporada(id) {
    router.push('/posiciones/' + id);
  }

  return (
    <>
      <Head>
        <title>Posiciones {category} | IOSoccer Sudamérica</title>
        <meta name="title" content={`Posiciones ${category} | IOSoccer Sudamérica`} />
        <meta name="description" content={`Posiciones ${category}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Posiciones ${category} | IOSoccer Sudamérica`} />
        <meta property="og:description" content={`Posiciones ${category}`} />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content='IOSoccer Sudamérica' />
      </Head>
      <select id='selector' defaultValue={temporada} onChange={e => selectTemporada(e.target.value)}>
        {Torneos.map((item, index) => (
          item.temporada === 'all' ? null :
          <option key={index} value={item.temporada}>{item.titulo}</option>  
        ))}
      </select>
      <div className='colCon' style={{margin: 0}}>
        {tablas.map((item, index) => (
          <FullPositions key={index} teams={item} torneo={getTablas(temporada)[index].name} unificada={getTablas(temporada)[index].table.startsWith('sd')} />
        ))}
      </div>
    </>
  )
}