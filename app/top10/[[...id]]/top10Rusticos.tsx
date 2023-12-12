import { getTeamLogo } from "../../../utils/Utils";
import Link from "next/link";
import Title from "../../../components/ui/title";
import Table from "../../../components/ui/table";

export default function Top10Rusticos({ players, category }) {
  return (
    <div className="flex flex-col gap-y-4">
      <Title>Top 10 Rústicos - {category}</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Jugador</Table.HeaderCell>
            <Table.HeaderCell>Partidos</Table.HeaderCell>
            <Table.HeaderCell>Faltas</Table.HeaderCell>
            <Table.HeaderCell>Amarillas</Table.HeaderCell>
            <Table.HeaderCell>Rojas</Table.HeaderCell>
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
              <Table.BodyCell>{item.fouls}</Table.BodyCell>
              <Table.BodyCell>{item.yellowcards}</Table.BodyCell>
              <Table.BodyCell>{item.redcards}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
