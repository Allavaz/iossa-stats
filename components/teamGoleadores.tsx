import Link from "next/link";
import { Player } from "../types";

interface Props {
  players: Player[];
}

export default function TeamGoleadores(props: Props) {
  const top10Goleadores = props.players
    .filter(p => p.goals > 0)
    .sort((a, b) => {
      if (a.goals === b.goals) {
        return a.matches - b.matches;
      } else {
        return b.goals - a.goals;
      }
    })
    .slice(0, 10);

  return (
    <div style={{ flexGrow: 1 }}>
      <h3 style={{ marginTop: 0 }}>Goleadores Históricos</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Goles</th>
              <th>Partidos</th>
            </tr>
          </thead>
          <tbody>
            {top10Goleadores.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{ color: "var(--header-color)", fontStyle: "italic" }}
                >
                  Este equipo no tiene goleadores todavía.
                </td>
              </tr>
            )}
            {top10Goleadores.map((player, index) => (
              <tr key={player._id}>
                <td>{index + 1}</td>
                <td>
                  <Link href={`/jugador/${player._id}`}>
                    <a>{player.name}</a>
                  </Link>
                </td>
                <td>{player.goals}</td>
                <td>{player.matches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
