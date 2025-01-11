import { filterEvents } from "../app/partido/[[...id]]/matchCard";
import { Match, MatchEvent } from "../types";
import { fecha } from "../utils/Utils";

export default function createDiscordCard(match: any) {
  return {
    embeds: [
      {
        color: 14845952,
        title: `${match.teams[0].teamname} ${match.teams[0].score} - ${match.teams[1].score} ${match.teams[1].teamname}`,
        description: `**${match.torneo}** - ${fecha(match.fecha)}`,
        fields: [
          {
            name: match.teams[0].teamname,
            value: buildEventsString(match.matchevents, "home"),
            inline: true
          },
          {
            name: match.teams[1].teamname,
            value: buildEventsString(match.matchevents, "away"),
            inline: true
          }
        ]
      }
    ]
  };
}

function buildEventsString(events: MatchEvent[], side: "home" | "away") {
  return filterEvents(events, side)
    .map(
      event =>
        `${getEventEmoji(event)} ${event.name} ${
          event.name2 ? `*(${event.name2})*` : ""
        } (${Math.round(event.second / 60)}')`
    )
    .join("\n");
}

function getEventEmoji(event: MatchEvent) {
  switch (event.event) {
    case "GOAL":
      return "⚽";
    case "OWN GOAL":
      return "🚫⚽";
    case "YELLOW CARD":
      return "🟨";
    case "RED CARD":
      return "🟥";
    case "SECOND YELLOW":
      return "🟨🟥";
    default:
      return "";
  }
}
