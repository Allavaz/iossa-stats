import { getTeamLogo } from "../utils/Utils";
import Link from "next/link";
import Title from "./commons/title";
import Table from "./commons/table";

export default function Top10Arqueros({ players, category }) {
  return (
    <div className="flex flex-col gap-y-4">
      <Title>Top 10 Arqueros - {category}</Title>
      <Table>
        <thead>
          <Table.HeaderRow>
            <Table.HeaderCell>#</Table.HeaderCell>
            <Table.HeaderCell>Jugador</Table.HeaderCell>
            <Table.HeaderCell>Partidos</Table.HeaderCell>
            <Table.HeaderCell>Atajadas (sin rebote)</Table.HeaderCell>
            <Table.HeaderCell>Goles recibidos</Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {players.map((item, index) => (
            <Table.BodyRow key={item._id}>
              <Table.BodyCell>{index + 1}</Table.BodyCell>
              <Table.BodyCell>
                <Link href={`/jugador/${item._id}`}>
                  <a className="flex items-center justify-center gap-x-1">
                    <img
                      className="h-6"
                      src={getTeamLogo(item.team)}
                      alt={item.team}
                    />
                    <div>{item.name}</div>
                  </a>
                </Link>
              </Table.BodyCell>
              <Table.BodyCell>{item.matches}</Table.BodyCell>
              <Table.BodyCell>
                {item.saves} ({item.savescaught})
              </Table.BodyCell>
              <Table.BodyCell>{item.goalsconceded}</Table.BodyCell>
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
