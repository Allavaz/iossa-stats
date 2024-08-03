import Link from "next/link";
import Title from "../../components/ui/title";
import { getPalmares } from "../../lib/getFromDB";
import {
  getTeamLogo,
  getTorneoQuery,
  getTournamentIcon
} from "../../utils/Utils";
import Card from "../../components/ui/card";

const torneoWeights = {
  "Liga D1": 5,
  "Liga D2": 3,
  "Liga D3": 2,
  "Liga D4": 1,
  "Copa Master": 4,
  "Copa valencARc": 4,
  "Copa Maradei": 5,
  "Recopa Master": 3,
  "Recopa Maradei": 3,
  "Supercopa Master": 3,
  "Copa del Sur": 4,
  "Copa Gubero": 4,
  "Liga Master": 3,
  "Division de Honor": 3,
  "Superliga D1": 4,
  "Liga Zero": 1,
  "Copa D1": 4,
  "Copa D2": 3,
  "Copa D3": 2,
  "Copa Intrazonal de Oro": 4,
  "Copa Intrazonal de Plata": 3
};

export const metadata = {
  title: "Palmarés"
};

function groupTorneos(torneos) {
  const result = {};
  torneos.forEach(torneo => {
    const match = torneo.match(/(.*) T(\d+)/);
    const key = match[1];
    const temporada = parseInt(match[2]);
    if (!result[key]) {
      result[key] = [temporada];
    } else {
      result[key].push(temporada);
    }
  });
  const resultArray = [];
  for (const key in result) {
    resultArray.push({
      torneo: key,
      temporadas: result[key]
    });
  }
  resultArray.sort((a, b) => {
    if (torneoWeights[a.torneo] === torneoWeights[b.torneo]) {
      return a.torneo.localeCompare(b.torneo);
    }
    return torneoWeights[b.torneo] - torneoWeights[a.torneo];
  });
  return resultArray;
}

function sortTeams(a, b) {
  if (a.score === b.score) {
    return a._id.localeCompare(b._id);
  }
  return b.score - a.score;
}

function addScore(teams) {
  return teams.map(team => {
    const score = team.torneos.reduce((acc, torneo) => {
      const torneoName = torneo.match(/(.*) T\d+/)[1];
      return acc + torneoWeights[torneoName];
    }, 0);
    return {
      ...team,
      score
    };
  });
}

export default async function Palmares() {
  let palmares = await getPalmares();
  palmares = addScore(palmares);
  palmares.sort(sortTeams);

  return (
    <div className="flex flex-col gap-y-4">
      <Title>Palmarés</Title>
      {palmares.map(item => (
        <Card key={item._id}>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link
              href={`/equipo/${item._id}`}
              className="flex items-center gap-4 font-heading text-2xl"
            >
              <img
                className="h-28"
                src={getTeamLogo(item._id)}
                alt={item._id}
              />
              <div>{item._id}</div>
            </Link>
            <div className="flex flex-wrap justify-center gap-4">
              {groupTorneos(item.torneos).map(torneo => (
                <div key={torneo} className="flex flex-col items-center gap-2">
                  <img
                    className="h-20"
                    src={getTournamentIcon(torneo.torneo)}
                    alt={torneo.torneo}
                    title={torneo.torneo}
                  />
                  <div className="font-heading text-2xl text-neutral-600 dark:text-neutral-400">
                    {torneo.temporadas.map((temporada, index) => (
                      <Link
                        href={`/torneos/${getTorneoQuery(
                          torneo.torneo
                        )}/t${temporada}`}
                        key={temporada}
                      >
                        T{temporada}
                        {index < torneo.temporadas.length - 1 && ", "}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
      <div className="text-sm italic text-neutral-600 dark:text-neutral-400">
        <p>
          Los torneos fueron ponderados con un sistema de puntos de acuerdo a su
          prestigio, de la siguiente manera:
        </p>
        <br />
        {Object.entries(torneoWeights).map(([torneo, peso]) => (
          <p key={torneo}>
            {torneo}: {peso} puntos
          </p>
        ))}
        <br />
        <p>
          Los equipos se ordenan primero por puntaje y luego alfabéticamente.
        </p>
      </div>
    </div>
  );
}
