import { useRouter } from "next/router";
import { Match } from "../types";
import { fecha } from "../utils/Utils";
import MatchRow from "./matchRow";
import Title from "./commons/title";
import React from "react";
import Button from "./commons/button";

export default function Matches({ matches }: { matches: Match[] }) {
  const router = useRouter();

  return (
    <div className="flex grow flex-col gap-y-4 items-center">
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
      <Button onClick={_ => router.push("/resultados")}>Ver más...</Button>
    </div>
  );
}
