import Link from "next/link";
import { Player } from "../../../types";
import Title from "../../../components/ui/title";
import Table from "../../../components/ui/table";

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
    <div className="flex flex-col gap-y-4">
      <Title>Asistidores Históricos</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Jugador</Table.HeaderCell>
            <Table.HeaderCell>Asistencias</Table.HeaderCell>
            <Table.HeaderCell>Partidos</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {top10Asistidores.length === 0 && (
            <Table.BodyRow>
              <Table.BodyCell colSpan={4}>
                <span className="italic text-neutral-500 dark:text-neutral-400">
                  Este equipo no tiene asistidores todavía.
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          )}
          {top10Asistidores.map((player, index) => (
            <Table.BodyRow key={player._id}>
              <Table.BodyCell>{index + 1}</Table.BodyCell>
              <Table.BodyCell>
                <Link href={`/jugador/${player._id}`}>{player.name}</Link>
              </Table.BodyCell>
              <Table.BodyCell>{player.assists}</Table.BodyCell>
              <Table.BodyCell>{player.matches}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
