import Link from "next/link";
import { Player } from "../../../types";
import Title from "../../../components/commons/title";
import Table from "../../../components/commons/table";

interface Props {
  players: Player[];
}

export default function TeamHistoricos(props: Props) {
  const top10Historicos = props.players
    .filter(p => p.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-y-4">
      <Title>Jugadores Históricos</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Jugador</Table.HeaderCell>
            <Table.HeaderCell>Partidos</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {top10Historicos.length === 0 && (
            <Table.BodyRow>
              <Table.BodyCell colSpan={3}>
                <span className="italic text-neutral-500 dark:text-neutral-400">
                  Este equipo no tiene jugadores todavía ☠.
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          )}
          {top10Historicos.map((player, index) => (
            <Table.BodyRow key={player._id}>
              <Table.BodyCell>{index + 1}</Table.BodyCell>
              <Table.BodyCell>
                <Link href={`/jugador/${player._id}`}>{player.name}</Link>
              </Table.BodyCell>
              <Table.BodyCell>{player.matches}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
