import {
  faEdit,
  faPlus,
  faSpinner,
  faUpload
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import DefaultIndicator from "../../../components/defaultIndicator";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Modal from "../../../components/ui/modal";
import { Event, MatchEvent } from "../../../types";
import { fecha } from "../../../utils/Utils";
import { useMatchEditor } from "../../../context/MatchEditorContext";
import DateTimeEditor from "./dateTimeEditor";
import MatchEventEditable from "./matchEventEditable";
import MatchEventEditor from "./matchEventEditor";
import ScoreEditor from "./scoreEditor";
import TeamNameEditor from "./teamNameEditor";
import TorneoEditor from "./torneoEditor";

export default function MatchCardEditor() {
  const {
    match: data,
    editing,
    setEditing,
    loading,
    create,
    disableUndo,
    teamsMap,
    changeTorneo,
    changeDate,
    changeTeam,
    changeScore,
    changeEvents,
    updateMatch,
    deleteMatch,
    exportMatch,
    restartEditing,
    undo,
    dropFile
  } = useMatchEditor();

  const [dragging, setDragging] = useState(false);

  function getEventSide(event: MatchEvent): "home" | "away" {
    if (
      (event.team === "home" && event.event !== "OWN GOAL") ||
      (event.team === "away" && event.event === "OWN GOAL")
    ) {
      return "home";
    } else if (
      (event.team === "away" && event.event !== "OWN GOAL") ||
      (event.team === "home" && event.event === "OWN GOAL")
    ) {
      return "away";
    }
  }

  function onChangeTorneo(value: string) {
    changeTorneo(value);
    setEditing(null);
  }

  function onChangeDate(date: string) {
    changeDate(date);
  }

  function onChangeTeam(newTeam: string, side: "home" | "away") {
    changeTeam(newTeam, side);
    setEditing(null);
  }

  function onChangeScore(home: number, away: number, isDefault: boolean) {
    changeScore(home, away, isDefault);
  }

  function onAddEvent(side) {
    setEditing({ event: data.matchevents.length, new: side });
  }

  function onChangeEvent(
    event: Event,
    playerName: string,
    playerSteamId: string,
    playerName2: string,
    playerSteamId2: string,
    playerName3: string,
    playerSteamId3: string,
    minute: number,
    index: number
  ) {
    let matchEvents = JSON.parse(JSON.stringify(data.matchevents));
    if (editing.new) {
      let team = editing.new;
      if (event === "OWN GOAL") {
        if (editing.new === "home") {
          team = "away";
        } else if (editing.new === "away") {
          team = "home";
        }
      }
      matchEvents.push({
        event: event,
        name: playerName,
        player1SteamId: playerSteamId,
        ...(event === "GOAL" && playerSteamId2
          ? { name2: playerName2, player2SteamId: playerSteamId2 }
          : {}),
        ...(event === "GOAL" && playerSteamId3
          ? { name3: playerName3, player3SteamId: playerSteamId3 }
          : {}),
        period: minute * 60 > 45 ? "SECOND HALF" : "FIRST HALF",
        second: minute * 60,
        team: team
      });
    } else {
      matchEvents[index].event = event;
      matchEvents[index].name = playerName;
      matchEvents[index].player1SteamId = playerSteamId;
      if (playerSteamId2) {
        matchEvents[index].name2 = playerName2;
        matchEvents[index].player2SteamId = playerSteamId2;
      }
      if (playerSteamId3) {
        matchEvents[index].name3 = playerName3;
        matchEvents[index].player3SteamId = playerSteamId3;
      }
      matchEvents[index].second = minute * 60;
      matchEvents[index].period =
        minute * 60 > 45 ? "SECOND HALF" : "FIRST HALF";
      let prevEvent = matchEvents[index].event;
      if (
        (event === "OWN GOAL" && prevEvent !== "OWN GOAL") ||
        (event !== "OWN GOAL" && prevEvent === "OWN GOAL")
      ) {
        if (matchEvents[index].team === "home") {
          matchEvents[index].team = "away";
        } else if (matchEvents[index].team === "away") {
          matchEvents[index].team = "home";
        }
      }
    }

    matchEvents.sort((a, b) => {
      return a.second - b.second;
    });

    let yellows = 0;
    for (let i in matchEvents) {
      if (matchEvents[i].player1SteamId === playerSteamId) {
        if (
          matchEvents[i].event === "YELLOW CARD" ||
          matchEvents[i].event === "SECOND YELLOW"
        ) {
          yellows++;
          if (yellows % 2 === 0) {
            matchEvents[i].event = "SECOND YELLOW";
          }
        }
      }
    }

    for (let i in matchEvents) {
      if (matchEvents[i].player1SteamId === playerSteamId) {
        matchEvents[i].name = playerName;
      }
    }

    changeEvents(matchEvents);
  }

  function onRemoveEvent(index) {
    let matchEvents = JSON.parse(JSON.stringify(data.matchevents));
    matchEvents.splice(index, 1);
    changeEvents(matchEvents);
  }

  function newItem(side) {
    return {
      event: "GOAL",
      name: "",
      period: "FIRST HALF",
      player1SteamId: "",
      player2SteamId: "",
      second:
        data.matchevents.length === 0
          ? 0
          : data.matchevents[data.matchevents.length - 1].second,
      team: side
    };
  }

  return (
    <Card>
      {editing && typeof editing.event !== "undefined" ? (
        <Modal>
          <MatchEventEditor
            item={
              editing.new
                ? newItem(editing.new)
                : data.matchevents[editing.event]
            }
            index={editing.new ? data.matchevents.length : editing.event}
            side={editing.new || getEventSide(data.matchevents[editing.event])}
            teamName={
              editing.new
                ? editing.new === "home"
                  ? data.teams[0].teamname
                  : data.teams[1].teamname
                : getEventSide(data.matchevents[editing.event]) === "home"
                ? data.teams[0].teamname
                : data.teams[1].teamname
            }
            homePlayers={data.teams[0].playerStatistics}
            awayPlayers={data.teams[1].playerStatistics}
            onChangeEvent={onChangeEvent}
            editing={editing}
            setEditing={setEditing}
          />
        </Modal>
      ) : null}
      <table className="w-full table-fixed text-center align-middle">
        <tbody>
          <tr>
            <td className="p-1" colSpan={3}>
              {editing === "torneo" ? (
                <TorneoEditor
                  torneo={data.torneo}
                  onChangeTorneo={onChangeTorneo}
                  setEditing={setEditing}
                />
              ) : (
                <div className="flex justify-center gap-x-2">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {data.torneo}
                  </div>
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faEdit}
                    onClick={_ => {
                      setEditing("torneo");
                    }}
                  />
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="p-1">
              {editing === "homeTeamName" ? (
                <TeamNameEditor
                  teams={data.teams}
                  side="home"
                  onChangeTeam={onChangeTeam}
                  setEditing={setEditing}
                  teamsMap={teamsMap}
                />
              ) : (
                <div>
                  <Link
                    href={`/equipo/${data.teams[0].teamname}`}
                    className="inline font-heading text-2xl"
                  >
                    <span className="hidden sm:inline">
                      {data.teams[0].teamname}
                    </span>
                    <span className="sm:hidden">{data.teams[0].shortname}</span>{" "}
                  </Link>
                  <FontAwesomeIcon
                    className="cursor-pointer sm:font-heading sm:text-2xl"
                    icon={faEdit}
                    onClick={_ => {
                      setEditing("homeTeamName");
                    }}
                  />
                </div>
              )}
            </td>
            <td className="p-1">
              {editing === "date" ? (
                <DateTimeEditor
                  date={data.fecha}
                  onChangeDate={onChangeDate}
                  setEditing={setEditing}
                />
              ) : (
                <div className="flex items-center justify-center gap-x-2">
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {fecha(data.fecha)}
                  </div>
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faEdit}
                    onClick={_ => {
                      setEditing("date");
                    }}
                  />
                </div>
              )}
            </td>
            <td className="p-1">
              {editing === "awayTeamName" ? (
                <TeamNameEditor
                  teams={data.teams}
                  side="away"
                  onChangeTeam={onChangeTeam}
                  setEditing={setEditing}
                  teamsMap={teamsMap}
                />
              ) : (
                <div>
                  <Link
                    href={`/equipo/${data.teams[1].teamname}`}
                    className="inline font-heading text-2xl"
                  >
                    <span className="hidden sm:inline">
                      {data.teams[1].teamname}
                    </span>
                    <span className="sm:hidden">{data.teams[1].shortname}</span>{" "}
                    <span></span>
                  </Link>
                  <FontAwesomeIcon
                    className="cursor-pointer sm:font-heading sm:text-2xl"
                    icon={faEdit}
                    onClick={_ => {
                      setEditing("awayTeamName");
                    }}
                  />
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td className="p-4">
              <div className="flex justify-center">
                <Link href={`/equipo/${data.teams[0].teamname}`}>
                  <img
                    alt={data.teams[0].teamname}
                    src={data.teams[0].teamLogo}
                  />
                </Link>
              </div>
            </td>
            <td className="p-4">
              {editing === "score" ? (
                <ScoreEditor
                  home={data.teams[0].score}
                  away={data.teams[1].score}
                  isDefault={data.isdefault}
                  onChangeScore={onChangeScore}
                  setEditing={setEditing}
                />
              ) : (
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center justify-center gap-x-2">
                    <div className="whitespace-nowrap font-heading text-3xl">
                      {data.teams[0].score} - {data.teams[1].score}
                    </div>
                    <FontAwesomeIcon
                      className="cursor-pointer"
                      icon={faEdit}
                      onClick={e => {
                        setEditing("score");
                      }}
                    />
                  </div>
                  {data.isdefault && <DefaultIndicator />}
                </div>
              )}
            </td>
            <td className="p-4">
              <div className="flex justify-center">
                <Link href={`/equipo/${data.teams[1].teamname}`}>
                  <img
                    alt={data.teams[1].teamname}
                    src={data.teams[1].teamLogo}
                  />
                </Link>
              </div>
            </td>
          </tr>
          <tr className="align-top">
            <td className="p-1">
              <ul>
                {data.matchevents.map(
                  (item, index) =>
                    getEventSide(item) === "home" && (
                      <MatchEventEditable
                        item={item}
                        key={index}
                        index={index}
                        onRemoveEvent={onRemoveEvent}
                      />
                    )
                )}
                <li>
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faPlus}
                    onClick={e => {
                      onAddEvent("home");
                    }}
                  />
                </li>
              </ul>
            </td>
            <td className="p-1">
              <div className="flex flex-col items-center gap-y-3">
                {create && (
                  <div
                    className={`relative z-10 flex flex-col items-center justify-center gap-y-4 border-2 border-dashed p-9 ${
                      dragging
                        ? "border-neutral-400 dark:border-neutral-500"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                    onDragEnter={_ => setDragging(true)}
                    onDragLeave={_ => setDragging(false)}
                    onDrop={e => {
                      setDragging(false);
                      dropFile(e);
                    }}
                    onDragOver={e => {
                      e.preventDefault();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUpload}
                      className={`pointer-events-none text-3xl ${
                        dragging
                          ? "text-neutral-400 dark:text-neutral-500"
                          : "text-neutral-300 dark:text-neutral-600"
                      }`}
                    />
                    <div
                      className={`pointer-events-none ${
                        dragging
                          ? "text-neutral-400 dark:text-neutral-500"
                          : "text-neutral-300 dark:text-neutral-600"
                      }`}
                    >
                      Subir JSON del partido…
                    </div>
                  </div>
                )}
                <Button
                  disabled={loading}
                  onClick={e => {
                    updateMatch();
                  }}
                >
                  {create ? "Subir partido" : "Guardar cambios"}
                </Button>
                {!create && (
                  <Button
                    disabled={loading}
                    onClick={e => {
                      deleteMatch();
                    }}
                  >
                    Eliminar partido
                  </Button>
                )}
                <Button disabled={loading} onClick={e => exportMatch()}>
                  Descargar JSON
                </Button>
                {!create && (
                  <Button
                    disabled={loading}
                    onClick={e => {
                      restartEditing();
                      setEditing(null);
                    }}
                  >
                    Reiniciar edición
                  </Button>
                )}
                <Button onClick={e => undo()} disabled={disableUndo}>
                  Deshacer
                </Button>
                {loading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    color="#ff9800"
                    size="lg"
                  />
                ) : null}
              </div>
            </td>
            <td>
              <ul>
                {data.matchevents.map(
                  (item, index) =>
                    getEventSide(item) === "away" && (
                      <MatchEventEditable
                        item={item}
                        key={index}
                        index={index}
                        onRemoveEvent={onRemoveEvent}
                      />
                    )
                )}
                <li>
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faPlus}
                    onClick={e => {
                      onAddEvent("away");
                    }}
                  />
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
