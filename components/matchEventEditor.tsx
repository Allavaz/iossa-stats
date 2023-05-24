import { useState } from "react";
import AutocompletePlayers from "./autocompletePlayers";
import AutocompleteSteamIDs from "./autocompleteSteamIDs";
import Button from "./commons/button";
import Title from "./commons/title";

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
    let selectEventValue = (
      document.getElementById("selectEvent" + props.index) as HTMLInputElement
    ).value;
    let selectMinuteValue = (
      document.getElementById("selectMinute" + props.index) as HTMLInputElement
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
    <div className="flex flex-col gap-y-4">
      <Title>{props.editing.new ? "Crear" : "Editar"} Evento</Title>
      <div className="flex items-center gap-x-4">
        <select
          className="w-32 rounded-lg border border-neutral-300 shadow-lg dark:border-neutral-700"
          id={"selectEvent" + props.index}
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
            className="w-14 rounded border border-neutral-300 shadow-lg dark:border-neutral-700"
            id={"selectMinute" + props.index}
            type="number"
            defaultValue={Math.round(props.item.second / 60)}
            min="0"
          />
          {"')"}
        </div>
      </div>
      {eventType === "GOAL" && (
        <>
          <div className="flex items-center gap-x-4">
            <div className="w-32 text-center text-sm italic text-neutral-500 dark:text-neutral-400">
              Asistencia
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
          </div>
          <div className="flex items-center gap-x-4">
            <div className="w-32 text-center text-sm italic text-neutral-500 dark:text-neutral-400">
              2da Asistencia
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
          </div>
        </>
      )}
      <div className="flex justify-end gap-x-2">
        <Button onClick={finishEditing}>Guardar</Button>
        <Button onClick={cancelEditing}>Cancelar</Button>
      </div>
    </div>
  );
}
