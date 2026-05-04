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
  getTop10Saves,
  getTeams
} from "../../../lib/getFromDB";
import {
  buildTeamsMap,
  getAllQueries,
  getCategory,
  getTemporada,
  temporadaActual
} from "../../../utils/Utils";
import Top10Intercepciones from "./top10Intercepciones";

export async function generateMetadata(props) {
  const params = await props.params;
  const id = params.id?.[0] || temporadaActual();

  if (getAllQueries().includes(id)) {
    return {
      title: `Top 10 ${getCategory(id)}`
    };
  }
}

export default async function Top10(props) {
  const params = await props.params;
  const id = params.id?.[0] || temporadaActual();

  if (!getAllQueries().includes(id)) notFound();

  const category = getCategory(id);
  const temporada = getTemporada(id);
  const [goleadores, asistidores, rusticos, arqueros, intercepciones, teamsData] = await Promise.all([
    getTop10Goals(id),
    getTop10Assists(id),
    getTop10Rusticos(id),
    getTop10Saves(id),
    getTop10Interceptions(id),
    getTeams()
  ]);
  const teamsMap = buildTeamsMap(teamsData);

  return (
    <div className="flex flex-col gap-y-4">
      <Selector context={"top10"} temporada={temporada} />
      <div className="flex flex-wrap justify-evenly gap-4">
        <div className="grow overflow-x-auto">
          <Top10Goleadores players={goleadores} category={category} teamsMap={teamsMap} />
        </div>
        <div className="grow overflow-x-auto">
          <Top10Asistidores players={asistidores} category={category} teamsMap={teamsMap} />
        </div>
        <div className="grow overflow-x-auto">
          <Top10Arqueros players={arqueros} category={category} teamsMap={teamsMap} />
        </div>
        <div className="grow overflow-x-auto">
          <Top10Intercepciones players={intercepciones} category={category} teamsMap={teamsMap} />
        </div>
        <div className="grow overflow-x-auto">
          <Top10Rusticos players={rusticos} category={category} teamsMap={teamsMap} />
        </div>
      </div>
    </div>
  );
}
