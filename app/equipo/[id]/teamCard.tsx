import { DateTime } from "luxon";
import { Match, TeamStats } from "../../../types";
import Torneos from "../../../utils/Torneos.json";
import { temporadaActual } from "../../../utils/Utils";
import Card from "../../../components/commons/card";

interface Props {
  teamname: string;
  logo: string;
  matches: Match[];
  lastLiga: {
    _id: string;
    position?: number;
    matches: number;
    firstmatch: string;
    lastmatch: string;
  };
  stats: TeamStats;
}

function forma(matches: Match[], teamname: string) {
  return (
    <div className="flex gap-x-1 whitespace-nowrap text-2xl">
      {matches.map(match => {
        const result = match.teams.find(t => t.teamname === teamname).result;
        switch (result) {
          case 1:
            return (
              <div key={match.fecha} style={{ color: "green" }}>
                W
              </div>
            );
          case 0:
            return (
              <div key={match.fecha} style={{ color: "gold" }}>
                D
              </div>
            );
          case -1:
            return (
              <div key={match.fecha} style={{ color: "red" }}>
                L
              </div>
            );
        }
      })}
    </div>
  );
}

function isTeamActive(lastTournament) {
  try {
    const temporada = Torneos.find(t => t.temporada === temporadaActual()) as {
      torneos: { torneo: string }[];
    };
    if (temporada.torneos.find(t => t.torneo === lastTournament._id)) {
      return true;
    } else {
      return false;
    }
  } catch (_) {
    return false;
  }
}

export default function TeamCard(props: Props) {
  const activeSince = DateTime.fromISO(props.matches.at(-1).fecha).toFormat(
    "yyyy"
  );
  const lastActivity = DateTime.fromISO(props.matches[0].fecha).toFormat(
    "yyyy"
  );
  const isActive = isTeamActive(props.lastLiga);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-between sm:p-4">
        <div className="flex items-center justify-center gap-x-4">
          <img className="h-32" src={props.logo} alt={props.teamname} />
          <div className="flex flex-col gap-y-2">
            <div className="font-heading text-2xl">
              {props.teamname} {!isActive && "⚰️"}
            </div>
            {isActive ? (
              <>
                {props.lastLiga && (
                  <div className="text-neutral-500 dark:text-neutral-400">{`${props.lastLiga.position}º en ${props.lastLiga._id}`}</div>
                )}
                <div className="text-neutral-500 dark:text-neutral-400">
                  Activo desde {activeSince}
                </div>
              </>
            ) : (
              <div className="text-neutral-500 dark:text-neutral-400">
                Activo por última vez en {lastActivity}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {isActive && (
            <div className="flex flex-col items-center justify-center gap-y-1">
              {forma(props.matches.slice(0, 5), props.teamname)}
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Forma
              </div>
            </div>
          )}
          <div className="flex flex-col items-center justify-center gap-y-1">
            <div className="text-2xl">{props.stats.matches}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Partidos
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-1">
            <div className="text-2xl">{props.stats.wins}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Victorias
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-1">
            <div className="text-2xl">{props.stats.losses}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Derrotas
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
