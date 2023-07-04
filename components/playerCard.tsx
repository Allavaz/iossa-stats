import Link from "next/link";
import { getTeamLogo } from "../utils/Utils";
import Card from "./commons/card";

function getPosColor(pos: string) {
  switch (pos) {
    case "GK":
      return "#f2c350";
    case "LB":
      return "#36A2EB";
    case "RB":
      return "#36A2EB";
    case "CB":
      return "#36A2EB";
    case "LM":
      return "#3da33b";
    case "RM":
      return "#3da33b";
    case "CM":
      return "#3da33b";
    case "CF":
      return "#FF6384";
    case "LW":
      return "#FF6384";
    case "RW":
      return "#FF6384";
    default:
      return "#ff9800";
  }
}

const commonStats = [
  {
    label: "Victorias",
    value: stats => (
      <>{Math.round((stats.wins / (stats.wins + stats.losses)) * 100)}%</>
    )
  },
  {
    label: "Asistencias",
    value: stats => stats.assists
  },
  {
    label: "Precisión de pases",
    value: stats => (
      <>{Math.round((stats.passescompleted / stats.passes) * 100)}%</>
    )
  },
  {
    label: "Posesión",
    value: stats => <>{Math.round(stats.possession)}%</>
  }
];

const goalkeeperStats = [
  {
    label: "Atajadas",
    value: stats => stats.saves
  },
  {
    label: "Atajadas (s/rebote)",
    value: stats => stats.savescaught
  },
  {
    label: "Goles recibidos",
    value: stats => stats.goalsconceded
  }
];

const fieldPlayerStats = [
  {
    label: "Goles",
    value: stats => stats.goals
  },
  {
    label: "Tiros al arco",
    value: stats => stats.shotsontarget
  }
];

export default function PlayerCard({ player, steamInfo, playerPositions }) {
  const posSpecificStats =
    player.saves > player.shotsontarget ? goalkeeperStats : fieldPlayerStats;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap sm:justify-between">
        <div className="flex gap-x-4">
          <div className="flex flex-col items-center gap-y-2">
            <img
              src={steamInfo.profilePicture}
              alt={player.name}
              className="h-32 rounded-lg border border-neutral-300 shadow-lg dark:border-neutral-700"
            />
            <div className="flex justify-center gap-x-2">
              {playerPositions.map(item => (
                <div
                  className="rounded px-2 py-0.5 text-sm text-white shadow-lg"
                  key={item.position}
                  style={{ backgroundColor: getPosColor(item.position) }}
                >
                  {item.position}
                </div>
              ))}
              {playerPositions.length === 0 && (
                <div className="rounded bg-neutral-400 px-2 py-0.5 text-sm text-white shadow-lg">
                  INACTIVO
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="font-heading text-2xl">{player.name}</div>
            <div
              className={`text-neutral-500 dark:text-neutral-400 ${
                player.name === steamInfo.personaname ? "hidden" : ""
              }`}
            >
              {steamInfo.personaname}
            </div>
            <Link
              href={`/equipo/${player.team}`}
              className="flex items-center gap-x-1 text-neutral-500 dark:text-neutral-400">

              <img
                className="h-6"
                src={getTeamLogo(player.team)}
                alt={player.team}
              />
              <div>{player.team}</div>

            </Link>
            <div className="flex flex-col gap-y-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{`${
                player.matches
              } partido${player.matches === 1 ? "" : "s"}`}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{`${
                player.wins
              } victoria${player.wins === 1 ? "" : "s"}`}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{`${
                player.draws
              } empate${player.draws === 1 ? "" : "s"}`}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{`${
                player.losses
              } derrota${player.losses === 1 ? "" : "s"}`}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[...commonStats, ...posSpecificStats].map(item => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-y-1"
            >
              <div className="text-2xl">{item.value(player)}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
