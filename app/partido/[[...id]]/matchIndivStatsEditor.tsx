import { useState } from "react";
import AutocompletePlayers from "./autocompletePlayers";
import { percentage, invPercentage } from "../../../utils/Utils";
import AutocompleteSteamIDs from "./autocompleteSteamIDs";
import Button from "../../../components/ui/button";
import Title from "../../../components/ui/title";

function parseValue(id, target) {
  let v = (document.getElementById(id) as HTMLInputElement).value;
  if (v.startsWith("+")) {
    let actualValue = parseInt(v.replace("+", ""));
    if (id === "passescompleted") {
      let passes;
      if (
        (
          document.getElementById("passes") as HTMLInputElement
        ).value.startsWith("+")
      ) {
        passes =
          target +
          parseInt(
            (
              document.getElementById("passes") as HTMLInputElement
            ).value.replace("+", "")
          );
      } else if (
        (
          document.getElementById("passes") as HTMLInputElement
        ).value.startsWith("-")
      ) {
        passes =
          target -
          parseInt(
            (
              document.getElementById("passes") as HTMLInputElement
            ).value.replace("-", "")
          );
      } else {
        passes = parseInt(
          (document.getElementById("passes") as HTMLInputElement).value
        );
      }
      return Math.round((target + invPercentage(actualValue, passes)) / 2);
    } else if (id === "possession") {
      return Math.round((target + actualValue) / 2);
    } else if (id === "savescaught") {
      let saves;
      if (
        (document.getElementById("saves") as HTMLInputElement).value.startsWith(
          "+"
        )
      ) {
        saves =
          target +
          parseInt(
            (
              document.getElementById("saves") as HTMLInputElement
            ).value.replace("+", "")
          );
      } else if (
        (document.getElementById("saves") as HTMLInputElement).value.startsWith(
          "-"
        )
      ) {
        saves =
          target -
          parseInt(
            (
              document.getElementById("saves") as HTMLInputElement
            ).value.replace("-", "")
          );
      } else {
        saves = parseInt(
          (document.getElementById("saves") as HTMLInputElement).value
        );
      }
      return Math.round((target + invPercentage(actualValue, saves)) / 2);
    } else if (id === "shotsontarget") {
      let shots;
      if (
        (document.getElementById("shots") as HTMLInputElement).value.startsWith(
          "+"
        )
      ) {
        shots =
          target +
          parseInt(
            (
              document.getElementById("shots") as HTMLInputElement
            ).value.replace("+", "")
          );
      } else if (
        (document.getElementById("shots") as HTMLInputElement).value.startsWith(
          "-"
        )
      ) {
        shots =
          target -
          parseInt(
            (
              document.getElementById("shots") as HTMLInputElement
            ).value.replace("-", "")
          );
      } else {
        shots = parseInt(
          (document.getElementById("shots") as HTMLInputElement).value
        );
      }
      return Math.round((target + invPercentage(actualValue, shots)) / 2);
    } else if (id === "tacklescompleted") {
      let tackles;
      if (
        (
          document.getElementById("tackles") as HTMLInputElement
        ).value.startsWith("+")
      ) {
        tackles =
          target +
          parseInt(
            (
              document.getElementById("tackles") as HTMLInputElement
            ).value.replace("+", "")
          );
      } else if (
        (
          document.getElementById("tackles") as HTMLInputElement
        ).value.startsWith("-")
      ) {
        tackles =
          target -
          parseInt(
            (
              document.getElementById("tackles") as HTMLInputElement
            ).value.replace("-", "")
          );
      } else {
        tackles = parseInt(
          (document.getElementById("tackles") as HTMLInputElement).value
        );
      }
      return Math.round((target + invPercentage(actualValue, tackles)) / 2);
    } else {
      return target + actualValue;
    }
  } else if (v.startsWith("-")) {
    let actualValue = parseInt(v.replace("-", ""));
    return target - actualValue;
  } else {
    let actualValue = parseInt(v);
    if (id === "passescompleted") {
      let passes;
      if (
        (
          document.getElementById("passes") as HTMLInputElement
        ).value.startsWith("+")
      ) {
        passes =
          target +
          parseInt(
            (
              document.getElementById("passes") as HTMLInputElement
            ).value.replace("+", "")
          );
      } else if (
        (
          document.getElementById("passes") as HTMLInputElement
        ).value.startsWith("-")
      ) {
        passes =
          target -
          parseInt(
            (
              document.getElementById("passes") as HTMLInputElement
            ).value.replace("-", "")
          );
      } else {
        passes = parseInt(
          (document.getElementById("passes") as HTMLInputElement).value
        );
      }
      return Math.round(invPercentage(actualValue, passes));
    } else if (id === "savescaught") {
      let saves;
      if (
        (document.getElementById("saves") as HTMLInputElement).value.startsWith(
          "+"
        )
      ) {
        saves =
          target +
          parseInt(
            (
              document.getElementById("saves") as HTMLInputElement
            ).value.replace("+", "")
          );
      } else if (
        (document.getElementById("saves") as HTMLInputElement).value.startsWith(
          "-"
        )
      ) {
        saves =
          target -
          parseInt(
            (
              document.getElementById("saves") as HTMLInputElement
            ).value.replace("-", "")
          );
      } else {
        saves = parseInt(
          (document.getElementById("saves") as HTMLInputElement).value
        );
      }
      return Math.round(invPercentage(actualValue, saves));
    } else if (id === "shotsontarget") {
      let shots;
      if (
        (document.getElementById("shots") as HTMLInputElement).value.startsWith(
          "+"
        )
      ) {
        shots =
          target +
          parseInt(
            (
              document.getElementById("shots") as HTMLInputElement
            ).value.replace("+", "")
          );
      } else if (
        (document.getElementById("shots") as HTMLInputElement).value.startsWith(
          "-"
        )
      ) {
        shots =
          target -
          parseInt(
            (
              document.getElementById("shots") as HTMLInputElement
            ).value.replace("-", "")
          );
      } else {
        shots = parseInt(
          (document.getElementById("shots") as HTMLInputElement).value
        );
      }
      return Math.round(invPercentage(actualValue, shots));
    } else if (id === "tacklescompleted") {
      let tackles;
      if (
        (
          document.getElementById("tackles") as HTMLInputElement
        ).value.startsWith("+")
      ) {
        tackles =
          target +
          parseInt(
            (
              document.getElementById("tackles") as HTMLInputElement
            ).value.replace("+", "")
          );
      } else if (
        (
          document.getElementById("tackles") as HTMLInputElement
        ).value.startsWith("-")
      ) {
        tackles =
          target -
          parseInt(
            (
              document.getElementById("tackles") as HTMLInputElement
            ).value.replace("-", "")
          );
      } else {
        tackles = parseInt(
          (document.getElementById("tackles") as HTMLInputElement).value
        );
      }
      return Math.round(invPercentage(actualValue, tackles));
    } else {
      return actualValue;
    }
  }
}

export default function MatchIndivStatsEditor(props) {
  const [playerName, setPlayerName] = useState(props.player.info.name);
  const [playerSteamId, setPlayerSteamId] = useState(
    props.player.info.steam_id
  );

  const changeSteamIdField = value => {
    setPlayerSteamId(value);
  };

  const changePlayerField = value => {
    setPlayerName(value);
  };

  const positions = [
    "GK",
    "LB",
    "RB",
    "CB",
    "LM",
    "RM",
    "CM",
    "CF",
    "LW",
    "RW"
  ];

  const editableFields = [
    {
      label: "Tiros",
      id: "shots",
      defaultValue: props.player.statistics.shots
    },
    {
      label: "Tiros (al arco)",
      id: "shotsontarget",
      maxLength: 4,
      defaultValue: percentage(
        props.player.statistics.shotsontarget,
        props.player.statistics.shots
      ),
      extra: " %"
    },
    {
      label: "Pases",
      id: "passes",
      defaultValue: props.player.statistics.passes
    },
    {
      label: "Pases completados",
      id: "passescompleted",
      maxLength: 4,
      defaultValue: percentage(
        props.player.statistics.passescompleted,
        props.player.statistics.passes
      ),
      extra: " %"
    },
    {
      label: "Pases clave",
      id: "keypasses",
      defaultValue: props.player.statistics.keypasses
    },
    {
      label: "Intercepciones",
      id: "interceptions",
      defaultValue: props.player.statistics.interceptions
    },
    {
      label: "Atajadas",
      id: "saves",
      defaultValue: props.player.statistics.saves
    },
    {
      label: "Atajadas (sin rebote)",
      id: "savescaught",
      maxLength: 4,
      defaultValue: percentage(
        props.player.statistics.savescaught,
        props.player.statistics.saves
      ),
      extra: " %"
    },
    {
      label: "Faltas",
      id: "fouls",
      defaultValue: props.player.statistics.fouls
    },
    {
      label: "Offsides",
      id: "offsides",
      defaultValue: props.player.statistics.offsides
    },
    {
      label: "Distancia recorrida",
      id: "distancecovered",
      defaultValue: props.player.statistics.distancecovered,
      width: "8ch",
      extra: " m"
    },
    {
      label: "Posesión",
      id: "possession",
      defaultValue: props.player.statistics.possession,
      maxLength: 4,
      extra: " %"
    },
    {
      label: "Corners",
      id: "corners",
      defaultValue: props.player.statistics.corners
    },
    {
      label: "Laterales",
      id: "throwins",
      defaultValue: props.player.statistics.throwins
    },
    {
      label: "Penales",
      id: "penalties",
      defaultValue: props.player.statistics.penalties
    },
    {
      label: "Tiros libres",
      id: "freekicks",
      defaultValue: props.player.statistics.freekicks
    },
    {
      label: "Tackles",
      id: "tackles",
      defaultValue: props.player.statistics.tackles
    },
    {
      label: "Tackles completados",
      id: "tacklescompleted",
      maxLength: 4,
      defaultValue: percentage(
        props.player.statistics.tacklescompleted,
        props.player.statistics.tackles
      ),
      extra: " %"
    },
    {
      label: "Faltas sufridas",
      id: "foulssuffered",
      defaultValue: props.player.statistics.foulssuffered
    },
    {
      label: "Saques de arco",
      id: "goalkicks",
      defaultValue: props.player.statistics.goalkicks
    },
    {
      label: "Goles recibidos",
      id: "goalsconceded",
      defaultValue: props.player.statistics.goalsconceded
    }
  ];

  const staticFields = [
    {
      id: "positions",
      value: () =>
        props.player.statistics.positions.length === 0
          ? [
              {
                position: (document.getElementById("pos") as HTMLInputElement)
                  .value,
                seconds: 0
              }
            ]
          : props.player.statistics.positions
    },
    {
      id: "redcards",
      value: () => props.player.statistics.redcards
    },
    {
      id: "yellowcards",
      value: () => props.player.statistics.yellowcards
    },
    {
      id: "owngoals",
      value: () => props.player.statistics.owngoals
    },
    {
      id: "goals",
      value: () => props.player.statistics.goals
    },
    {
      id: "assists",
      value: () => props.player.statistics.assists
    },
    {
      id: "secondassists",
      value: () => props.player.statistics.secondassists
    },
    {
      id: "chancescreated",
      value: () =>
        props.player.statistics.assists +
        parseValue("keypasses", props.player.statistics.keypasses)
    },
    {
      id: "secondsplayed",
      value: () => props.player.statistics.secondsplayed
    }
  ];

  const inputSane = () => {
    let a = [];
    editableFields.forEach(e => a.push(parseValue(e.id, e.defaultValue)));
    for (let i in a) {
      if (isNaN(a[i])) {
        return false;
      }
    }
    return true;
  };

  const finishEditing = () => {
    if (!inputSane()) {
      alert(
        'Valor(es) inválido(s). Ingrese un número, prefijado por "+" o "-" si se desea sumar o restar, respectivamente.'
      );
    } else {
      if (playerName === "") {
        alert("El campo Nombre está vacío.");
      } else if (playerSteamId === "") {
        alert("El campo SteamID está vacío.");
      } else if (
        (document.getElementById("pos") as HTMLInputElement).value === ""
      ) {
        alert("No hay una posición definida.");
      } else {
        let player = {
          info: {
            name: playerName,
            steam_id: playerSteamId,
            team: props.player.info.team
          },
          statistics: {}
        };
        staticFields.forEach(e => (player.statistics[e.id] = e.value()));
        editableFields.forEach(
          e => (player.statistics[e.id] = parseValue(e.id, e.defaultValue))
        );
        props.onChangeIndivStats(player);
      }
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Title>{props.editing.new ? "Crear" : "Editar"} JUGADOR</Title>
      <Title>Información</Title>
      <div className="flex flex-wrap items-center gap-x-4">
        <div className="flex gap-x-2">
          <div>Nombre:</div>
          <div>
            <AutocompletePlayers
              defaultValue={props.player.info.name}
              defaultId={props.player.info.steam_id}
              players={props.players}
              onChangePlayer={{ setPlayerName, setPlayerSteamId }}
              changeSteamIdField={changeSteamIdField}
              value={playerName}
            />
          </div>
        </div>
        <div className="flex gap-x-2">
          <div>SteamID:</div>
          <div>
            <AutocompleteSteamIDs
              defaultValue={props.player.info.name}
              defaultId={props.player.info.steam_id}
              players={props.players}
              onChangePlayer={{ setPlayerName, setPlayerSteamId }}
              changePlayerField={changePlayerField}
              value={playerSteamId}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <div>Equipo:</div>
          <div>
            <input
              type="text"
              className="rounded-lg border border-neutral-300 px-1 dark:border-neutral-700"
              disabled
              defaultValue={props.team}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <div>Posición:</div>
          <div>
            <select
              className="rounded-lg border border-neutral-300 px-1 shadow-lg disabled:text-neutral-500 disabled:shadow-none dark:border-neutral-700 dark:disabled:text-neutral-400"
              id="pos"
              disabled={
                props.player.statistics.positions.length === 0 ? false : true
              }
              defaultValue={
                props.player.statistics.positions.length === 0
                  ? "GK"
                  : props.player.statistics.positions[0].position
              }
            >
              {positions.map((e, i) => (
                <option key={i} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Title>ESTADÍSTICAS</Title>
      <div className="flex flex-wrap gap-4">
        {editableFields.map((e, i) => (
          <div className="flex items-center gap-x-2" key={i}>
            <div>{e.label + ":"}</div>
            <div>
              <input
                id={e.id}
                className="rounded-lg border border-neutral-300 px-1 shadow-lg dark:border-neutral-700"
                type="text"
                defaultValue={e.defaultValue}
                style={{ width: e.width ? e.width : "4ch" }}
                maxLength={e.maxLength}
              />
              {e.extra}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm italic text-neutral-500 dark:text-neutral-400">
        Los goles, asistencias, segundas asistencias, tarjetas amarillas y rojas
        se editan desde la sección de eventos. Las ocasiones creadas se calculan
        combinando las asistencias y los pases clave.
      </p>
      <div className="flex gap-x-4">
        <Button onClick={finishEditing}>Guardar</Button>
        <Button
          onClick={_ => {
            props.setEditing(null);
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
