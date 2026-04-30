"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buildBlankMatch, getTeamLogo } from "../../../utils/Utils";
import Torneos from "../../../utils/Torneos.json";
import axios from "axios";
import { Match, MatchEvent, MatchPlayer } from "../../../types";
import createJSON from "../../../lib/createJSON";
import Card from "../../../components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/ui/button";
import PositionsComponent from "../../../components/positions";
import MatchIndividualStatsEditable from "./matchIndividualStatsEditable";
import MatchCardEditor from "./matchCardEditor";
import Title from "../../../components/ui/title";
import Challonge from "../../../components/challonge";
import Vod from "./vod";
import VodEditor from "./vodEditor";
import MatchTeamStats from "./matchTeamStats";
import { MatchEditorProvider } from "../../../context/MatchEditorContext";

export default function MatchEditor({
  match,
  players,
  table,
  challonge,
  create,
  teamsMap
}) {
  const router = useRouter();
  const [editableMatch, setEditableMatch] = useState(
    create ? [buildBlankMatch()] : [JSON.parse(JSON.stringify(match))]
  );
  const [editableTable, setEditableTable] = useState({
    positions: table && JSON.parse(JSON.stringify(table.positions)),
    header: create ? "" : table && table.header
  });
  const [editableChallonge, setEditableChallonge] = useState(challonge);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  function applyScoreResult(data: Match, homeScore: number, awayScore: number) {
    data.teams[0].score = homeScore;
    data.teams[0].scorereceived = awayScore;
    data.teams[1].score = awayScore;
    data.teams[1].scorereceived = homeScore;
    if (homeScore > awayScore) {
      data.teams[0].result = 1;
      data.teams[1].result = -1;
    } else if (awayScore > homeScore) {
      data.teams[1].result = 1;
      data.teams[0].result = -1;
    } else {
      data.teams[0].result = 0;
      data.teams[1].result = 0;
    }
  }

  function changeTorneo(torneo: string) {
    setEditableTable({ positions: null, header: "" });
    setEditableChallonge(null);
    setEditableMatch(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.torneo = torneo;
      return [...prevState, data];
    });
    updateTableOrChallonge(torneo);
  }

  function updateTableOrChallonge(torneo: string) {
    for (let i in Torneos) {
      for (let j in Torneos[i].torneos) {
        let t: any = Torneos[i].torneos[j];
        if (t.torneo === torneo) {
          if (t.challonge) {
            setEditableChallonge(t.challonge);
          } else if (t.tabla) {
            axios.get("/api/positions/" + t.tabla).then(res => {
              setEditableTable({
                positions: res.data,
                header: t.tablaLabel || t.torneo
              });
            });
          }
        }
      }
    }
  }

  function changeDate(date: string) {
    setEditableMatch(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.fecha = date;
      return [...prevState, data];
    });
  }

  function changeTeam(newName: string, side: "home" | "away") {
    let s = side === "home" ? 0 : 1;
    setEditableMatch(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.teams[s].teamname = newName;
      data.teams[s].teamLogo = getTeamLogo(newName, teamsMap);
      for (let i in data.teams[s].playerStatistics) {
        data.teams[s].playerStatistics[i].info.team = newName;
        for (let j in data.players) {
          if (
            data.teams[s].playerStatistics[i].info.steam_id ===
            data.players[j].info.steam_id
          ) {
            data.players[j].info.team = newName;
          }
        }
      }
      return [...prevState, data];
    });
  }

  function changeScore(home: number, away: number, isDefault: boolean) {
    setEditableMatch(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.isdefault = isDefault;
      applyScoreResult(data, home, away);
      return [...prevState, data];
    });
  }

  function changeEvents(matchEvents: MatchEvent[]) {
    setEditableMatch(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.matchevents = matchEvents;
      data = runPredictIndivStats(data);
      data = runPredictTeamStats(data);
      return [...prevState, data];
    });
  }

  function runPredictTeamStats(data: Match): Match {
    const events = data.matchevents;

    const home = {
      score: 0,
      goals: 0,
      assists: 0,
      secondassists: 0,
      yellowcards: 0,
      redcards: 0,
      secondyellows: 0,
      fouls: 0,
      passes: 0,
      passescompleted: 0,
      keypasses: 0,
      offsides: 0,
      corners: 0,
      shots: 0,
      shotsontarget: 0,
      chancescreated: 0
    };
    const away = {
      score: 0,
      goals: 0,
      assists: 0,
      secondassists: 0,
      yellowcards: 0,
      redcards: 0,
      secondyellows: 0,
      fouls: 0,
      passes: 0,
      passescompleted: 0,
      keypasses: 0,
      offsides: 0,
      corners: 0,
      shots: 0,
      shotsontarget: 0,
      chancescreated: 0
    };

    for (const ev of events) {
      const s = ev.team === "home" ? home : away;
      const opp = ev.team === "home" ? away : home;
      switch (ev.event) {
        case "GOAL":
          s.score++;
          s.goals++;
          break;
        case "YELLOW CARD":
          s.yellowcards++;
          break;
        case "RED CARD":
          s.redcards++;
          break;
        case "SECOND YELLOW":
          s.secondyellows++;
          break;
        case "OWN GOAL":
          opp.score++;
          break;
      }
    }

    const statFields = [
      "assists",
      "secondassists",
      "shots",
      "shotsontarget",
      "fouls",
      "passes",
      "passescompleted",
      "keypasses",
      "offsides",
      "corners",
      "chancescreated"
    ] as const;

    for (const p of data.teams[0].playerStatistics) {
      for (const f of statFields) {
        home[f] += parseInt((p.statistics as any)[f]) || 0;
      }
    }
    for (const p of data.teams[1].playerStatistics) {
      for (const f of statFields) {
        away[f] += parseInt((p.statistics as any)[f]) || 0;
      }
    }

    applyScoreResult(data, home.score, away.score);

    const write = (t: typeof home, idx: number) => {
      const s = data.teams[idx].statistics;
      s.assists = t.assists;
      s.secondassists = t.secondassists;
      s.shots = Math.max(t.shots, t.goals);
      s.shotsontarget = Math.max(t.shotsontarget, t.goals);
      s.fouls = Math.max(t.fouls, t.yellowcards + t.redcards + t.secondyellows);
      s.passes = t.passes;
      s.passescompleted = t.passescompleted;
      s.keypasses = t.keypasses;
      s.offsides = t.offsides;
      s.corners = t.corners;
      s.chancescreated = t.chancescreated;
      s.yellowcards = t.yellowcards + t.secondyellows;
      s.redcards = t.redcards + t.secondyellows;
    };

    write(home, 0);
    write(away, 1);

    return data;
  }

  function runPredictIndivStats(data: Match): Match {
    const events = data.matchevents;
    const homePlayerStatistics = data.teams[0].playerStatistics;
    const awayPlayerStatistics = data.teams[1].playerStatistics;
    const playerStatistics = data.players;

    const resetStats = (p: MatchPlayer) => {
      p.statistics.goals = 0;
      p.statistics.owngoals = 0;
      p.statistics.yellowcards = 0;
      p.statistics.redcards = 0;
      p.statistics.assists = 0;
      p.statistics.secondassists = 0;
    };

    for (const p of homePlayerStatistics) resetStats(p);
    for (const p of awayPlayerStatistics) resetStats(p);
    for (const p of playerStatistics) resetStats(p);

    const seenSteamIds = new Set<string>();
    const steamids: { steamid: string; side: string; name: string }[] = [];

    for (const ev of events) {
      if (ev.player1SteamId && !seenSteamIds.has(ev.player1SteamId)) {
        seenSteamIds.add(ev.player1SteamId);
        steamids.push({
          steamid: ev.player1SteamId,
          side: ev.team,
          name: ev.name
        });
      }
      if (ev.player2SteamId && !seenSteamIds.has(ev.player2SteamId)) {
        seenSteamIds.add(ev.player2SteamId);
        steamids.push({
          steamid: ev.player2SteamId,
          side: ev.team,
          name: ev.name2
        });
      }
      if (ev.player3SteamId && !seenSteamIds.has(ev.player3SteamId)) {
        seenSteamIds.add(ev.player3SteamId);
        steamids.push({
          steamid: ev.player3SteamId,
          side: ev.team,
          name: ev.name3
        });
      }
    }

    for (const entry of steamids) {
      let found = false;
      const all = [
        ...homePlayerStatistics,
        ...awayPlayerStatistics,
        ...playerStatistics
      ];
      for (const p of all) {
        if (p.info.steam_id === entry.steamid) {
          found = true;
          predictPlayerStats(p, data);
        }
      }
    }

    data.teams[0].playerStatistics = homePlayerStatistics;
    data.teams[1].playerStatistics = awayPlayerStatistics;
    data.players = playerStatistics;
    return data;
  }

  function predictPlayerStats(player: MatchPlayer, match: Match) {
    const events = match.matchevents;
    const acc = events.reduce(
      (a, item) => {
        if (item.player1SteamId === player.info.steam_id) {
          switch (item.event) {
            case "GOAL":
              a.goals += 1;
              break;
            case "OWN GOAL":
              a.owngoals += 1;
              break;
            case "YELLOW CARD":
              a.yellowcards += 1;
              break;
            case "SECOND YELLOW":
              a.yellowcards += 1;
              a.redcards += 1;
              break;
            case "RED CARD":
              a.redcards += 1;
              break;
          }
        } else if (
          item.player2SteamId === player.info.steam_id &&
          item.event === "GOAL"
        ) {
          a.assists += 1;
        } else if (
          item.player3SteamId === player.info.steam_id &&
          item.event === "GOAL"
        ) {
          a.secondassists += 1;
        }
        return a;
      },
      {
        goals: 0,
        owngoals: 0,
        yellowcards: 0,
        redcards: 0,
        assists: 0,
        secondassists: 0
      }
    );

    Object.assign(player.statistics, acc);

    if (
      player.statistics.fouls <
      player.statistics.yellowcards + player.statistics.redcards
    ) {
      player.statistics.fouls =
        player.statistics.yellowcards + player.statistics.redcards;
    }
    if (player.statistics.goals > player.statistics.shots) {
      player.statistics.shots = player.statistics.goals;
    }
    if (player.statistics.goals > player.statistics.shotsontarget) {
      player.statistics.shotsontarget = player.statistics.goals;
    }

    for (const e of events) {
      if (e.player1SteamId === player.info.steam_id) {
        player.info.name = e.name;
      }
    }
  }

  function changeVod(vod: string) {
    setEditableMatch(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      data.vod = vod;
      return [...prevState, data];
    });
  }

  function changeIndivStats(
    player: MatchPlayer,
    side: "home" | "away",
    index: number,
    oldsteamid: string
  ) {
    setEditableMatch(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      let s = side === "home" ? 0 : 1;
      const oldSeconds =
        data.teams[s].playerStatistics[index]?.statistics.secondsplayed ?? 0;
      const newSeconds = player.statistics.secondsplayed;
      if (oldSeconds > 0 && newSeconds !== oldSeconds) {
        const ratio = newSeconds / oldSeconds;
        player.statistics.positions = player.statistics.positions.map(p => ({
          ...p,
          seconds: Math.round(p.seconds * ratio)
        }));
      }
      data.teams[s].playerStatistics[index] = player;
      const steamidlookup = oldsteamid || player.info.steam_id;
      let playerExists = false;
      for (let i in data.players) {
        if (data.players[i].info.steam_id === steamidlookup) {
          data.players[i] = player;
          playerExists = true;
        }
      }
      if (!playerExists) {
        data.players.push(player);
      }
      for (let i in data.matchevents) {
        if (data.matchevents[i].player1SteamId === steamidlookup) {
          data.matchevents[i].name = player.info.name;
          data.matchevents[i].player1SteamId = player.info.steam_id;
        }
      }
      return [...prevState, data];
    });
    predictTeamStats();
  }

  function predictTeamStats() {
    setEditableMatch(prevState => {
      const data = JSON.parse(JSON.stringify(prevState.at(-1)));
      return prevState.map((_, i) =>
        i === prevState.length - 1 ? runPredictTeamStats(data) : prevState[i]
      );
    });
  }

  function removePlayer(
    player: MatchPlayer,
    side: "home" | "away",
    index: number
  ) {
    setEditableMatch(prevState => {
      let data = JSON.parse(JSON.stringify(prevState.at(-1)));
      let s = side === "home" ? 0 : 1;
      data.teams[s].playerStatistics.splice(index, 1);
      data.players = data.players.filter(
        (p: MatchPlayer) => p.info.steam_id !== player.info.steam_id
      );
      data.matchevents = data.matchevents.filter(
        (event: MatchEvent) => event.player1SteamId !== player.info.steam_id
      );
      return [...prevState, data];
    });
    predictTeamStats();
  }

  function exportMatch() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(editableMatch.at(-1))], {
      type: "application/json"
    });
    element.href = URL.createObjectURL(file);
    element.download = editableMatch.at(-1).filename;
    document.body.appendChild(element);
    element.click();
  }

  function restartEditing() {
    setEditableMatch([JSON.parse(JSON.stringify(match))]);
    setEditing(null);
  }

  function updateMatch() {
    if (editableMatch.at(-1).torneo === "Torneo") {
      alert("Te faltó elegir el torneo!");
    } else if (editing) {
      alert("Hay cambios sin guardar!");
    } else if (
      editableMatch.at(-1).teams[0].statistics.possession +
        editableMatch.at(-1).teams[1].statistics.possession !==
        100 &&
      !editableMatch.at(-1).isdefault
    ) {
      alert("Las posesiones están desbalanceadas. Revisá las cuentas.");
    } else {
      setLoading(true);
      axios
        .post(`/api/post${create ? "upload" : "update"}`, {
          data: editableMatch.at(-1)
        })
        .then(res => {
          if (res.data.status === "Success!") {
            if (create) {
              setEditableMatch(old =>
                old.map((e, i) => {
                  if (i === old.length - 1) {
                    return { ...e, _id: res.data.id };
                  } else {
                    return { e };
                  }
                })
              );
            }
            setSuccess("updating");
          } else {
            alert("Ocurrió un error. Revisá la consola.");
          }
          setLoading(false);
        })
        .catch(e => console.error(e));
    }
  }

  function deleteMatch() {
    setLoading(true);
    axios
      .post("/api/postdelete", {
        data: editableMatch.at(-1)
      })
      .then(res => {
        if (res.data === "Success!") {
          setSuccess("deleting");
        } else {
          alert("Ocurrió un error. Revisá la consola.");
        }
        setLoading(false);
      })
      .catch(e => console.error(e));
  }

  function undo() {
    setEditing(null);
    setEditableMatch(prevState =>
      prevState.filter((_, i) => i !== prevState.length - 1)
    );
  }

  function dropFile(ev: React.DragEvent) {
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      if (
        ev.dataTransfer.items.length == 1 &&
        ev.dataTransfer.items[0].kind === "file"
      ) {
        let file = ev.dataTransfer.items[0].getAsFile();
        try {
          let lastData = editableMatch.at(-1);
          file.text().then(res => {
            let json = JSON.parse(res);
            let doc = createJSON(
              json,
              lastData.torneo,
              lastData.vod,
              file.name
            );
            setEditableMatch(old => [...old, doc]);
          });
        } catch (error) {
          alert("Archivo inválido. Intentá con otro.");
          console.error(error);
        }
      }
    }
  }

  if (success === "updating") {
    return (
      <div className="m-auto w-fit">
        <Card>
          <div className="flex flex-col items-center gap-y-4 p-10">
            <FontAwesomeIcon
              icon={faCheckCircle}
              color="--var(header-color)"
              size="5x"
            />
            <div>Partido {create ? "subido" : "modificado"} correctamente.</div>
            <div>
              <Button
                onClick={_ => {
                  router.push("/partido/" + editableMatch.at(-1)._id);
                  setSuccess(null);
                }}
              >
                Ir al partido
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  } else if (success === "deleting") {
    return (
      <div className="m-auto w-fit">
        <Card>
          <div className="flex flex-col items-center gap-y-4 p-10">
            <FontAwesomeIcon
              icon={faCheckCircle}
              color="--var(header-color)"
              size="5x"
            />
            <div>Partido eliminado correctamente.</div>
            <Button onClick={_ => router.push("/")}>Volver al inicio</Button>
          </div>
        </Card>
      </div>
    );
  } else {
    const currentMatch = editableMatch.at(-1);
    return (
      <MatchEditorProvider
        value={{
          match: currentMatch,
          players,
          editing,
          setEditing,
          loading,
          create,
          disableUndo: editableMatch.length < 2,
          teamsMap,
          changeTorneo,
          changeDate,
          changeTeam,
          changeScore,
          changeEvents,
          changeIndivStats,
          removePlayer,
          changeVod,
          updateMatch,
          deleteMatch,
          exportMatch,
          restartEditing,
          undo,
          dropFile
        }}
      >
        <div className="flex flex-col gap-y-4">
          <MatchCardEditor />
          <div className="flex flex-wrap justify-center gap-4">
            <div className="max-w-xl grow">
              <MatchTeamStats match={currentMatch} />
            </div>
            {editableChallonge && (
              <>
                <Title>{currentMatch.torneo}</Title>
                <Challonge id={editableChallonge || challonge} />
              </>
            )}
            {editableTable.positions && (
              <div className="flex grow flex-col gap-y-2 overflow-x-auto">
                <PositionsComponent
                  teams={editableTable.positions}
                  header={editableTable.header}
                />
                <div className="text-sm italic text-neutral-500 dark:text-neutral-400">
                  La tabla se actualizará luego de subir el partido.
                </div>
              </div>
            )}
          </div>
          <MatchIndividualStatsEditable side="home" />
          <MatchIndividualStatsEditable side="away" />
          {currentMatch.vod && editing !== "vod" && <Vod editable />}
          {(currentMatch.vod === null || editing === "vod") && <VodEditor />}
        </div>
      </MatchEditorProvider>
    );
  }
}
