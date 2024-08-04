import { DateTime } from "luxon";
import { Match, TeamStats } from "../../../types";
import { temporadaActual } from "../../../utils/Utils";
import Card from "../../../components/ui/card";

interface Props {
  teamname: string;
  logo: string;
  matches: Match[];
  stats: TeamStats;
}

function forma(matches: Match[], teamname: string) {
  return (
    <div className="flex gap-x-1 whitespace-nowrap font-heading text-2xl">
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

function isTeamActive(matches: Match[]) {
  const temporada = "t" + matches[0].torneo.match(/.* T(\d+)/)?.[1];
  const currentSeason = temporadaActual();
  return currentSeason === temporada;
}

export default function TeamCard(props: Props) {
  const activeSince = DateTime.fromISO(props.matches.at(-1).fecha).toFormat(
    "yyyy"
  );
  const lastActivity = DateTime.fromISO(props.matches[0].fecha).toFormat(
    "yyyy"
  );
  const isActive = isTeamActive(props.matches);

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
        <div className="flex flex-wrap justify-center gap-6">
          {isActive && (
            <div className="flex flex-col items-center justify-center gap-y-1">
              {forma(props.matches.slice(0, 5), props.teamname)}
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Forma
              </div>
            </div>
          )}
          <div className="flex flex-col items-center justify-center gap-y-1">
            <div className="font-heading text-2xl">{props.stats.matches}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Partidos
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-1">
            <div className="font-heading text-2xl">{props.stats.wins}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Victorias
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-1">
            <div className="font-heading text-2xl">{props.stats.losses}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Derrotas
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
