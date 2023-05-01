import { DateTime } from "luxon";
import { Match, TeamStats } from "../types";
import Torneos from "../utils/Torneos.json";
import { temporadaActual } from "../utils/Utils";

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
    <div
      style={{
        color: "var(--normal-text-color)",
        fontSize: "1.5em",
        whiteSpace: "nowrap",
        display: "flex",
        columnGap: "5px"
      }}
    >
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
    <div className="whitespace" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          rowGap: "20px",
          columnGap: "20px",
          padding: "0 10px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "20px",
            flexGrow: 1
          }}
        >
          <img src={props.logo} alt={props.teamname} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px"
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.5em",
                color: "var(--normal-text-color)"
              }}
            >
              {props.teamname} {!isActive && "⚰️"}
            </div>
            {isActive ? (
              <>
                {props.lastLiga && (
                  <div
                    style={{ color: "var(--header-color)" }}
                  >{`${props.lastLiga.position}º en ${props.lastLiga._id}`}</div>
                )}
                <div style={{ color: "var(--header-color)" }}>
                  Activo desde {activeSince}
                </div>
              </>
            ) : (
              <div style={{ color: "var(--header-color)" }}>
                Activo por última vez en {lastActivity}
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            columnGap: "20px",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {isActive && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {forma(props.matches.slice(0, 5), props.teamname)}
              <div
                style={{ color: "var(--header-color)", fontSize: "0.75rem" }}
              >
                Forma
              </div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                color: "var(--normal-text-color)",
                fontSize: "1.5em"
              }}
            >
              {props.stats.matches}
            </div>
            <div style={{ color: "var(--header-color)", fontSize: "0.75rem" }}>
              Partidos
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                color: "var(--normal-text-color)",
                fontSize: "1.5em"
              }}
            >
              {props.stats.wins}
            </div>
            <div style={{ color: "var(--header-color)", fontSize: "0.75rem" }}>
              Victorias
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                color: "var(--normal-text-color)",
                fontSize: "1.5em"
              }}
            >
              {props.stats.losses}
            </div>
            <div style={{ color: "var(--header-color)", fontSize: "0.75rem" }}>
              Derrotas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
