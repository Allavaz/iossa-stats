import { useState } from "react";
import Button from "../../../components/ui/button";
import Title from "../../../components/ui/title";

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
  const [minute, setMinute] = useState(Math.round(props.item.second / 60));

  const buildOptions = matchPlayers =>
    matchPlayers.map(p => ({
      _id: p.info.steam_id,
      name: p.info.name,
      team: p.info.team
    }));

  const player1Players = buildOptions(
    eventType === "OWN GOAL"
      ? props.side === "home"
        ? props.awayPlayers
        : props.homePlayers
      : props.side === "home"
      ? props.homePlayers
      : props.awayPlayers
  );
  const assistPlayers = buildOptions(
    props.side === "home" ? props.homePlayers : props.awayPlayers
  );

  const finishEditing = e => {
    e.preventDefault();
    props.onChangeEvent(
      eventType,
      playerName.trim(),
      playerSteamId.trim(),
      playerName2.trim(),
      playerSteamId2.trim(),
      playerName3.trim(),
      playerSteamId3.trim(),
      minute,
      props.index
    );
    props.setEditing(null);
  };

  const cancelEditing = () => {
    props.setEditing(null);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Title>
        {props.editing.new ? "Crear" : "Editar"} Evento - {props.teamName}
      </Title>
      <form className="flex flex-col gap-y-4" onSubmit={finishEditing}>
        <div className="flex items-center gap-x-4">
          <select
            className="w-32 rounded-lg border border-neutral-300 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            value={eventType}
            onChange={e => setEventType(e.target.value)}
          >
            <option value="GOAL">Gol</option>
            <option value="OWN GOAL">Gol en contra</option>
            <option value="YELLOW CARD">Amarilla</option>
            <option value="RED CARD">Roja</option>
          </select>
          {playerSelector(
            playerSteamId || props.item.player1SteamId,
            setPlayerSteamId,
            setPlayerName,
            player1Players,
            true
          )}
          <div className="whitespace-nowrap">
            {"("}
            <input
              className="w-14 rounded border border-neutral-300 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
              type="number"
              value={minute}
              min="1"
              onChange={e => setMinute(Number(e.target.value))}
            />
            {"')"}
          </div>
        </div>
        {eventType === "GOAL" && (
          <>
            <div className="flex items-center gap-x-4">
              <div className="w-32 text-center text-sm italic text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                Asistencia
              </div>
              {playerSelector(
                playerSteamId2,
                setPlayerSteamId2,
                setPlayerName2,
                assistPlayers
              )}
            </div>
            <div className="flex items-center gap-x-4">
              <div className="w-32 text-center text-sm italic text-neutral-500 dark:text-neutral-400">
                2da Asistencia
              </div>
              {playerSelector(
                playerSteamId3,
                setPlayerSteamId3,
                setPlayerName3,
                assistPlayers
              )}
            </div>
          </>
        )}
        <div className="flex justify-end gap-x-2">
          <Button type="submit">Guardar</Button>
          <Button type="button" onClick={cancelEditing}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

function playerSelector(
  playerSteamId,
  setPlayerSteamId,
  setPlayerName,
  players,
  required = false
) {
  return (
    <div className="flex items-center gap-x-4">
      <select
        required={required}
        className="rounded-lg border border-neutral-300 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        onChange={e => {
          setPlayerSteamId(e.target.value);
          const selectedPlayer = players.find(p => p._id === e.target.value);
          if (selectedPlayer) {
            setPlayerName(selectedPlayer.name);
          }
        }}
        value={playerSteamId}
      >
        <option hidden={required} value="">
          -
        </option>
        {players.map(player => (
          <option key={player._id} value={player._id}>
            {player.name}
          </option>
        ))}
      </select>
    </div>
  );
}
