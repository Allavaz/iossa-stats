import { getTeamLogo, getTeamShortname, fecha } from "../utils/Utils";
import MatchEvent from "./matchEvent";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faSpinner,
  faArrowDown,
  faUpload
} from "@fortawesome/free-solid-svg-icons";
import TorneoEditor from "./torneoEditor";
import DateTimeEditor from "./dateTimeEditor";
import TeamNameEditor from "./teamNameEditor";
import ScoreEditor from "./scoreEditor";
import MatchEventEditor from "./matchEventEditor";

export default function MatchCard(props) {
  const [scoreHovering, setScoreHovering] = useState(false);
  const [dateHovering, setDateHovering] = useState(false);
  const [homeTeamNameHovering, setHomeTeamNameHovering] = useState(false);
  const [awayTeamNameHovering, setAwayTeamNameHovering] = useState(false);
  const [torneoHovering, setTorneoHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  function onChangeTorneo(value) {
    props.changeTorneo(value);
    props.setEditing(null);
    setTorneoHovering(false);
  }

  function onChangeDate(date) {
    props.changeDate(date);
    setDateHovering(false);
  }

  function onChangeTeam(value, side) {
    props.changeTeam(value, side);
    props.setEditing(null);
    setHomeTeamNameHovering(false);
    setAwayTeamNameHovering(false);
  }

  function onChangeScore(home, away) {
    props.changeScore(home, away);
    setScoreHovering(false);
  }

  function onAddEvent(side) {
    props.setEditing({ event: props.data.matchevents.length, new: side });
  }

  function onChangeEvent(event, playerName, playerSteamId, minute, index) {
    let matchEvents = JSON.parse(JSON.stringify(props.data.matchevents));
    if (props.editing.new) {
      let team = props.editing.new;
      if (event === "OWN GOAL") {
        if (eventCreating === "home") {
          team = "away";
        } else if (eventCreating === "away") {
          team = "home";
        }
      }
      matchEvents.push({
        event: event,
        name: playerName,
        period: minute * 60 > 45 ? "SECOND HALF" : "FIRST HALF",
        player1SteamId: playerSteamId,
        player2SteamId: "",
        second: minute * 60,
        team: team
      });
    } else {
      matchEvents[index].event = event;
      matchEvents[index].name = playerName;
      matchEvents[index].player1SteamId = playerSteamId;
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

    props.changeEvents(matchEvents);
  }

  function onRemoveEvent(index) {
    let matchEvents = JSON.parse(JSON.stringify(props.data.matchevents));
    matchEvents.splice(index, 1);
    props.changeEvents(matchEvents);
  }

  function newItem(side) {
    return {
      event: "GOAL",
      name: "",
      period: "FIRST HALF",
      player1SteamId: "",
      player2SteamId: "",
      second:
        props.data.matchevents.length === 0
          ? 0
          : props.data.matchevents[props.data.matchevents.length - 1].second,
      team: side
    };
  }

  return (
    <div className="whitespace">
      {props.editing === "torneo" ? (
        <TorneoEditor
          torneo={props.data.torneo}
          onChangeTorneo={onChangeTorneo}
          setEditing={props.setEditing}
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
          onMouseOver={e => setTorneoHovering(true)}
          onMouseOut={e => setTorneoHovering(false)}
        >
          {props.editable ? <div style={{ flex: 1 }}></div> : null}
          <div
            style={{
              color: "var(--header-color)",
              fontSize: "10pt",
              marginLeft: "5px",
              marginRight: "5px"
            }}
          >
            {props.data.torneo}
          </div>
          {props.editable ? (
            <div style={{ flex: 1, opacity: torneoHovering ? "100%" : "0%" }}>
              <FontAwesomeIcon
                icon={faEdit}
                style={{
                  cursor: "pointer",
                  fontSize: "10pt",
                  color: "var(--normal-text-color)"
                }}
                onClick={e => {
                  setHomeTeamNameHovering(false);
                  setAwayTeamNameHovering(false);
                  setDateHovering(false);
                  setScoreHovering(false);
                  setTorneoHovering(false);
                  props.setEditing("torneo");
                }}
              />
            </div>
          ) : null}
        </div>
      )}
      {props.editing && typeof props.editing.event !== "undefined" ? (
        <MatchEventEditor
          item={
            props.editing.new
              ? newItem(props.editing.new)
              : props.data.matchevents[props.editing.event]
          }
          index={
            props.editing.new
              ? props.data.matchevents.length
              : props.editing.event
          }
          players={props.players}
          onChangeEvent={onChangeEvent}
          editing={props.editing}
          setEditing={props.setEditing}
        />
      ) : null}
      <table className="resulttable">
        <tbody>
          <tr>
            <td>
              {props.editing === "homeTeamName" ? (
                <TeamNameEditor
                  teams={props.data.teams}
                  side="home"
                  onChangeTeam={onChangeTeam}
                  setEditing={props.setEditing}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onMouseOver={e => setHomeTeamNameHovering(true)}
                  onMouseOut={e => setHomeTeamNameHovering(false)}
                >
                  {props.editable ? <div style={{ flex: 1 }}></div> : null}
                  <div style={{ marginLeft: "5px", marginRight: "5px" }}>
                    <h2>
                      <div id="teamname">{props.data.teams[0].teamname}</div>
                      <div id="shortname">
                        {getTeamShortname(props.data.teams[0].teamname)}
                      </div>
                    </h2>
                  </div>
                  {props.editable ? (
                    <div
                      style={{
                        flex: 1,
                        textAlign: "left",
                        opacity: homeTeamNameHovering ? "100%" : "0%"
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
                          setHomeTeamNameHovering(false);
                          setDateHovering(false);
                          setScoreHovering(false);
                          setTorneoHovering(false);
                          props.setEditing("homeTeamName");
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </td>
            <td>
              {props.editing === "date" ? (
                <DateTimeEditor
                  date={props.data.fecha}
                  onChangeDate={onChangeDate}
                  setEditing={props.setEditing}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onMouseOver={e => setDateHovering(true)}
                  onMouseOut={e => setDateHovering(false)}
                >
                  {props.editable ? <div style={{ flex: 1 }}></div> : null}
                  <div
                    style={{
                      marginLeft: "5px",
                      marginRight: "5px",
                      color: "var(--header-color)"
                    }}
                  >
                    {fecha(props.data.fecha)}
                  </div>
                  {props.editable ? (
                    <div
                      style={{
                        flex: 1,
                        textAlign: "left",
                        opacity: dateHovering ? "100%" : "0%"
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{
                          cursor: "pointer",
                          color: "var(--normal-text-color)"
                        }}
                        onClick={e => {
                          props.setEditing("date");
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </td>
            <td>
              {props.editing === "awayTeamName" ? (
                <TeamNameEditor
                  teams={props.data.teams}
                  side="away"
                  onChangeTeam={onChangeTeam}
                  setEditing={props.setEditing}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onMouseOver={e => setAwayTeamNameHovering(true)}
                  onMouseOut={e => setAwayTeamNameHovering(false)}
                >
                  {props.editable ? <div style={{ flex: 1 }}></div> : null}
                  <div style={{ marginLeft: "5px", marginRight: "5px" }}>
                    <h2>
                      <div id="teamname">{props.data.teams[1].teamname}</div>
                      <div id="shortname">
                        {getTeamShortname(props.data.teams[1].teamname)}
                      </div>
                    </h2>
                  </div>
                  {props.editable ? (
                    <div
                      style={{
                        flex: 1,
                        textAlign: "left",
                        opacity: awayTeamNameHovering ? "100%" : "0%"
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
                          setHomeTeamNameHovering(false);
                          setDateHovering(false);
                          setScoreHovering(false);
                          setTorneoHovering(false);
                          props.setEditing("awayTeamName");
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
              <img
                className="bigClubLogo"
                alt={props.data.teams[0].teamname}
                src={getTeamLogo(props.data.teams[0].teamname)}
              ></img>
            </td>
            <td>
              {props.editing === "score" ? (
                <ScoreEditor
                  home={props.data.teams[0].score}
                  away={props.data.teams[1].score}
                  onChangeScore={onChangeScore}
                  setEditing={props.setEditing}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onMouseOver={e => setScoreHovering(true)}
                  onMouseOut={e => setScoreHovering(false)}
                >
                  {props.editable ? <div style={{ flex: 1 }}></div> : null}
                  <div style={{ marginLeft: "5px", marginRight: "5px" }}>
                    <h2 id="result">
                      {props.data.teams[0].score} - {props.data.teams[1].score}
                    </h2>
                  </div>
                  {props.editable ? (
                    <div
                      style={{
                        flex: 1,
                        textAlign: "left",
                        opacity: scoreHovering ? "100%" : "0%"
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
                          setDateHovering(false);
                          setTorneoHovering(false);
                          setHomeTeamNameHovering(false);
                          setAwayTeamNameHovering(false);
                          props.setEditing("score");
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </td>
            <td>
              <img
                className="bigClubLogo"
                alt={props.data.teams[1].teamname}
                src={getTeamLogo(props.data.teams[1].teamname)}
              ></img>
            </td>
          </tr>
          <tr id="eventslist">
            <td>
              <ul style={{ listStyleType: "none", paddingInlineStart: "0px" }}>
                {props.data.matchevents.map((item, index) => (
                  <MatchEvent
                    item={item}
                    key={index}
                    side="home"
                    index={index}
                    editable={props.editable}
                    onRemoveEvent={onRemoveEvent}
                    setScoreHovering={setScoreHovering}
                    setEditing={props.setEditing}
                  />
                ))}
                {props.editable ? (
                  <li>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ cursor: "pointer" }}
                      onClick={e => {
                        onAddEvent("home");
                        setScoreHovering(false);
                        setHomeTeamNameHovering(false);
                        setAwayTeamNameHovering(false);
                        setDateHovering(false);
                        setTorneoHovering(false);
                      }}
                    />
                  </li>
                ) : null}
              </ul>
            </td>
            <td>
              {props.editable ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: "10px"
                  }}
                >
                  {props.create && (
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
                        zIndex: "20"
                      }}
                      onDragEnter={e => setDragging(true)}
                      onDragLeave={e => setDragging(false)}
                      onDrop={ev => {
                        setDragging(false);
                        props.dropFile(ev);
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
                    disabled={props.loading}
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
                    disabled={props.loading}
                    onClick={e => {
                      props.updateMatch(
                        document.getElementById("password").value
                      );
                    }}
                  >
                    {props.create ? "Subir partido" : "Guardar cambios"}
                  </button>
                  {!props.create && (
                    <button
                      className="boton"
                      disabled={props.loading}
                      onClick={e => {
                        props.deleteMatch(
                          document.getElementById("password").value
                        );
                      }}
                    >
                      Eliminar partido
                    </button>
                  )}
                  <button
                    className="boton"
                    disabled={props.loading}
                    onClick={e => props.exportMatch()}
                  >
                    Exportar JSON
                  </button>
                  {!props.create && (
                    <button
                      className="boton"
                      disabled={props.loading}
                      onClick={e => {
                        props.restartEditing();
                        props.setEditing(null);
                        setScoreHovering(false);
                        setDateHovering(false);
                        setHomeTeamNameHovering(false);
                        setAwayTeamNameHovering(false);
                        setTorneoHovering(false);
                      }}
                    >
                      Reiniciar edición
                    </button>
                  )}
                  <button
                    className="boton"
                    onClick={e => props.undo()}
                    disabled={props.disableUndo}
                  >
                    Deshacer
                  </button>
                  {props.loading ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      color="#ff9800"
                      size="lg"
                    />
                  ) : null}
                </div>
              ) : null}
            </td>
            <td>
              <ul style={{ listStyleType: "none", paddingInlineStart: "0px" }}>
                {props.data.matchevents.map((item, index) => (
                  <MatchEvent
                    item={item}
                    key={index}
                    side="away"
                    index={index}
                    editable={props.editable}
                    onRemoveEvent={onRemoveEvent}
                    setScoreHovering={setScoreHovering}
                    setEditing={props.setEditing}
                  />
                ))}
                {props.editable ? (
                  <li>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ cursor: "pointer" }}
                      onClick={e => {
                        onAddEvent("away");
                        setScoreHovering(false);
                        setHomeTeamNameHovering(false);
                        setAwayTeamNameHovering(false);
                        setDateHovering(false);
                        setTorneoHovering(false);
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
