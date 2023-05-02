import Head from "next/head";
import { useRouter } from "next/router";
import Challonge from "../../components/challonge";
import PositionsComponent from "../../components/positions";
import { getManyPositions } from "../../lib/getFromDB";
import Torneos from "../../utils/Torneos.json";
import {
  getAllTemporadas,
  getChallonges,
  getTablas,
  temporadaActual
} from "../../utils/Utils";
import { GetServerSideProps } from "next";
import Title from "../../components/commons/title";
import Select from "../../components/commons/select";

function getCategory(arg: string) {
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

function getTemporada(arg: string) {
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
    let selector = document.getElementById("selector") as HTMLSelectElement;
    for (let i in selector.options) {
      if (selector.options[i].value === arg) {
        selector.selectedIndex = parseInt(i);
      }
    }
  }
}

export const getServerSideProps: GetServerSideProps = async context => {
  const id = context.params.id?.[0] || temporadaActual();
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
};

const hideTemporadas = ["all", "primerorden", "segundoorden", "tercerorden"];

export default function Posiciones({
  tablas,
  challonges,
  category,
  temporada
}) {
  const router = useRouter();

  function goToTemporada(id: string) {
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
      <div className="flex flex-col gap-y-4">
        <Select
          defaultValue={temporada}
          onChange={e => goToTemporada(e.target.value)}
        >
          {Torneos.filter(e => !hideTemporadas.includes(e.temporada)).map(
            (item, index) => (
              <option key={index} value={item.temporada}>
                {item.titulo}
              </option>
            )
          )}
        </Select>
        <div className="flex flex-wrap justify-center gap-4">
          {tablas.map(
            item =>
              item.teams.length > 0 && (
                <div className="grow overflow-x-auto">
                  <PositionsComponent
                    key={item.name}
                    teams={item.teams}
                    header={item.name}
                  />
                </div>
              )
          )}
        </div>
        {challonges.map(item => (
          <div className="flex flex-col gap-y-4" key={item.name}>
            <Title>{item.name}</Title>
            <Challonge id={item.challonge} />
          </div>
        ))}
      </div>
    </>
  );
}
