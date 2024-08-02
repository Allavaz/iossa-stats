import { notFound } from "next/navigation";
import Challonge from "../../../components/challonge";
import PositionsComponent from "../../../components/positions";
import Title from "../../../components/ui/title";
import {
  getManyPositions,
  getMatches,
  getTop10Assists,
  getTop10Goals,
  getTournamentWinners
} from "../../../lib/getFromDB";
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

export async function generateMetadata({ params, searchParams }) {
  const editable = params.id?.includes(process.env.ENDPOINT);
  if (editable) {
    params.id = params.id.filter(item => item !== process.env.ENDPOINT);
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

export default async function Torneos({ params, searchParams }) {
  const editable = params.id?.includes(process.env.ENDPOINT);
  if (editable) {
    params.id = params.id.filter(item => item !== process.env.ENDPOINT);
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
  const top10Goleadores = await getTop10Goals(torneo + temporada);
  const top10Asistidores = await getTop10Assists(torneo + temporada);
  const resultados = await getMatches(torneo + temporada);
  const winners = await getTournamentWinners(
    torneoLabel + " " + temporada.toUpperCase()
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="hidden sm:contents">
        <TorneoSelect mobile={false} torneo={torneo} />
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="flex gap-2">
          <div className="contents sm:hidden">
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
          />
        )}
        <div className="flex flex-col gap-4 sm:flex-row">
          {tablas.length > 0 && (
            <div className="flex flex-col gap-4">
              {tablas.map(
                item =>
                  item.teams.length > 0 && (
                    <div key={item.name} className="w-full">
                      <PositionsComponent
                        key={item.name}
                        teams={item.teams}
                        header={
                          isMultiStage
                            ? item.name.split(" - ")[1]
                            : "Posiciones"
                        }
                      />
                    </div>
                  )
              )}
            </div>
          )}
          <div
            className={`flex ${
              tablas.length > 0 && "flex-col"
            } w-full flex-wrap gap-4 sm:flex-nowrap`}
          >
            <Top10Goleadores players={top10Goleadores} category={null} />
            <Top10Asistidores players={top10Asistidores} category={null} />
          </div>
        </div>
        {challonge && (
          <div className="flex flex-col gap-y-4">
            <Title>Eliminatorias</Title>
            <Challonge id={challonge.challonge} />
          </div>
        )}
        <Results matches={resultados} isMultiStage={isMultiStage} />
      </div>
    </div>
  );
}
