import Link from "next/link";
import {
  getTeamLogo,
  getTorneoLink,
  getTournamentIcon
} from "../../../utils/Utils";
import Table from "../../../components/ui/table";
import Title from "../../../components/ui/title";

interface Props {
  tournaments: {
    _id: string;
    team: string;
    matches: number;
    firstmatch: string;
    lastmatch: string;
    position?: number;
  }[];
}

export default function TeamLigas(props: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Title>Ligas</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>Equipo</Table.HeaderCell>
            <Table.HeaderCell>Torneo</Table.HeaderCell>
            <Table.HeaderCell>Posición</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {props.tournaments.length === 0 && (
            <Table.BodyRow>
              <Table.BodyCell colSpan={2}>
                <span className="italic text-neutral-500 dark:text-neutral-400">
                  Este jugador no ha participado en ninguna liga todavía.
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          )}
          {props.tournaments.map(tournament => (
            <Table.BodyRow key={tournament._id}>
              <Table.BodyCell>
                <Link
                  href={"/equipo/" + tournament.team}
                  className="flex items-center justify-center gap-x-1"
                >
                  <img
                    src={getTeamLogo(tournament.team)}
                    alt={tournament.team}
                    className="h-6"
                  />
                  <div>{tournament.team}</div>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>
                <Link
                  href={getTorneoLink(tournament._id)}
                  className="flex items-center justify-center gap-x-1"
                >
                  <img
                    src={getTournamentIcon(tournament._id)}
                    alt={tournament._id}
                    className="h-6"
                  />
                  <div>{tournament._id}</div>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>{tournament.position}º</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
