import { Match } from "../types";
import Torneos from "./Torneos.json";

export default function PlayerTeams(steam_id: string, matches: Match[]) {
  const torneosSelecciones = Torneos.find(
    t => t.temporada === "selecciones"
  ).torneos.map(t => t.torneo);

  let teams = [];

  matches.forEach(match => {
    if (torneosSelecciones.includes(match.torneo)) return;
    const player = match.players.find(
      player => player.info.steam_id === steam_id
    );
    if (!player) throw Error("Player not found!!");
    if (teams.length === 0 || teams.at(-1).team !== player.info.team) {
      teams.push({
        team: player.info.team,
        firstMatch: match.fecha,
        lastMatch: match.fecha
      });
    } else {
      teams.at(-1).lastMatch = match.fecha;
    }
  });

  return teams;
}
