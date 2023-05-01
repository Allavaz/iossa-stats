import Link from "next/link";
import { getTeamLogo } from "../utils/Utils";

interface Props {
  rivals: {
    _id: string;
    matches: number;
    wins: number;
    draws: number;
    losses: number;
  }[];
}

export default function TeamRivals(props: Props) {
  return (
    props.rivals.length > 0 && (
      <div style={{ flexGrow: 1 }}>
        <h3 style={{ marginTop: 0 }}>Historial vs otros equipos</h3>
        <div className="divDataTable">
          <table className="dataTable">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>PJ</th>
                <th>PG</th>
                <th>PE</th>
                <th>PP</th>
              </tr>
            </thead>
            <tbody>
              {props.rivals.map(rival => (
                <tr key={rival._id}>
                  <td>
                    <Link href={`/equipo/${rival._id}`}>
                      <a>
                        <div
                          className="teamlogo"
                          style={{ justifyContent: "center" }}
                        >
                          <img
                            height="16px"
                            src={getTeamLogo(rival._id)}
                            alt={rival._id}
                            style={{ marginRight: "5px" }}
                          />
                          {rival._id}
                        </div>
                      </a>
                    </Link>
                  </td>
                  <td>{rival.matches}</td>
                  <td>{rival.wins}</td>
                  <td>{rival.draws}</td>
                  <td>{rival.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
}
