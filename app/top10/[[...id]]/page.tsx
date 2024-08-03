import { notFound } from "next/navigation";
import Selector from "../../../components/selector";
import Top10Arqueros from "./top10Arqueros";
import Top10Asistidores from "./top10Asistidores";
import Top10Goleadores from "./top10Goleadores";
import Top10Rusticos from "./top10Rusticos";
import {
  getTop10Assists,
  getTop10Goals,
  getTop10Interceptions,
  getTop10Rusticos,
  getTop10Saves
} from "../../../lib/getFromDB";
import {
  getAllQueries,
  getCategory,
  getTemporada,
  temporadaActual
} from "../../../utils/Utils";
import Top10Intercepciones from "./top10Intercepciones";

export async function generateMetadata({ params, searchParams }) {
  const id = params.id?.[0] || temporadaActual();

  if (getAllQueries().includes(id)) {
    return {
      title: `Top 10 ${getCategory(id)}`
    };
  }
}

export default async function Top10({ params, searchParams }) {
  const id = params.id?.[0] || temporadaActual();

  if (!getAllQueries().includes(id)) notFound();

  const category = getCategory(id);
  const temporada = getTemporada(id);
  const goleadores = await getTop10Goals(id);
  const asistidores = await getTop10Assists(id);
  const rusticos = await getTop10Rusticos(id);
  const arqueros = await getTop10Saves(id);
  const intercepciones = await getTop10Interceptions(id);

  return (
    <div className="flex flex-col gap-y-4">
      <Selector context={"top10"} temporada={temporada} />
      <div className="flex flex-wrap justify-evenly gap-4">
        <div className="grow overflow-x-auto">
          <Top10Goleadores players={goleadores} category={category} />
        </div>
        <div className="grow overflow-x-auto">
          <Top10Asistidores players={asistidores} category={category} />
        </div>
        <div className="grow overflow-x-auto">
          <Top10Arqueros players={arqueros} category={category} />
        </div>
        <div className="grow overflow-x-auto">
          <Top10Intercepciones players={intercepciones} category={category} />
        </div>
        <div className="grow overflow-x-auto">
          <Top10Rusticos players={rusticos} category={category} />
        </div>
      </div>
    </div>
  );
}
