import { getTeamLogo } from "../../../utils/Utils";
import Link from "next/link";
import Title from "../../../components/ui/title";
import Table from "../../../components/ui/table";
import { secondsToMinutes } from "../../../lib/Utils";

export default function Top10Intercepciones({ players, category }) {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <Title>
        Top 10 Intercepciones{category ? " - " : ""}
        {category}
      </Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Jugador</Table.HeaderCell>
            <Table.HeaderCell>Partidos</Table.HeaderCell>
            <Table.HeaderCell>Intercepciones</Table.HeaderCell>
            <Table.HeaderCell>Minutos jugados</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {players.map((item, index) => (
            <Table.BodyRow key={item._id}>
              <Table.BodyCell>{index + 1}</Table.BodyCell>
              <Table.BodyCell>
                <Link
                  href={`/jugador/${item._id}`}
                  className="flex items-center justify-center gap-x-1"
                >
                  <img
                    className="h-6"
                    src={getTeamLogo(item.team)}
                    alt={item.team}
                  />
                  <div>{item.name}</div>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>{item.matches}</Table.BodyCell>
              <Table.BodyCell>{item.interceptions}</Table.BodyCell>
              <Table.BodyCell>
                {secondsToMinutes(item.secondsplayed)}
              </Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
