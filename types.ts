import { ObjectId } from "mongodb";

export interface PlayerStatistics {
  goals: number;
  assists: number;
  shots: number;
  shotsontarget: number;
  passes: number;
  passescompleted: number;
  interceptions: number;
  saves: number;
  fouls: number;
  yellowcards: number;
  redcards: number;
  owngoals: number;
  offsides: number;
  distancecovered: number;
  possession: number;
  corners: number;
  throwins: number;
  penalties: number;
  freekicks: number;
  tackles: number;
  tacklescompleted: number;
  foulssuffered: number;
  savescaught: number;
  goalkicks: number;
  goalsconceded: number;
  secondsplayed: number;
  keypasses: number;
  chancescreated: number;
  secondassists: number;
  positions: {
    position: string;
    seconds: number;
  }[];
}

export interface MatchTeamStats {
  assists: number;
  shots: number;
  shotsontarget: number;
  passes: number;
  passescompleted: number;
  interceptions: number;
  saves: number;
  fouls: number;
  yellowcards: number;
  redcards: number;
  owngoals: number;
  offsides: number;
  distancecovered: number;
  possession: number;
  corners: number;
  throwins: number;
  penalties: number;
  freekicks: number;
  tackles: number;
  tacklescompleted: number;
  foulssuffered: number;
  savescaught: number;
  goalkicks: number;
  goalsconceded: number;
  keypasses: number;
  chancescreated: number;
  secondassists: number;
}

export interface Player extends PlayerStatistics {
  _id: string;
  steamID: string;
  name: string;
  team: string;
  matches: number;
  profilePicture?: string;
  positions: {
    position: string;
    seconds: number;
  }[];
}

export interface MatchPlayer {
  info: {
    name: string;
    steam_id: string;
    team: string;
  };
  statistics: PlayerStatistics;
}

export interface Match {
  _id?: ObjectId;
  filename: string;
  fecha: string;
  torneo: string;
  vod: string | null;
  teams: MatchTeam[];
  players: MatchPlayer[];
  matchevents: MatchEvent[];
}

export interface MatchTeam {
  teamname: string;
  side: "home" | "away";
  score: number;
  scorereceived: number;
  result: -1 | 0 | 1;
  statistics: MatchTeamStats;
  playerStatistics: PlayerStatistics[];
}

export interface MatchEvent {
  second: number;
  event: Event;
  period?: string;
  team: "home" | "away";
  player1SteamId: string;
  player2SteamId: string;
  player3SteamId: string;
  bodyPart?: number;
  startPosition?: {
    x: number;
    y: number;
  };
  name: string;
  name2?: string;
}

export type Event =
  | "GOAL"
  | "ASSIST"
  | "YELLOW CARD"
  | "RED CARD"
  | "OWN GOAL"
  | "SECOND YELLOW";

export interface Positions {
  _id: string;
  PJ: number;
  Pts: number;
  GF: number;
  GC: number;
  PG: number;
  PE: number;
  PP: number;
  DF: number;
}

export interface TeamStats {
  _id: string;
  name: string;
  matches: number;
  goals: number;
  assists: number;
  wins: number;
  draws: number;
  losses: number;
}
