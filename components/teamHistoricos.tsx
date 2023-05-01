import Link from "next/link";
import { Player } from "../types";

interface Props {
  players: Player[];
}

export default function TeamHistoricos(props: Props) {
  const top10Historicos = props.players
    .filter(p => p.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 10);

  return (
    <div style={{ flexGrow: 1 }}>
      <h3 style={{ marginTop: 0 }}>Jugadores Históricos</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Partidos</th>
            </tr>
          </thead>
          <tbody>
            {top10Historicos.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  style={{ color: "var(--header-color)", fontStyle: "italic" }}
                >
                  Este equipo no tiene jugadores todavía ☠.
                </td>
              </tr>
            )}
            {top10Historicos.map((player, index) => (
              <tr key={player._id}>
                <td>{index + 1}</td>
                <td>
                  <Link href={`/jugador/${player._id}`}>
                    <a>{player.name}</a>
                  </Link>
                </td>
                <td>{player.matches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
