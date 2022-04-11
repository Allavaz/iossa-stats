import { useState } from "react";
import AutocompletePlayers from "./autocompletePlayers";
import AutocompleteSteamIDs from "./autocompleteSteamIDs";

export default function MatchEventEditor(props) {
  const [playerName, setPlayerName] = useState(props.item.name);
  const [playerSteamId, setPlayerSteamId] = useState(props.item.player1SteamId);
  const [playerName2, setPlayerName2] = useState(props.item.name2 || "");
  const [playerSteamId2, setPlayerSteamId2] = useState(
    props.item.player2SteamId || ""
  );
  const [playerName3, setPlayerName3] = useState(props.item.name3 || "");
  const [playerSteamId3, setPlayerSteamId3] = useState(
    props.item.player3SteamId || ""
  );
  const [eventType, setEventType] = useState(props.item.event);

  const finishEditing = () => {
    let selectEventValue = document.getElementById(
      "selectEvent" + props.index
    ).value;
    let selectMinuteValue = document.getElementById(
      "selectMinute" + props.index
    ).value;
    if (playerName.trim() === "" || playerSteamId.trim() === "") {
      alert("Faltan datos");
    } else {
      props.onChangeEvent(
        selectEventValue,
        playerName.trim(),
        playerSteamId.trim(),
        playerName2.trim(),
        playerSteamId2.trim(),
        playerName3.trim(),
        playerSteamId3.trim(),
        selectMinuteValue,
        props.index
      );
      props.setEditing(null);
    }
  };

  const cancelEditing = () => {
    props.setEditing(null);
  };

  const changeSteamIdField = steamid => {
    setPlayerSteamId(steamid);
  };

  const changePlayerField = name => {
    setPlayerName(name);
  };

  const changeSteamIdField2 = steamid => {
    setPlayerSteamId2(steamid);
  };

  const changePlayerField2 = name => {
    setPlayerName2(name);
  };

  const changeSteamIdField3 = steamid => {
    setPlayerSteamId3(steamid);
  };

  const changePlayerField3 = name => {
    setPlayerName3(name);
  };

  return (
    <div id="overlay">
      <div
        className="whitespace"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px",
          top: "440px",
          margin: "auto"
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {props.editing.new ? "CREAR" : "EDITAR"} EVENTO
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "var(--normal-text-color)",
            flexWrap: "wrap",
            justifyContent: "center",
            rowGap: "10px",
            columnGap: "10px"
          }}
        >
          <select
            id={"selectEvent" + props.index}
            style={{ width: "15ch", padding: "2px" }}
            defaultValue={props.item.event}
            onChange={e => setEventType(e.target.value)}
          >
            <option value="GOAL">Gol</option>
            <option value="OWN GOAL">Gol en contra</option>
            <option value="YELLOW CARD">Amarilla</option>
            <option value="RED CARD">Roja</option>
          </select>
          <AutocompletePlayers
            defaultValue={props.item.name}
            defaultId={props.item.player1SteamId}
            players={props.players}
            index={props.index}
            onChangePlayer={{ setPlayerName, setPlayerSteamId }}
            changeSteamIdField={changeSteamIdField}
            value={playerName}
          />
          <AutocompleteSteamIDs
            defaultValue={props.item.name}
            defaultId={props.item.player1SteamId}
            players={props.players}
            index={props.index}
            onChangePlayer={{ setPlayerName, setPlayerSteamId }}
            changePlayerField={changePlayerField}
            value={playerSteamId}
          />
          <div>
            {"("}
            <input
              id={"selectMinute" + props.index}
              type="number"
              defaultValue={Math.round(props.item.second / 60)}
              style={{
                width: "5ch",
                height: "16px"
              }}
              min="0"
            ></input>
            {"')"}
          </div>
        </div>
        {eventType === "GOAL" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "var(--normal-text-color)",
                flexWrap: "wrap",
                justifyContent: "center",
                rowGap: "10px",
                columnGap: "10px",
                marginTop: "10px"
              }}
            >
              <div
                style={{
                  width: "15ch",
                  textAlign: "center",
                  fontSize: "0.85em",
                  color: "var(--header-color)"
                }}
              >
                <i>Asistencia</i>
              </div>
              <AutocompletePlayers
                defaultValue={props.item.name2 || ""}
                defaultId={props.item.player2SteamId || ""}
                players={props.players}
                index={props.index}
                onChangePlayer={{
                  setPlayerName: setPlayerName2,
                  setPlayerSteamId: setPlayerSteamId2
                }}
                changeSteamIdField={changeSteamIdField2}
                value={playerName2}
              />
              <AutocompleteSteamIDs
                defaultValue={props.item.name2 || ""}
                defaultId={props.item.player2SteamId || ""}
                players={props.players}
                index={props.index}
                onChangePlayer={{
                  setPlayerName: setPlayerName2,
                  setPlayerSteamId: setPlayerSteamId2
                }}
                changePlayerField={changePlayerField2}
                value={playerSteamId2}
              />
              <div style={{ width: "60px" }} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "var(--normal-text-color)",
                flexWrap: "wrap",
                justifyContent: "center",
                rowGap: "10px",
                columnGap: "10px",
                marginTop: "10px"
              }}
            >
              <div
                style={{
                  width: "15ch",
                  textAlign: "center",
                  fontSize: "0.85em",
                  color: "var(--header-color)"
                }}
              >
                <i>2da Asistencia</i>
              </div>
              <AutocompletePlayers
                defaultValue={props.item.name3 || ""}
                defaultId={props.item.player3SteamId || ""}
                players={props.players}
                index={props.index}
                onChangePlayer={{
                  setPlayerName: setPlayerName3,
                  setPlayerSteamId: setPlayerSteamId3
                }}
                changeSteamIdField={changeSteamIdField3}
                value={playerName3}
              />
              <AutocompleteSteamIDs
                defaultValue={props.item.name3 || ""}
                defaultId={props.item.player3SteamId || ""}
                players={props.players}
                index={props.index}
                onChangePlayer={{
                  setPlayerName: setPlayerName3,
                  setPlayerSteamId: setPlayerSteamId3
                }}
                changePlayerField={changePlayerField3}
                value={playerSteamId3}
              />
              <div style={{ width: "60px" }} />
            </div>
          </>
        )}
        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "flex-end",
            columnGap: "10px"
          }}
        >
          <button className="boton" onClick={finishEditing}>
            Guardar
          </button>
          <button className="boton" onClick={cancelEditing}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
