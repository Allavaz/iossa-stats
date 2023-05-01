import { getTeamLogo, getTeamShortname, fecha } from "../utils/Utils";
import MatchEventComponent from "./matchEvent";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faSpinner,
  faUpload
} from "@fortawesome/free-solid-svg-icons";
import TorneoEditor from "./torneoEditor";
import DateTimeEditor from "./dateTimeEditor";
import TeamNameEditor from "./teamNameEditor";
import ScoreEditor from "./scoreEditor";
import MatchEventEditor from "./matchEventEditor";
import { Event, Match, MatchEvent, Player } from "../types";
import Link from "next/link";

export default function MatchCard({
  data,
  editing,
  editable,
  players,
  loading,
  setEditing,
  changeTorneo,
  changeDate,
  changeTeam,
  changeScore,
  changeEvents,
  create,
  disableUndo,
  dropFile,
  updateMatch,
  deleteMatch,
  exportMatch,
  restartEditing,
  undo
}: {
  data: Match;
  editable: boolean;
  players: Player[];
  editing: any;
  loading: boolean;
  setEditing: (editing: any) => void;
  changeTorneo: (newTorneo: string) => void;
  changeDate: (newDate: string) => void;
  changeTeam: (newTeam: string, side: "home" | "away") => void;
  changeScore: (home: number, away: number) => void;
  changeEvents: (matchEvents: MatchEvent[]) => void;
  create: boolean;
  disableUndo: boolean;
  dropFile: (ev: React.DragEvent) => void;
  updateMatch: (password: string) => void;
  deleteMatch: (password: string) => void;
  exportMatch: () => void;
  restartEditing: () => void;
  undo: () => void;
}) {
  const [dragging, setDragging] = useState(false);

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

  function onChangeScore(home: number, away: number) {
    changeScore(home, away);
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
    <div className="whitespace">
      {editing === "torneo" ? (
        <TorneoEditor
          torneo={data.torneo}
          onChangeTorneo={onChangeTorneo}
          setEditing={setEditing}
        />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
            height: "22px"
          }}
        >
          {editable && <div style={{ flex: 1 }} />}
          <div
            style={{
              color: "var(--header-color)",
              fontSize: "10pt",
              marginLeft: "5px",
              marginRight: "5px"
            }}
          >
            {data.torneo}
          </div>
          {editable && (
            <div style={{ flex: 1 }}>
              <FontAwesomeIcon
                icon={faEdit}
                style={{
                  cursor: "pointer",
                  fontSize: "10pt",
                  color: "var(--normal-text-color)"
                }}
                onClick={e => {
                  setEditing("torneo");
                }}
              />
            </div>
          )}
        </div>
      )}
      {editing && typeof editing.event !== "undefined" ? (
        <MatchEventEditor
          item={
            editing.new ? newItem(editing.new) : data.matchevents[editing.event]
          }
          index={editing.new ? data.matchevents.length : editing.event}
          players={players}
          onChangeEvent={onChangeEvent}
          editing={editing}
          setEditing={setEditing}
        />
      ) : null}
      <table className="resulttable">
        <tbody>
          <tr>
            <td>
              {editing === "homeTeamName" ? (
                <TeamNameEditor
                  teams={data.teams}
                  side="home"
                  onChangeTeam={onChangeTeam}
                  setEditing={setEditing}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Link href={`/equipo/${data.teams[0].teamname}`}>
                    <a style={{ marginLeft: "5px", marginRight: "5px" }}>
                      <h2>
                        <div id="teamname">{data.teams[0].teamname}</div>
                        <div id="shortname">
                          {getTeamShortname(data.teams[0].teamname)}
                        </div>
                      </h2>
                    </a>
                  </Link>
                  {editable && (
                    <div>
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{
                          cursor: "pointer",
                          fontSize: "1.2em",
                          color: "var(--normal-text-color)"
                        }}
                        onClick={e => {
                          setEditing("homeTeamName");
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </td>
            <td>
              {editing === "date" ? (
                <DateTimeEditor
                  date={data.fecha}
                  onChangeDate={onChangeDate}
                  setEditing={setEditing}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {editable ? <div style={{ flex: 1 }}></div> : null}
                  <div
                    style={{
                      marginLeft: "5px",
                      marginRight: "5px",
                      color: "var(--header-color)"
                    }}
                  >
                    {fecha(data.fecha)}
                  </div>
                  {editable ? (
                    <div
                      style={{
                        flex: 1,
                        textAlign: "left"
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{
                          cursor: "pointer",
                          color: "var(--normal-text-color)"
                        }}
                        onClick={e => {
                          setEditing("date");
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </td>
            <td>
              {editing === "awayTeamName" ? (
                <TeamNameEditor
                  teams={data.teams}
                  side="away"
                  onChangeTeam={onChangeTeam}
                  setEditing={setEditing}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Link href={`/equipo/${data.teams[1].teamname}`}>
                    <a style={{ marginLeft: "5px", marginRight: "5px" }}>
                      <h2>
                        <div id="teamname">{data.teams[1].teamname}</div>
                        <div id="shortname">
                          {getTeamShortname(data.teams[1].teamname)}
                        </div>
                      </h2>
                    </a>
                  </Link>
                  {editable ? (
                    <div>
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{
                          cursor: "pointer",
                          fontSize: "1.2em",
                          color: "var(--normal-text-color)"
                        }}
                        onClick={() => {
                          setEditing("awayTeamName");
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td>
              <Link href={`/equipo/${data.teams[0].teamname}`}>
                <a>
                  <img
                    className="bigClubLogo"
                    alt={data.teams[0].teamname}
                    src={getTeamLogo(data.teams[0].teamname)}
                  />
                </a>
              </Link>
            </td>
            <td>
              {editing === "score" ? (
                <ScoreEditor
                  home={data.teams[0].score}
                  away={data.teams[1].score}
                  onChangeScore={onChangeScore}
                  setEditing={setEditing}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {editable ? <div style={{ flex: 1 }}></div> : null}
                  <div style={{ marginLeft: "5px", marginRight: "5px" }}>
                    <h2 id="result">
                      {data.teams[0].score} - {data.teams[1].score}
                    </h2>
                  </div>
                  {editable ? (
                    <div
                      style={{
                        flex: 1,
                        textAlign: "left"
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{
                          cursor: "pointer",
                          fontSize: "1.2em",
                          color: "var(--normal-text-color)"
                        }}
                        onClick={e => {
                          setEditing("score");
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </td>
            <td>
              <Link href={`/equipo/${data.teams[1].teamname}`}>
                <a>
                  <img
                    className="bigClubLogo"
                    alt={data.teams[1].teamname}
                    src={getTeamLogo(data.teams[1].teamname)}
                  />
                </a>
              </Link>
            </td>
          </tr>
          <tr id="eventslist">
            <td>
              <ul style={{ listStyleType: "none", paddingInlineStart: "0px" }}>
                {data.matchevents.map((item, index) => (
                  <MatchEventComponent
                    item={item}
                    key={index}
                    side="home"
                    index={index}
                    editable={editable}
                    onRemoveEvent={onRemoveEvent}
                    setEditing={setEditing}
                  />
                ))}
                {editable ? (
                  <li>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ cursor: "pointer" }}
                      onClick={e => {
                        onAddEvent("home");
                      }}
                    />
                  </li>
                ) : null}
              </ul>
            </td>
            <td>
              {editable && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: "10px"
                  }}
                >
                  {create && (
                    <div
                      style={{
                        padding: "20px",
                        width: "100px",
                        border: dragging
                          ? "2px dashed var(--header-color)"
                          : "2px dashed var(--button-border)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        zIndex: "3"
                      }}
                      onDragEnter={e => setDragging(true)}
                      onDragLeave={e => setDragging(false)}
                      onDrop={ev => {
                        setDragging(false);
                        dropFile(ev);
                      }}
                      onDragOver={ev => {
                        ev.preventDefault();
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUpload}
                        style={{
                          color: "var(--header-color)",
                          fontSize: "3em",
                          pointerEvents: "none"
                        }}
                      />
                    </div>
                  )}
                  <input
                    id="password"
                    disabled={loading}
                    type="password"
                    placeholder="Contraseña"
                    style={{
                      textAlign: "center",
                      width: "20ch",
                      height: "22px"
                    }}
                  ></input>
                  <button
                    className="boton"
                    disabled={loading}
                    onClick={e => {
                      updateMatch(
                        (
                          document.getElementById(
                            "password"
                          ) as HTMLInputElement
                        ).value
                      );
                    }}
                  >
                    {create ? "Subir partido" : "Guardar cambios"}
                  </button>
                  {!create && (
                    <button
                      className="boton"
                      disabled={loading}
                      onClick={e => {
                        deleteMatch(
                          (
                            document.getElementById(
                              "password"
                            ) as HTMLInputElement
                          ).value
                        );
                      }}
                    >
                      Eliminar partido
                    </button>
                  )}
                  <button
                    className="boton"
                    disabled={loading}
                    onClick={e => exportMatch()}
                  >
                    Descargar JSON
                  </button>
                  {!create && (
                    <button
                      className="boton"
                      disabled={loading}
                      onClick={e => {
                        restartEditing();
                        setEditing(null);
                      }}
                    >
                      Reiniciar edición
                    </button>
                  )}
                  <button
                    className="boton"
                    onClick={e => undo()}
                    disabled={disableUndo}
                  >
                    Deshacer
                  </button>
                  {loading ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      color="#ff9800"
                      size="lg"
                    />
                  ) : null}
                </div>
              )}
            </td>
            <td>
              <ul style={{ listStyleType: "none", paddingInlineStart: "0px" }}>
                {data.matchevents.map((item: MatchEvent, index) => (
                  <MatchEventComponent
                    item={item}
                    key={index}
                    side="away"
                    index={index}
                    editable={editable}
                    onRemoveEvent={onRemoveEvent}
                    setEditing={setEditing}
                  />
                ))}
                {editable ? (
                  <li>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ cursor: "pointer" }}
                      onClick={e => {
                        onAddEvent("away");
                      }}
                    />
                  </li>
                ) : null}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
