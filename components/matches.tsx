import { Match } from "../types";
import { fecha } from "../utils/Utils";
import MatchRow from "./matchRow";
import Title from "./commons/title";
import React from "react";
import Button from "./commons/button";
import Link from "next/link";

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
      <Link href="/resultados">
        <Button>Ver más...</Button>
      </Link>
    </div>
  );
}
