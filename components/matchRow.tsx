import {
  getTeamLogo,
  getTeamShortname,
  getTournamentIcon
} from "../utils/Utils";
import Link from "next/link";

export default function MatchRow({ match }) {
  return (
    <Link href={"/partido/" + match._id}>
      <a className="flex w-full rounded-l-lg rounded-r-lg bg-white text-sm shadow-lg transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
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
        <div className="flex min-w-[60px] shrink-0 items-center justify-center border-y border-r p-3 dark:border-neutral-700">
          {match.teams[0].score} - {match.teams[1].score}
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
            {getTeamShortname(match.teams[1].teamname)}
          </div>
        </div>
        <div className="flex w-[20%] min-w-0 items-center justify-center gap-x-1 rounded-r-lg border-y border-r p-3 dark:border-neutral-700 sm:w-[30%]">
          <img
            className="h-6"
            src={getTournamentIcon(match.torneo)}
            alt={match.torneo}
          />
          <div className="hidden overflow-hidden overflow-ellipsis whitespace-nowrap sm:block">
            {match.torneo}
          </div>
        </div>
      </a>
    </Link>
  );
}
