import Link from "next/link";
import DefaultIndicator from "../../../components/defaultIndicator";
import Card from "../../../components/ui/card";
import { Match, MatchEvent } from "../../../types";
import {
  fecha,
  getTeamLogo,
  getTeamShortname,
  getTorneoLink
} from "../../../utils/Utils";
import MatchEventComponent from "./matchEvent";

export default function MatchCard({ match }: { match: Match }) {
  function filterEvents(events: MatchEvent[], side: "home" | "away") {
    if (side === "home") {
      return events.filter(
        event =>
          (event.team === "home" && event.event !== "OWN GOAL") ||
          (event.team === "away" && event.event === "OWN GOAL")
      );
    } else if (side === "away") {
      return events.filter(
        event =>
          (event.team === "away" && event.event !== "OWN GOAL") ||
          (event.team === "home" && event.event === "OWN GOAL")
      );
    } else return [];
  }

  return (
    <Card>
      <table className="w-full table-fixed text-center align-middle">
        <tbody>
          <tr>
            <td className="p-1" colSpan={3}>
              <div className="flex justify-center gap-x-2">
                <Link
                  href={getTorneoLink(match.torneo)}
                  className="text-sm text-neutral-500 dark:text-neutral-400"
                >
                  {match.torneo}
                </Link>
              </div>
            </td>
          </tr>
          <tr>
            <td className="p-1">
              <div className="flex items-center justify-center gap-x-2">
                <Link
                  href={`/equipo/${match.teams[0].teamname}`}
                  className="font-heading text-2xl"
                >
                  <div className="hidden sm:block">
                    {match.teams[0].teamname}
                  </div>
                  <div className="sm:hidden">
                    {getTeamShortname(match.teams[0].teamname)}
                  </div>
                </Link>
              </div>
            </td>
            <td className="p-1">
              <div className="flex items-center justify-center gap-x-2">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {fecha(match.fecha)}
                </div>
              </div>
            </td>
            <td className="p-1">
              <div className="flex items-center justify-center gap-x-2">
                <Link
                  href={`/equipo/${match.teams[1].teamname}`}
                  className="font-heading text-2xl"
                >
                  <div className="hidden sm:block">
                    {match.teams[1].teamname}
                  </div>
                  <div className="sm:hidden">
                    {getTeamShortname(match.teams[1].teamname)}
                  </div>
                </Link>
              </div>
            </td>
          </tr>
          <tr>
            <td className="p-4">
              <div className="flex justify-center">
                <Link href={`/equipo/${match.teams[0].teamname}`}>
                  <img
                    alt={match.teams[0].teamname}
                    src={getTeamLogo(match.teams[0].teamname)}
                  />
                </Link>
              </div>
            </td>
            <td className="p-4">
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center justify-center gap-x-2">
                  <div className="whitespace-nowrap font-heading text-3xl">
                    {match.teams[0].score} - {match.teams[1].score}
                  </div>
                </div>
                {match.isdefault && <DefaultIndicator />}
              </div>
            </td>
            <td className="p-4">
              <div className="flex justify-center">
                <Link href={`/equipo/${match.teams[1].teamname}`}>
                  <img
                    alt={match.teams[1].teamname}
                    src={getTeamLogo(match.teams[1].teamname)}
                  />
                </Link>
              </div>
            </td>
          </tr>
          <tr className="align-top">
            <td className="p-1">
              <ul>
                {filterEvents(match.matchevents, "home").map((item, index) => (
                  <MatchEventComponent item={item} key={index} index={index} />
                ))}
              </ul>
            </td>
            <td></td>
            <td>
              <ul>
                {filterEvents(match.matchevents, "away").map(
                  (item: MatchEvent, index) => (
                    <MatchEventComponent
                      item={item}
                      key={index}
                      index={index}
                    />
                  )
                )}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
