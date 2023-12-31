import Link from "next/link";
import { Match } from "../types";
import {
  getTeamLogo,
  getTeamShortname,
  getTournamentIcon
} from "../utils/Utils";
import ResultWithDefault from "./resultWithDefault";

export default function MatchRow({ match }: { match: Match }) {
  return (
    <Link
      href={"/partido/" + match._id}
      className="flex w-full rounded-l-lg rounded-r-lg bg-white text-sm shadow-lg transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
    >
      <div className="flex w-[40%] items-center justify-end gap-x-1 rounded-l-lg border border-neutral-200 p-3 dark:border-neutral-700">
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
      </div>
      <div className="flex min-w-[60px] shrink-0 items-center justify-center border-y border-r p-2 dark:border-neutral-700">
        <div className="flex flex-col items-center gap-y-1">
          <ResultWithDefault
            home={match.teams[0].score}
            away={match.teams[1].score}
            isDefault={match.isdefault}
          />
        </div>
      </div>
      <div className="flex w-[40%] items-center gap-x-1 border-y border-r p-3 dark:border-neutral-700">
        <img
          className="h-6"
          src={getTeamLogo(match.teams[1].teamname)}
          alt={match.teams[1].teamname}
        />
        <div className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap sm:block">
          {match.teams[1].teamname}
        </div>
        <div className="sm:hidden">
          {getTeamShortname(match.teams[0].teamname)}
        </div>
      </div>
      <div className="flex w-[20%] items-center justify-center gap-x-1 rounded-r-lg border-y border-r p-3 dark:border-neutral-700 sm:w-[30%]">
        <img
          className="h-6"
          src={getTournamentIcon(match.torneo)}
          alt={match.torneo}
        />
        <div className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap sm:block">
          {match.torneo}
        </div>
      </div>
    </Link>
  );
}
