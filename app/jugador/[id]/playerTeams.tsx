import { DateTime } from "luxon";
import { getTeamLogo } from "../../../utils/Utils";
import Link from "next/link";
import Title from "../../../components/ui/title";
import Table from "../../../components/ui/table";

const dateFormat = "dd/LL/yyyy";

export default function PlayerTeamsTable({ teams }) {
  return (
    <div className="flex flex-col gap-y-4">
      <Title>Historial de Equipos</Title>
      <Table>
        <tbody>
          {teams.map(item => {
            const firstMatch = DateTime.fromISO(item.firstMatch).toFormat(
              dateFormat
            );
            const lastMatch = DateTime.fromISO(item.lastMatch).toFormat(
              dateFormat
            );
            return (
              <Table.BodyRow key={item.lastMatch}>
                <Table.BodyCell>
                  {firstMatch + " - " + lastMatch}
                </Table.BodyCell>
                <Table.BodyCell>
                  <Link
                    href={`/equipo/${item.team}`}
                    className="flex items-center justify-center gap-x-1"
                  >
                    <img
                      className="h-6"
                      src={getTeamLogo(item.team)}
                      alt={item._id}
                    />
                    {item.team}
                  </Link>
                </Table.BodyCell>
              </Table.BodyRow>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
