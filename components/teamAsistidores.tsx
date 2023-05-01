import Link from "next/link";
import { Player } from "../types";

interface Props {
  players: Player[];
}

export default function TeamAsistidores(props: Props) {
  const top10Asistidores = props.players
    .filter(p => p.assists > 0)
    .sort((a, b) => {
      if (a.assists === b.assists) {
        return a.matches - b.matches;
      } else {
        return b.assists - a.assists;
      }
    })
    .slice(0, 10);

  return (
    <div style={{ flexGrow: 1 }}>
      <h3 style={{ marginTop: 0 }}>Asistidores Históricos</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Asistencias</th>
              <th>Partidos</th>
            </tr>
          </thead>
          <tbody>
            {top10Asistidores.map((player, index) => (
              <tr key={player._id}>
                <td>{index + 1}</td>
                <td>
                  <Link href={`/jugador/${player._id}`}>
                    <a>{player.name}</a>
                  </Link>
                </td>
                <td>{player.assists}</td>
                <td>{player.matches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
