import { getTournamentIcon } from "../utils/Utils";

interface Props {
  tournaments: {
    _id: string;
    matches: number;
    firstmatch: string;
    lastmatch: string;
    position?: number;
  }[];
}

export default function TeamLigas(props: Props) {
  return (
    <div style={{ flexGrow: 1, minWidth: "300px" }}>
      <h3 style={{ marginTop: 0 }}>Ligas</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Torneo</th>
              <th>Posición</th>
            </tr>
          </thead>
          <tbody>
            {props.tournaments.map(tournament => (
              <tr key={tournament._id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <img
                      src={getTournamentIcon(tournament._id)}
                      alt={tournament._id}
                      height="16px"
                    />
                    <div style={{ marginLeft: "5px" }}>{tournament._id}</div>
                  </div>
                </td>
                <td>{tournament.position}º</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
