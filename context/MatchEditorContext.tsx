"use client";

import { createContext, useContext, ReactNode } from "react";
import { Match, MatchEvent, MatchPlayer, Player } from "../types";
import { TeamsMap } from "../utils/Utils";

interface MatchEditorContextValue {
  match: Match;
  players: Player[];
  editing: any;
  setEditing: (editing: any) => void;
  loading: boolean;
  create: boolean;
  disableUndo: boolean;
  teamsMap: TeamsMap;
  changeTorneo: (torneo: string) => void;
  changeDate: (date: string) => void;
  changeTeam: (newName: string, side: "home" | "away") => void;
  changeScore: (home: number, away: number, isDefault: boolean) => void;
  changeEvents: (matchEvents: MatchEvent[]) => void;
  changeIndivStats: (
    player: MatchPlayer,
    side: "home" | "away",
    index: number,
    oldsteamid: string
  ) => void;
  removePlayer: (player: MatchPlayer, side: "home" | "away", index: number) => void;
  changeVod: (vod: string) => void;
  updateMatch: () => void;
  deleteMatch: () => void;
  exportMatch: () => void;
  restartEditing: () => void;
  undo: () => void;
  dropFile: (ev: React.DragEvent) => void;
}

const MatchEditorContext = createContext<MatchEditorContextValue | null>(null);

export function useMatchEditor(): MatchEditorContextValue | null {
  return useContext(MatchEditorContext);
}

export function MatchEditorProvider({
  children,
  value
}: {
  children: ReactNode;
  value: MatchEditorContextValue;
}) {
  return (
    <MatchEditorContext.Provider value={value}>
      {children}
    </MatchEditorContext.Provider>
  );
}
