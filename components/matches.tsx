import { Match } from "../types";
import { fecha } from "../utils/Utils";
import MatchRow from "./matchRow";
import Title from "./ui/title";
import React from "react";
import Button from "./ui/button";

export default function Matches({ matches }: { matches: Match[] }) {
  return (
    <div className="flex grow flex-col items-center gap-y-4">
      {matches.map((match, id, array) => (
        <React.Fragment key={id}>
          <Title
            style={{
              display:
                id === 0 ||
                fecha(array[id].fecha) !== fecha(array[id - 1].fecha)
                  ? "block"
                  : "none"
            }}
          >
            RESULTADOS DEL {fecha(match.fecha)}
          </Title>
          <MatchRow match={match} />
        </React.Fragment>
      ))}
      <Button href="/resultados">Ver más...</Button>
    </div>
  );
}
