import { Match } from "../types";
import {
  fecha,
  getTeamLogo,
  getTeamShortname,
  getTournamentIcon
} from "../utils/Utils";
import Title from "./ui/title";
import React from "react";
import Button from "./ui/button";
import ResultWithDefault from "./resultWithDefault";
import Link from "next/link";

export default function Matches({ matches }: { matches: Match[] }) {
  return (
    <div className="flex grow flex-col items-center gap-y-4">
      <div className="w-full space-y-4 text-sm">
        {matches.map((match, id, array) => (
          <React.Fragment key={match._id.toString()}>
            {id === 0 ||
            fecha(array[id].fecha) !== fecha(array[id - 1].fecha) ? (
              <Title>Resultados del {fecha(match.fecha)}</Title>
            ) : null}
            <div className="grid grid-cols-[1fr_60px_1fr_1fr] gap-0 rounded-lg border border-neutral-200 bg-white shadow-lg transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
              <Link
                href={"/partido/" + match._id}
                className="flex items-center justify-end gap-2 border-r border-neutral-200 p-3 dark:border-neutral-700"
              >
                <div className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap sm:block">
                  {match.teams[0].teamname}
                </div>
                <div className="sm:hidden">
                  {getTeamShortname(match.teams[0].teamname)}
                </div>
                <img
                  className="h-6"
                  src={getTeamLogo(match.teams[0].teamname)}
                  alt={match.teams[0].teamname}
                />
              </Link>
              <Link
                href={"/partido/" + match._id}
                className="flex flex-col items-center justify-center border-r border-neutral-200 dark:border-neutral-700"
              >
                <ResultWithDefault
                  home={match.teams[0].score}
                  away={match.teams[1].score}
                  isDefault={match.isdefault}
                />
              </Link>
              <Link
                href={"/partido/" + match._id}
                className="flex items-center justify-start gap-2 border-r border-neutral-200 p-3 dark:border-neutral-700"
              >
                <img
                  className="h-6"
                  src={getTeamLogo(match.teams[1].teamname)}
                  alt={match.teams[1].teamname}
                />
                <div className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap sm:block">
                  {match.teams[1].teamname}
                </div>
                <div className="sm:hidden">
                  {getTeamShortname(match.teams[1].teamname)}
                </div>
              </Link>
              <Link
                href={"/partido/" + match._id}
                className="flex items-center justify-center gap-2 p-3"
              >
                <img
                  className="h-6"
                  src={getTournamentIcon(match.torneo)}
                  alt={match.torneo}
                />
                <div className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap sm:block">
                  {match.torneo}
                </div>
              </Link>
            </div>
          </React.Fragment>
        ))}
      </div>
      <Button href="/resultados">Ver más...</Button>
    </div>
  );
}
