"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import type { TeamDoc } from "../lib/getFromDB";
import { buildTeamsMap, TeamsMap } from "../utils/Utils";

const TeamsContext = createContext<TeamsMap>({});

export function useTeamsMap(): TeamsMap {
  return useContext(TeamsContext);
}

export function TeamsProvider({ children }: { children: ReactNode }) {
  const [teamsMap, setTeamsMap] = useState<TeamsMap>({});

  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then((teams: TeamDoc[]) => setTeamsMap(buildTeamsMap(teams)));
  }, []);

  return (
    <TeamsContext.Provider value={teamsMap}>{children}</TeamsContext.Provider>
  );
}
