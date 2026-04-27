"use client";

import { createContext, useContext, ReactNode } from "react";
import { TeamsMap } from "../utils/Utils";

const TeamsContext = createContext<TeamsMap>({});

export function useTeamsMap(): TeamsMap {
  return useContext(TeamsContext);
}

export function TeamsProvider({
  children,
  initialTeamsMap
}: {
  children: ReactNode;
  initialTeamsMap: TeamsMap;
}) {
  return (
    <TeamsContext.Provider value={initialTeamsMap}>
      {children}
    </TeamsContext.Provider>
  );
}
