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

export default function PlayerCard({ statsAll, steamInfo }) {
  let positions = [];

  for (let i in statsAll.positions) {
    if (statsAll.positions[i].position !== statsAll.lastpos) {
      positions.push(statsAll.positions[i].position);
    }
  }

  const posSpecificStats =
    statsAll.saves > statsAll.shotsontarget
      ? goalkeeperStats
      : fieldPlayerStats;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:flex-nowrap sm:justify-between">
        <div className="flex gap-x-4">
          <div className="flex flex-col gap-y-2">
            <img
              src={steamInfo.profilePicture}
              alt={statsAll.name}
              className="h-32 rounded-lg border border-neutral-300 shadow-lg dark:border-neutral-700"
            />
            <div className="flex justify-between">
              <div
                className="rounded px-2 py-0.5 text-sm text-white shadow-lg"
                style={{ backgroundColor: getPosColor(statsAll.lastpos) }}
              >
                {statsAll.lastpos}
              </div>
              {positions.map((item, index) => {
                if (index < 2) {
                  return (
                    <div
                      className="rounded px-2 py-0.5 text-sm text-white shadow-lg"
                      key={item}
                      style={{ backgroundColor: getPosColor(item) }}
                    >
                      {item}
                    </div>
                  );
                } else return null;
              })}
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="font-heading text-2xl">{statsAll.name}</div>
            <div
              className={`text-neutral-500 dark:text-neutral-400 ${
                statsAll.name === steamInfo.personaname ? "hidden" : ""
              }`}
            >
              {steamInfo.personaname}
            </div>
            <Link href={`/equipo/${statsAll.team}`}>
              <a className="flex items-center gap-x-1 text-neutral-500 dark:text-neutral-400">
                <img
                  className="h-6"
                  src={getTeamLogo(statsAll.team)}
                  alt={statsAll.team}
                />
                <div>{statsAll.team}</div>
              </a>
            </Link>
            <div className="flex flex-col gap-y-1">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{`${
                statsAll.matches
              } partido${statsAll.matches === 1 ? "" : "s"}`}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{`${
                statsAll.wins
              } victoria${statsAll.wins === 1 ? "" : "s"}`}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{`${
                statsAll.draws
              } empate${statsAll.draws === 1 ? "" : "s"}`}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{`${
                statsAll.losses
              } derrota${statsAll.losses === 1 ? "" : "s"}`}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[...commonStats, ...posSpecificStats].map(item => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-y-1"
            >
              <div className="text-2xl">{item.value(statsAll)}</div>
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
