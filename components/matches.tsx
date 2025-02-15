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
      <table className="-mt-4 w-full table-fixed border-separate border-spacing-y-4 text-center text-sm">
        <colgroup>
          <col />
          <col style={{ width: "60px" }} />
          <col />
          <col />
        </colgroup>
        <tbody>
          {matches.map((match, id, array) => (
            <>
              {id === 0 ||
              fecha(array[id].fecha) !== fecha(array[id - 1].fecha) ? (
                <tr>
                  <td className="p-0 text-left" colSpan={4}>
                    <Title>Resultados del {fecha(match.fecha)}</Title>
                  </td>
                </tr>
              ) : null}
              <tr className="bg-white shadow-lg transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                <td className="rounded-l-lg border-y border-l border-neutral-200 dark:border-neutral-700">
                  <Link
                    href={"/partido/" + match._id}
                    className="flex items-center justify-end gap-2 p-3"
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
                </td>
                <td className="w-[60px] border-y border-l border-neutral-200 dark:border-neutral-700">
                  <Link
                    href={"/partido/" + match._id}
                    className="flex flex-col items-center gap-y-1 py-3"
                  >
                    <ResultWithDefault
                      home={match.teams[0].score}
                      away={match.teams[1].score}
                      isDefault={match.isdefault}
                    />
                  </Link>
                </td>
                <td className="border-y border-l border-neutral-200 dark:border-neutral-700">
                  <Link
                    href={"/partido/" + match._id}
                    className="flex items-center justify-start gap-2 p-3"
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
                </td>
                <td className="overflow-hidden overflow-ellipsis whitespace-nowrap rounded-r-lg border border-neutral-200 dark:border-neutral-700">
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
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
      <Button href="/resultados">Ver más...</Button>
    </div>
  );
}
