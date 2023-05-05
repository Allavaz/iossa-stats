import Link from "next/link";
import { getTeamLogo } from "../utils/Utils";

interface Props {
  teams: {
    teamname: string;
    goalsscored: number;
  }[];
}

export default function PlayerMostScoredTeams(props: Props) {
  return (
    <div style={{ flexGrow: 1 }}>
      <h3>Equipos Más Goleados</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>Goles</th>
            </tr>
          </thead>
          <tbody>
            {props.teams.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  style={{ color: "var(--header-color)", fontStyle: "italic" }}
                >
                  Este jugador no le hace un gol ni al arco iris 🌈
                </td>
              </tr>
            )}
            {props.teams.map((team, index) => (
              <tr key={team.teamname}>
                <td>{index + 1}</td>
                <td>
                  <Link href={`/equipo/${team.teamname}`}>
                    <a
                      className="teamlogo"
                      style={{ justifyContent: "center" }}
                    >
                      <img
                        height="16px"
                        src={getTeamLogo(team.teamname)}
                        alt={team.teamname}
                        style={{ marginRight: "5px" }}
                      />
                      <div>{team.teamname}</div>
                    </a>
                  </Link>
                </td>
                <td>{team.goalsscored}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
