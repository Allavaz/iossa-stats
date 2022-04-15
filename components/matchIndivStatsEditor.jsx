import { useState } from "react";
import AutocompletePlayers from "./autocompletePlayers";
import { percentage, invPercentage } from "../utils/Utils";
import AutocompleteSteamIDs from "./autocompleteSteamIDs";

const itemStyle = {
  display: "flex",
  alignItems: "center"
};
const inputStyle = { marginLeft: "5px" };

function parseValue(id, target) {
  let v = document.getElementById(id).value;
  if (v.startsWith("+")) {
    let actualValue = parseInt(v.replace("+", ""));
    if (id === "passescompleted") {
      let passes;
      if (document.getElementById("passes").value.startsWith("+")) {
        passes =
          target +
          parseInt(document.getElementById("passes").value.replace("+", ""));
      } else if (document.getElementById("passes").value.startsWith("-")) {
        passes =
          target -
          parseInt(document.getElementById("passes").value.replace("-", ""));
      } else {
        passes = parseInt(document.getElementById("passes").value);
      }
      return Math.round(
        (target + invPercentage(parseInt(actualValue), passes)) / 2
      );
    } else if (id === "possession") {
      return Math.round((target + actualValue) / 2);
    } else if (id === "savescaught") {
      let saves;
      if (document.getElementById("saves").value.startsWith("+")) {
        saves =
          target +
          parseInt(document.getElementById("saves").value.replace("+", ""));
      } else if (document.getElementById("saves").value.startsWith("-")) {
        saves =
          target -
          parseInt(document.getElementById("saves").value.replace("-", ""));
      } else {
        saves = parseInt(document.getElementById("saves").value);
      }
      return Math.round(
        (target + invPercentage(parseInt(actualValue), saves)) / 2
      );
    } else if (id === "shotsontarget") {
      let shots;
      if (document.getElementById("shots").value.startsWith("+")) {
        shots =
          target +
          parseInt(document.getElementById("shots").value.replace("+", ""));
      } else if (document.getElementById("shots").value.startsWith("-")) {
        shots =
          target -
          parseInt(document.getElementById("shots").value.replace("-", ""));
      } else {
        shots = parseInt(document.getElementById("shots").value);
      }
      return Math.round(
        (target + invPercentage(parseInt(actualValue), shots)) / 2
      );
    } else if (id === "tacklescompleted") {
      let tackles;
      if (document.getElementById("tackles").value.startsWith("+")) {
        tackles =
          target +
          parseInt(document.getElementById("tackles").value.replace("+", ""));
      } else if (document.getElementById("tackles").value.startsWith("-")) {
        tackles =
          target -
          parseInt(document.getElementById("tackles").value.replace("-", ""));
      } else {
        tackles = parseInt(document.getElementById("tackles").value);
      }
      return Math.round(
        (target + invPercentage(parseInt(actualValue), tackles)) / 2
      );
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
      if (document.getElementById("passes").value.startsWith("+")) {
        passes =
          target +
          parseInt(document.getElementById("passes").value.replace("+", ""));
      } else if (document.getElementById("passes").value.startsWith("-")) {
        passes =
          target -
          parseInt(document.getElementById("passes").value.replace("-", ""));
      } else {
        passes = parseInt(document.getElementById("passes").value);
      }
      return Math.round(invPercentage(parseInt(actualValue), passes));
    } else if (id === "savescaught") {
      let saves;
      if (document.getElementById("saves").value.startsWith("+")) {
        saves =
          target +
          parseInt(document.getElementById("saves").value.replace("+", ""));
      } else if (document.getElementById("saves").value.startsWith("-")) {
        saves =
          target -
          parseInt(document.getElementById("saves").value.replace("-", ""));
      } else {
        saves = parseInt(document.getElementById("saves").value);
      }
      return Math.round(invPercentage(parseInt(actualValue), saves));
    } else if (id === "shotsontarget") {
      let shots;
      if (document.getElementById("shots").value.startsWith("+")) {
        shots =
          target +
          parseInt(document.getElementById("shots").value.replace("+", ""));
      } else if (document.getElementById("shots").value.startsWith("-")) {
        shots =
          target -
          parseInt(document.getElementById("shots").value.replace("-", ""));
      } else {
        shots = parseInt(document.getElementById("shots").value);
      }
      return Math.round(invPercentage(parseInt(actualValue), shots));
    } else if (id === "tacklescompleted") {
      let tackles;
      if (document.getElementById("tackles").value.startsWith("+")) {
        tackles =
          target +
          parseInt(document.getElementById("tackles").value.replace("+", ""));
      } else if (document.getElementById("tackles").value.startsWith("-")) {
        tackles =
          target -
          parseInt(document.getElementById("tackles").value.replace("-", ""));
      } else {
        tackles = parseInt(document.getElementById("tackles").value);
      }
      return Math.round(invPercentage(parseInt(actualValue), tackles));
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
  const statFields = [
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

  const inputSane = () => {
    let a = [];
    statFields.forEach(e => a.push(parseValue(e.id, e.defaultValue)));
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
      } else if (document.getElementById("pos").value === "") {
        alert("No hay una posición definida.");
      } else {
        let player = {
          info: {
            name: playerName,
            steam_id: playerSteamId,
            team: props.player.info.team
          },
          statistics: {
            positions:
              props.player.statistics.positions.length === 0
                ? [
                    {
                      position: document.getElementById("pos").value,
                      seconds: 0
                    }
                  ]
                : props.player.statistics.positions,
            redcards: props.player.statistics.redcards,
            yellowcards: props.player.statistics.yellowcards,
            owngoals: props.player.statistics.owngoals,
            goals: props.player.statistics.goals,
            assists: props.player.statistics.assists,
            secondassists: props.player.statistics.secondassists,
            chancescreated:
              props.player.statistics.assists +
              parseValue("keypasses", props.player.statistics.keypasses)
          }
        };
        statFields.forEach(
          e => (player.statistics[e.id] = parseValue(e.id, e.defaultValue))
        );
        props.onChangeIndivStats(player);
      }
    }
  };

  return (
    <div id="overlay">
      <div
        className="whitespace"
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "780px",
          padding: "20px",
          margin: "auto"
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          {props.editing.new ? "CREAR" : "EDITAR"} JUGADOR
        </h3>
        <h3 style={{ marginTop: 0 }}>INFORMACIÓN</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            rowGap: "15px",
            columnGap: "15px"
          }}
        >
          <div style={itemStyle}>
            <div>Nombre:</div>
            <div style={inputStyle}>
              <AutocompletePlayers
                defaultValue={props.player.info.name}
                defaultId={props.player.info.steam_id}
                players={props.players}
                onChangePlayer={{ setPlayerName, setPlayerSteamId }}
                changeSteamIdField={changeSteamIdField}
                value={playerName}
              ></AutocompletePlayers>
            </div>
          </div>
          <div style={itemStyle}>
            <div>SteamID:</div>
            <div style={inputStyle}>
              <AutocompleteSteamIDs
                defaultValue={props.player.info.name}
                defaultId={props.player.info.steam_id}
                players={props.players}
                onChangePlayer={{ setPlayerName, setPlayerSteamId }}
                changePlayerField={changePlayerField}
                value={playerSteamId}
              ></AutocompleteSteamIDs>
            </div>
          </div>
          <div style={itemStyle}>
            <div>Equipo:</div>
            <div style={inputStyle}>
              <input
                type="text"
                disabled
                defaultValue={props.team}
                style={{ width: "25ch" }}
              />
            </div>
          </div>
          <div style={itemStyle}>
            <div>Posición:</div>
            <div style={inputStyle}>
              <select
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
                  <option key={i} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <h3>ESTADÍSTICAS</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            rowGap: "15px",
            columnGap: "15px"
          }}
        >
          {statFields.map((e, i) => (
            <div key={i} style={itemStyle}>
              <div>{e.label + ":"}</div>
              <div style={inputStyle}>
                <input
                  id={e.id}
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
        <p
          style={{
            fontSize: "0.85em",
            color: "var(--header-color)",
            lineHeight: "20px"
          }}
        >
          <i>
            Los goles, asistencias, segundas asistencias, tarjetas amarillas y
            rojas se editan desde la sección de eventos. Las ocasiones creadas
            se calculan combinando las asistencias y los pases clave.
          </i>
        </p>
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
          <button
            className="boton"
            onClick={e => {
              props.setEditing(null);
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
