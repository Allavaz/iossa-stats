import Link from "next/link";
import { Player } from "../../../types";
import Card from "../../../components/ui/card";
import Title from "../../../components/ui/title";

function getPosColor(pos: string) {
  switch (pos) {
    case "GK":
      return "#f2c350";
    case "LB":
      return "#36A2EB";
    case "RB":
      return "#36A2EB";
    case "CB":
      return "#36A2EB";
    case "LM":
      return "#3da33b";
    case "RM":
      return "#3da33b";
    case "CM":
      return "#3da33b";
    case "CF":
      return "#FF6384";
    case "LW":
      return "#FF6384";
    case "RW":
      return "#FF6384";
    default:
      return "#ff9800";
  }
}

interface Props {
  roster: Player[];
}

export default function Roster(props: Props) {
  return (
    <Card>
      <div className="flex flex-col gap-y-4">
        <Title>Plantel actual</Title>
        <div className="flex flex-wrap justify-evenly gap-4">
          {props.roster.map(player => {
            const position =
              player.positions.length > 0 ? player.positions[0].position : null;
            return (
              <Link
                href={`/jugador/${player._id}`}
                key={player._id}
                className="flex flex-col items-center gap-y-2"
              >
                <img
                  className="h-28 rounded-lg border border-neutral-300 shadow-lg dark:border-neutral-700"
                  src={player.profilePicture}
                  alt={player.name}
                />
                <div className="flex items-center gap-x-2">
                  {position && (
                    <div
                      className="rounded px-2 py-0.5 text-sm text-white shadow-lg"
                      key={position}
                      style={{
                        backgroundColor: getPosColor(position)
                      }}
                    >
                      {position}
                    </div>
                  )}
                  <div className="text-sm">{player.name}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
