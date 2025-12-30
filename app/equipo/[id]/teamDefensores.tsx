import Link from "next/link";
import { Player } from "../../../types";
import Title from "../../../components/ui/title";
import Table from "../../../components/ui/table";

interface Props {
  players: Player[];
}

export default function TeamDefensores(props: Props) {
  const top10Defensores = props.players
    .filter(p => p.interceptions > 0)
    .sort((a, b) => b.interceptions - a.interceptions)
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-y-4">
      <Title>Defensores Históricos</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Jugador</Table.HeaderCell>
            <Table.HeaderCell>Intercepciones</Table.HeaderCell>
            <Table.HeaderCell>Partidos</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {top10Defensores.length === 0 && (
            <Table.BodyRow>
              <Table.BodyCell colSpan={4}>
                <span className="italic text-neutral-500 dark:text-neutral-400">
                  Este equipo es un colador 🙈
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          )}
          {top10Defensores.map((player, index) => (
            <Table.BodyRow key={player._id}>
              <Table.BodyCell>{index + 1}</Table.BodyCell>
              <Table.BodyCell>
                <Link href={`/jugador/${player._id}`}>{player.name}</Link>
              </Table.BodyCell>
              <Table.BodyCell>{player.interceptions}</Table.BodyCell>
              <Table.BodyCell>{player.matches}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
