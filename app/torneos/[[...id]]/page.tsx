import { notFound } from "next/navigation";
import Challonge from "../../../components/challonge";
import Title from "../../../components/ui/title";
import PositionsComponent from "../../../components/positions";
import { getManyPositions } from "../../../lib/getFromDB";
import {
  getAllTemporadas,
  getChallonges,
  getTablas,
  getTemporada,
  temporadaActual
} from "../../../utils/Utils";
import Selector from "./selector";
import TorneosJSON from "../../../utils/Torneos.json";

export async function generateMetadata({ params, searchParams }) {
  const id = params.id?.[0] || temporadaActual();

  if (getAllTemporadas().includes(id)) {
    return {
      title: `Torneos ${TorneosJSON.find(item => item.temporada === id).titulo}`
    };
  }
}

export default async function Torneos({ params, searchParams }) {
  const id = params.id?.[0] || temporadaActual();
  if (!getAllTemporadas().includes(id)) notFound();

  const listaTablas = getTablas(id);
  const challonges = getChallonges(id);
  const listaPosiciones = await getManyPositions(
    listaTablas.map(item => item.table)
  );
  const tablas = listaTablas.map((item, index) => ({
    ...item,
    teams: listaPosiciones[index]
  }));
  const temporada = getTemporada(id);

  return (
    <div className="flex flex-col gap-y-4">
      <Selector temporada={temporada} />
      <div className="flex flex-wrap justify-center gap-4">
        {tablas.map(
          item =>
            item.teams.length > 0 && (
              <div key={item.name} className="max-w-xl grow overflow-x-auto">
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
  );
}
