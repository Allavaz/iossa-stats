import { DateTime } from "luxon";
import { getTeamLogo } from "../utils/Utils";
import Link from "next/link";

const dateFormat = "dd/LL/yyyy";

export default function PlayerTeamsTable({ teams }) {
  return (
    <div style={{ flexGrow: 1 }}>
      <h3>HISTORIAL DE EQUIPOS</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <tbody>
            {teams.map(item => {
              const firstMatch = DateTime.fromISO(item.firstMatch).toFormat(
                dateFormat
              );
              const lastMatch = DateTime.fromISO(item.lastMatch).toFormat(
                dateFormat
              );
              return (
                <tr key={item.lastMatch}>
                  <td>{firstMatch + " - " + lastMatch}</td>
                  <td>
                    <Link href={`/equipo/${item.team}`}>
                      <a
                        className="teamlogo"
                        style={{ justifyContent: "center" }}
                      >
                        <img
                          height="16px"
                          src={getTeamLogo(item.team)}
                          alt={item._id}
                          style={{ marginRight: "5px" }}
                        />
                        {item.team}
                      </a>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
