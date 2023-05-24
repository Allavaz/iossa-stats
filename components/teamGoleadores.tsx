import Link from "next/link";
import { Player } from "../types";
import Title from "./commons/title";
import Table from "./commons/table";

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
    <div className="flex flex-col gap-y-4">
      <Title>Goleadores Históricos</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Jugador</Table.HeaderCell>
            <Table.HeaderCell>Goles</Table.HeaderCell>
            <Table.HeaderCell>Partidos</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {top10Goleadores.length === 0 && (
            <Table.BodyRow>
              <Table.BodyCell colSpan={4}>
                <span className="italic text-neutral-500 dark:text-neutral-400">
                  Este equipo no tiene goleadores todavía.
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          )}
          {top10Goleadores.map((player, index) => (
            <Table.BodyRow key={player._id}>
              <Table.BodyCell>{index + 1}</Table.BodyCell>
              <Table.BodyCell>
                <Link href={`/jugador/${player._id}`}>
                  <a>{player.name}</a>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>{player.goals}</Table.BodyCell>
              <Table.BodyCell>{player.matches}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
