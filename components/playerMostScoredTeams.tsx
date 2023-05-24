import Link from "next/link";
import { getTeamLogo } from "../utils/Utils";
import Title from "./commons/title";
import Table from "./commons/table";

interface Props {
  teams: {
    teamname: string;
    goalsscored: number;
  }[];
}

export default function PlayerMostScoredTeams(props: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Title>Equipos más Goleados</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Equipo</Table.HeaderCell>
            <Table.HeaderCell>Goles</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {props.teams.length === 0 && (
            <Table.BodyRow>
              <Table.BodyCell colSpan={3}>
                <span className="italic text-neutral-500 dark:text-neutral-400">
                  Este jugador no le hace un gol ni al arco iris 🌈
                </span>
              </Table.BodyCell>
            </Table.BodyRow>
          )}
          {props.teams.map((team, index) => (
            <Table.BodyRow key={team.teamname}>
              <Table.BodyCell>{index + 1}</Table.BodyCell>
              <Table.BodyCell>
                <Link href={`/equipo/${team.teamname}`}>
                  <a className="flex items-center justify-center gap-x-1">
                    <img
                      className="h-6"
                      src={getTeamLogo(team.teamname)}
                      alt={team.teamname}
                    />
                    <div>{team.teamname}</div>
                  </a>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>{team.goalsscored}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
