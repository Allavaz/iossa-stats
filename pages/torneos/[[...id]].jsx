import Positions from "../../components/positions";
import { getManyPositions } from "../../lib/getFromDB";
import Head from "next/head";
import Torneos from "../../utils/Torneos.json";
import { useRouter } from "next/router";
import temporadaActual from "../../utils/TemporadaActual";
import { getTablas, getAllTemporadas, getChallonges } from "../../utils/Utils";
import Challonge from "../../components/challonge";

function getCategory(arg) {
  if (arg === "all") {
    return "Totales";
  } else if (arg.startsWith("t")) {
    return "Temporada " + arg.replace("t", "");
  } else if (arg === "selecciones") {
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
  if (arg.startsWith("t") || arg === "all" || arg === "selecciones") {
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
  else id = temporadaActual();
  if (getAllTemporadas().includes(id)) {
    let listaTablas = getTablas(id);
    let listaChallonges = getChallonges(id);
    let listaPosiciones = await getManyPositions(
      listaTablas.map(item => item.table)
    );
    let result = listaTablas.map((item, index) => ({
      ...item,
      teams: listaPosiciones[index]
    }));
    let category = getCategory(id);
    return {
      props: {
        tablas: JSON.parse(JSON.stringify(result)),
        challonges: JSON.parse(JSON.stringify(listaChallonges)),
        category: category,
        temporada: getTemporada(id)
      }
    };
  } else {
    return { notFound: true };
  }
}

export default function Posiciones({
  tablas,
  challonges,
  category,
  temporada
}) {
  const router = useRouter();

  function selectTemporada(id) {
    router.push("/torneos/" + id);
  }

  return (
    <>
      <Head>
        <title>Torneos {category} | IOSoccer Sudamérica</title>
        <meta
          name="title"
          content={`Torneos ${category} | IOSoccer Sudamérica`}
        />
        <meta name="description" content={`Torneos ${category}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Torneos ${category} | IOSoccer Sudamérica`}
        />
        <meta property="og:description" content={`Torneos ${category}`} />
        <meta property="og:image" content="/logo-solo.png" />
        <meta property="og:site_name" content="IOSoccer Sudamérica" />
      </Head>
      <select
        className="selector"
        defaultValue={temporada}
        onChange={e => selectTemporada(e.target.value)}
      >
        {Torneos.map((item, index) =>
          item.temporada === "all" ? null : (
            <option key={index} value={item.temporada}>
              {item.titulo}
            </option>
          )
        )}
      </select>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly"
        }}
      >
        {tablas.map(
          (item, index) =>
            item.teams.length > 0 && (
              <Positions key={index} teams={item.teams} header={item.name} />
            )
        )}
      </div>
      {challonges.map((item, index) => (
        <div key={index}>
          <h3 style={{ marginBottom: 0 }}>{item.name.toUpperCase()}</h3>
          <Challonge id={item.challonge}></Challonge>
        </div>
      ))}
    </>
  );
}