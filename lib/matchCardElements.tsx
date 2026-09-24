import { fecha, getTeamLogo } from "../utils/Utils";
import { readFileSync } from "fs";
import path from "path";
import { getTeamsMap } from "./getFromDB";
import { Match, MatchEvent } from "../types";

const publicPath = path.resolve("./public");

const colors = {
  bg: "#fbfbfb",
  headerColor: "rgb(90, 90, 90)",
  text: "black"
};

const CARD_WIDTH = 670;
const GOAL_COLUMN_WIDTH = 210;

function iconDataUri(filename: string) {
  return `data:image/png;base64,${readFileSync(
    path.join(publicPath, "matchicons", filename)
  ).toString("base64")}`;
}

function getGoalEvents(events: MatchEvent[], side: "home" | "away") {
  const players: {
    name: string;
    steamid: string;
    event: "GOAL" | "OWN GOAL";
    seconds: number[];
  }[] = [];

  for (const e of events) {
    if (e.event === "GOAL" && e.team === side) {
      const idx = players.findIndex(p => p.steamid === e.player1SteamId);
      if (idx === -1) {
        players.push({
          name: e.name,
          steamid: e.player1SteamId,
          event: "GOAL",
          seconds: [e.second]
        });
      } else {
        players[idx].seconds.push(e.second);
      }
    } else if (e.event === "OWN GOAL" && e.team !== side) {
      const idx = players.findIndex(p => p.steamid === e.player1SteamId);
      if (idx === -1) {
        players.push({
          name: e.name,
          steamid: e.player1SteamId,
          event: "OWN GOAL",
          seconds: [e.second]
        });
      } else {
        players[idx].seconds.push(e.second);
      }
    }
  }

  return players;
}

function GoalList({
  events,
  align
}: {
  events: MatchEvent[];
  align: "home" | "away";
}) {
  const players = getGoalEvents(events, align);
  const pelotaIcon = iconDataUri("pelota.png");
  const ownGoalIcon = iconDataUri("gc.png");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 15,
        width: GOAL_COLUMN_WIDTH,
        alignItems: "center"
      }}
    >
      {players.map((p, i) => {
        const secondsString = p.seconds
          .map(s => `${Math.round(s / 60)}'`)
          .join(", ");
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              fontSize: 16,
              padding: 2,
              color: colors.text,
              textAlign: "center",
              maxWidth: GOAL_COLUMN_WIDTH
            }}
          >
            <img
              alt=""
              width={14}
              height={14}
              src={p.event === "GOAL" ? pelotaIcon : ownGoalIcon}
              style={{
                marginRight: 5,
                marginTop: 2,
                flexShrink: 0
              }}
            />
            <span style={{ flexShrink: 1 }}>
              {p.name} ({secondsString})
            </span>
          </div>
        );
      })}
    </div>
  );
}

const BASE_HEIGHT = 260;
const GOAL_ROW_LINE_HEIGHT = 22;
const GOAL_ROW_CHARS_PER_LINE = Math.floor((GOAL_COLUMN_WIDTH - 20) / 8);
const TEAM_NAME_COLUMN_WIDTH = CARD_WIDTH / 3 - 8;
const TEAM_NAME_CHARS_PER_LINE = Math.floor(TEAM_NAME_COLUMN_WIDTH / 14);
const TEAM_NAME_LINE_HEIGHT = 30;

function estimatePlayerLines(name: string, secondsString: string) {
  const text = `${name} (${secondsString})`;
  return Math.max(1, Math.ceil(text.length / GOAL_ROW_CHARS_PER_LINE));
}

function estimateSideHeight(events: MatchEvent[], side: "home" | "away") {
  const players = getGoalEvents(events, side);
  return players.reduce((total, p) => {
    const secondsString = p.seconds.map(s => `${Math.round(s / 60)}'`).join(", ");
    return total + estimatePlayerLines(p.name, secondsString) * GOAL_ROW_LINE_HEIGHT;
  }, 0);
}

function estimateTeamNameExtraHeight(data: Match) {
  const lines = [data.teams[0].teamname, data.teams[1].teamname].map(name =>
    Math.max(1, Math.ceil(name.length / TEAM_NAME_CHARS_PER_LINE))
  );
  const maxLines = Math.max(...lines);
  return (maxLines - 1) * TEAM_NAME_LINE_HEIGHT;
}

function estimateHeight(data: Match) {
  const homeHeight = estimateSideHeight(data.matchevents, "home");
  const awayHeight = estimateSideHeight(data.matchevents, "away");
  return (
    BASE_HEIGHT +
    estimateTeamNameExtraHeight(data) +
    Math.max(homeHeight, awayHeight)
  );
}

export async function buildMatchCard(data: Match) {
  const height = estimateHeight(data);
  const element = await buildMatchCardElement(data);
  return { element, width: CARD_WIDTH, height };
}

async function buildMatchCardElement(data: Match) {
  const teamsMap = await getTeamsMap();
  const homeLogo = getTeamLogo(data.teams[0].teamname, teamsMap);
  const awayLogo = getTeamLogo(data.teams[1].teamname, teamsMap);
  const fallbackLogo = `data:image/png;base64,${readFileSync(
    path.join(publicPath, "logo-iosoccer-128.png")
  ).toString("base64")}`;

  async function resolveLogo(url: string) {
    if (url.startsWith("http")) {
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (!res.ok) return fallbackLogo;
        return url;
      } catch {
        return fallbackLogo;
      }
    }
    return fallbackLogo;
  }

  const [homeLogoSrc, awayLogoSrc] = await Promise.all([
    resolveLogo(homeLogo),
    resolveLogo(awayLogo)
  ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: CARD_WIDTH,
        minHeight: "100%",
        padding: 10,
        backgroundColor: colors.bg,
        fontFamily: "Inter"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          fontSize: 16,
          color: colors.headerColor
        }}
      >
        {data.torneo}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          alignItems: "flex-start"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            padding: "0 4px"
          }}
        >
          <span
            style={{
              fontFamily: "Poppins",
              fontSize: 24,
              color: colors.text,
              textAlign: "center"
            }}
          >
            {data.teams[0].teamname}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center"
          }}
        >
          <span style={{ fontSize: 16, color: colors.headerColor }}>
            {fecha(data.fecha)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            padding: "0 4px"
          }}
        >
          <span
            style={{
              fontFamily: "Poppins",
              fontSize: 24,
              color: colors.text,
              textAlign: "center"
            }}
          >
            {data.teams[1].teamname}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: 20,
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center"
          }}
        >
          <img alt="" width={128} height={128} src={homeLogoSrc} />
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center"
          }}
        >
          <span
            style={{
              fontFamily: "Poppins",
              fontSize: 32,
              color: colors.text
            }}
          >
            {data.teams[0].score} - {data.teams[1].score}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center"
          }}
        >
          <img alt="" width={128} height={128} src={awayLogoSrc} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%"
        }}
      >
        <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
          <GoalList events={data.matchevents} align="home" />
        </div>
        <div style={{ display: "flex", flex: 1 }} />
        <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
          <GoalList events={data.matchevents} align="away" />
        </div>
      </div>
    </div>
  );
}
