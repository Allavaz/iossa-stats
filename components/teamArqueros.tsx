import Link from "next/link";
import { Player } from "../types";
import Title from "./commons/title";
import Table from "./commons/table";

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
    <div className="flex flex-col gap-y-4">
      <Title>Arqueros Históricos</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Jugador</Table.HeaderCell>
            <Table.HeaderCell>Atajadas (sin rebote)</Table.HeaderCell>
            <Table.HeaderCell>Partidos</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {top10Arqueros.length === 0 && (
            <Table.BodyRow>
              <Table.BodyCell colSpan={4}>
                <span className="italic text-neutral-500 dark:text-neutral-400">
                  Este equipo no tiene atajadas todavía.
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          )}
          {top10Arqueros.map((player, index) => (
            <Table.BodyRow key={player._id}>
              <Table.BodyCell>{index + 1}</Table.BodyCell>
              <Table.BodyCell>
                <Link href={`/jugador/${player._id}`}>
                  <a>{player.name}</a>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>
                {player.saves} ({player.savescaught})
              </Table.BodyCell>
              <Table.BodyCell>{player.matches}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
