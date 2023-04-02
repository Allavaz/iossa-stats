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

export interface TeamStatistics {
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

export interface Player {
  info: {
    name: string;
    steam_id: string;
    team: string;
  };
  statistics: PlayerStatistics;
}

export interface Match {
  _id: string;
  filename: string;
  fecha: string;
  torneo: string;
  vod: string | null;
  teams: MatchTeam[];
  players: Player[];
  matchevents: MatchEvent[];
}

export interface MatchTeam {
  teamname: string;
  side: "home" | "away";
  score: number;
  scorereceived: number;
  result: -1 | 0 | 1;
  statistics: TeamStatistics;
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
