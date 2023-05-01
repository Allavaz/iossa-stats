import Link from "next/link";
import { Player } from "../types";

interface Props {
  players: Player[];
}

export default function TeamArqueros(props: Props) {
  const top10Arqueros = props.players
    .filter(p => p.saves > 0)
    .sort((a, b) => {
      if (a.saves === b.saves) {
        return b.savescaught - a.savescaught;
      } else if (a.savescaught === b.savescaught) {
        return a.matches - b.matches;
      } else {
        return b.saves - a.saves;
      }
    })
    .slice(0, 10);

  return (
    <div style={{ flexGrow: 1 }}>
      <h3 style={{ marginTop: 0 }}>Arqueros Históricos</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Atajadas (sin rebote)</th>
              <th>Partidos</th>
            </tr>
          </thead>
          <tbody>
            {top10Arqueros.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{ color: "var(--header-color)", fontStyle: "italic" }}
                >
                  Este equipo no tiene atajadas todavía.
                </td>
              </tr>
            )}
            {top10Arqueros.map((player, index) => (
              <tr key={player._id}>
                <td>{index + 1}</td>
                <td>
                  <Link href={`/jugador/${player._id}`}>
                    <a>{player.name}</a>
                  </Link>
                </td>
                <td>
                  {player.saves} ({player.savescaught})
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
