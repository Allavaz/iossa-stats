import { notFound } from "next/navigation";
import Challonge from "../../../components/challonge";
import PositionsComponent from "../../../components/positions";
import Title from "../../../components/ui/title";
import {
  getManyPositions,
  getMatches,
  getTop10Assists,
  getTop10Goals,
  getTop10Interceptions,
  getTop10Saves,
  getTournamentWinners,
  getTeams
} from "../../../lib/getFromDB";
import { buildTeamsMap } from "../../../utils/Utils";
import {
  getChallongeTorneo,
  getTablasTorneo,
  getTemporadas,
  getTorneoLabel
} from "../../../utils/Utils";
import Top10Asistidores from "../../top10/[[...id]]/top10Asistidores";
import Top10Goleadores from "../../top10/[[...id]]/top10Goleadores";
import Results from "./results";
import TemporadaSelect from "./temporadaSelect";
import TorneoCard from "./torneoCard";
import TorneoSelect from "./torneoSelect";
import TorneoCardEditable from "./torneoCardEditable";
import Top10Arqueros from "../../top10/[[...id]]/top10Arqueros";
import Top10Intercepciones from "../../top10/[[...id]]/top10Intercepciones";
import { isAdmin } from "../../../auth";

export async function generateMetadata(props) {
  const params = await props.params;
  if (params.id?.at(-1) === "edit") {
    params.id = params.id.slice(0, -1);
  }
  const torneo = params.id?.[0] || "d1";
  const torneoLabel = getTorneoLabel(torneo);
  if (!torneoLabel) notFound();
  const temporadas = getTemporadas(torneoLabel);
  const temporada = params.id?.[1] || temporadas[0];

  return {
    title: `${torneoLabel} - Temporada ${temporada.replace("t", "")}`
  };
}

export default async function Torneos(props) {
  const params = await props.params;
  const editable = params.id?.at(-1) === "edit" && await isAdmin();
  if (params.id?.at(-1) === "edit") {
    params.id = params.id.slice(0, -1);
  }
  const torneo = params.id?.[0] || "d1";
  const torneoLabel = getTorneoLabel(torneo);
  if (!torneoLabel) notFound();
  const temporadas = getTemporadas(torneoLabel);
  const temporada = params.id?.[1] || temporadas[0];
  const listaTablas = getTablasTorneo(torneo, temporada);
  const listaPosiciones = await getManyPositions(
    listaTablas.map(item => item.table)
  );
  const tablas = listaTablas.map((item, index) => ({
    ...item,
    teams: listaPosiciones[index]
  }));
  const challonge = getChallongeTorneo(torneoLabel, temporada);
  const isMultiStage = listaTablas.length > 1;
  const [
    top10Goleadores,
    top10Asistidores,
    top10Arqueros,
    top10Intercepciones,
    resultados,
    winners,
    teamsData
  ] = await Promise.all([
    getTop10Goals(torneo + temporada),
    getTop10Assists(torneo + temporada),
    getTop10Saves(torneo + temporada),
    getTop10Interceptions(torneo + temporada),
    getMatches(torneo + temporada),
    getTournamentWinners(torneoLabel + " " + temporada.toUpperCase()),
    getTeams()
  ]);
  const teamsMap = buildTeamsMap(teamsData);

  return (
    <div className="flex max-w-6xl flex-col gap-4 lg:flex-row">
      <div className="hidden lg:contents">
        <TorneoSelect mobile={false} torneo={torneo} />
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="flex gap-2">
          <div className="contents lg:hidden">
            <TorneoSelect mobile={true} torneo={torneo} />
          </div>
          <TemporadaSelect
            temporadas={temporadas}
            temporada={temporada}
            torneo={torneo}
          />
        </div>
        {editable ? (
          <TorneoCardEditable
            torneoLabel={torneoLabel}
            temporada={temporada}
            winners={winners}
          />
        ) : (
          <TorneoCard
            torneoLabel={torneoLabel}
            temporada={temporada}
            winners={winners}
            teamsMap={teamsMap}
          />
        )}
        {challonge && (
          <div className="flex flex-col gap-y-4">
            <Title>Eliminatorias</Title>
            <Challonge id={challonge.challonge} />
          </div>
        )}
        <div className="flex flex-wrap justify-evenly gap-4">
          {tablas.length > 0 &&
            tablas.map(
              item =>
                item.teams.length > 0 && (
                  <div
                    className={`${
                      tablas.length > 1 ? "grow" : "w-full"
                    } overflow-x-auto`}
                    key={item.name}
                  >
                    <PositionsComponent
                      key={item.name}
                      teams={item.teams}
                      header={
                        isMultiStage ? item.name.split(" - ")[1] : "Posiciones"
                      }
                    />
                  </div>
                )
            )}
          <div className="grow overflow-x-auto">
            <Top10Goleadores players={top10Goleadores} category={null} teamsMap={teamsMap} />
          </div>
          <div className="grow overflow-x-auto">
            <Top10Intercepciones
              players={top10Intercepciones}
              category={null}
              teamsMap={teamsMap}
            />
          </div>
          <div className="grow overflow-x-auto">
            <Top10Asistidores players={top10Asistidores} category={null} teamsMap={teamsMap} />
          </div>
          <div className="grow overflow-x-auto">
            <Top10Arqueros players={top10Arqueros} category={null} teamsMap={teamsMap} />
          </div>
        </div>
        <Results matches={resultados} isMultiStage={isMultiStage} />
      </div>
    </div>
  );
}
