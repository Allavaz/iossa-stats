import Link from "next/link";
import { Player } from "../types";

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
    <div
      className="whitespace"
      style={{
        padding: "20px"
      }}
    >
      <h3 style={{ marginTop: 0 }}>Plantel actual</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          rowGap: "15px",
          columnGap: "15px"
        }}
      >
        {props.roster.map(player => (
          <Link href={`/jugador/${player._id}`} key={player._id}>
            <a>
              <div className="profilepicture" style={{ marginRight: 0 }}>
                <img
                  src={player.profilePicture}
                  alt={player.name}
                  height="100px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: "5px",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div
                  className="position"
                  key={player.positions[0].position}
                  style={{
                    backgroundColor: getPosColor(player.positions[0].position)
                  }}
                >
                  {player.positions[0].position}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    color: "var(--normal-text-color)",
                    fontSize: "0.9em"
                  }}
                >
                  {player.name}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
