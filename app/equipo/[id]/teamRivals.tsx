import Link from "next/link";
import { getTeamLogo } from "../../../utils/Utils";
import Title from "../../../components/ui/title";
import Table from "../../../components/ui/table";

interface Props {
  rivals: {
    _id: string;
    matches: number;
    wins: number;
    draws: number;
    losses: number;
  }[];
}

export default function TeamRivals(props: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Title>Historial vs otros equipos</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>Equipo</Table.HeaderCell>
            <Table.HeaderCell>PJ</Table.HeaderCell>
            <Table.HeaderCell>PG</Table.HeaderCell>
            <Table.HeaderCell>PE</Table.HeaderCell>
            <Table.HeaderCell>PP</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {props.rivals.length === 0 && (
            <Table.BodyRow>
              <Table.BodyCell colSpan={5}>
                <span className="italic text-neutral-500 dark:text-neutral-400">
                  Este equipo no tiene suficientes partidos contra otros
                  equipos.
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          )}
          {props.rivals.map(rival => (
            <Table.BodyRow key={rival._id}>
              <Table.BodyCell>
                <Link
                  href={`/equipo/${rival._id}`}
                  className="flex items-center justify-center gap-x-1"
                >
                  <img
                    className="h-6"
                    src={getTeamLogo(rival._id)}
                    alt={rival._id}
                  />
                  {rival._id}
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>{rival.matches}</Table.BodyCell>
              <Table.BodyCell>{rival.wins}</Table.BodyCell>
              <Table.BodyCell>{rival.draws}</Table.BodyCell>
              <Table.BodyCell>{rival.losses}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
