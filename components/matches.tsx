import { useRouter } from "next/router";
import { Match } from "../types";
import { fecha } from "../utils/Utils";
import MatchRow from "./matchRow";

export default function Matches({ matches }: { matches: Match[] }) {
  const router = useRouter();

  return (
    <div className="matchesContainer">
      {matches.map((match, id, array) => (
        <div key={id}>
          <h3
            style={{
              display:
                id === 0 ||
                fecha(array[id].fecha) !== fecha(array[id - 1].fecha)
                  ? "block"
                  : "none"
            }}
          >
            RESULTADOS DEL {fecha(match.fecha)}
          </h3>
          <div className="divDataTable" id="divMatchesTable" key={id}>
            <MatchRow match={match} />
          </div>
        </div>
      ))}
      <br></br>
      <center>
        <button className="boton" onClick={_ => router.push("/resultados")}>
          Ver más...
        </button>
      </center>
    </div>
  );
}
