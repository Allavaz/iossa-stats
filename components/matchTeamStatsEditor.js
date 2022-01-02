import { getTeamLogo, invPercentage, percentage } from "../utils/Utils";

function evenUpPos(value, side) {
  if (side === "home") {
    if (value.startsWith("+")) {
      document.getElementById("possession1").value =
        "+" +
        (100 -
          parseInt(document.getElementById("possession0").value.replace("+", "")));
    } else {
      document.getElementById("possession1").value = 100 - value;
    }
  } else if (side === "away") {
    if (value.startsWith("+")) {
      document.getElementById("possession0").value =
        "+" +
        (100 -
          parseInt(document.getElementById("possession1").value.replace("+", "")));
    } else {
      document.getElementById("possession0").value = 100 - value;
    }
  }
}

function parseValue(id, target) {
  let v = document.getElementById(id).value;
  if (v.startsWith("+")) {
    let actualValue = parseInt(v.replace("+", ""));
    if (id === "shotsontarget0") {
      let shots0;
      if (document.getElementById("shots0").value.startsWith("+")) {
        shots0 =
          target +
          parseInt(document.getElementById("shots0").value.replace("+", ""));
      } else if (document.getElementById("shots0").value.startsWith("-")) {
        shots0 =
          target -
          parseInt(document.getElementById("shots0").value.replace("-", ""));
      } else {
        shots0 = parseInt(document.getElementById("shots0").value);
      }
      return Math.round(
        (target + invPercentage(parseInt(actualValue), shots0)) / 2
      );
    } else if (id === "shotsontarget1") {
      let shots1;
      if (document.getElementById("shots1").value.startsWith("+")) {
        shots1 =
          target +
          parseInt(document.getElementById("shots1").value.replace("+", ""));
      } else if (document.getElementById("shots1").value.startsWith("-")) {
        shots1 =
          target -
          parseInt(document.getElementById("shots1").value.replace("-", ""));
      } else {
        shots1 = parseInt(document.getElementById("shots1").value);
      }
      return Math.round(
        (target + invPercentage(parseInt(actualValue), shots1)) / 2
      );
    } else if (id === "possession0" || id === "possession1") {
      return Math.round((target + actualValue) / 2);
    } else if (id === "passescompleted0") {
      let passes0;
      if (document.getElementById("passes0").value.startsWith("+")) {
        passes0 =
          target +
          parseInt(document.getElementById("passes0").value.replace("+", ""));
      } else if (document.getElementById("passes0").value.startsWith("-")) {
        passes0 =
          target -
          parseInt(document.getElementById("passes0").value.replace("-", ""));
      } else {
        passes0 = parseInt(document.getElementById("passes0").value);
      }
      return Math.round(
        (target + invPercentage(parseInt(actualValue), passes0)) / 2
      );
    } else if (id === "passescompleted1") {
      let passes1;
      if (document.getElementById("passes1").value.startsWith("+")) {
        passes1 =
          target +
          parseInt(document.getElementById("passes1").value.replace("+", ""));
      } else if (document.getElementById("passes1").value.startsWith("-")) {
        passes1 =
          target -
          parseInt(document.getElementById("passes1").value.replace("-", ""));
      } else {
        passes1 = parseInt(document.getElementById("passes1").value);
      }
      return Math.round(
        (target + invPercentage(parseInt(actualValue), passes1)) / 2
      );
    } else {
      return target + actualValue;
    }
  } else if (v.startsWith("-")) {
    let actualValue = parseInt(v.replace("-", ""));
    return target - actualValue;
  } else {
    let actualValue = parseInt(v);
    if (id === "shotsontarget0") {
      let shots0;
      if (document.getElementById("shots0").value.startsWith("+")) {
        shots0 =
          target +
          parseInt(document.getElementById("shots0").value.replace("+", ""));
      } else if (document.getElementById("shots0").value.startsWith("-")) {
        shots0 =
          target -
          parseInt(document.getElementById("shots0").value.replace("-", ""));
      } else {
        shots0 = parseInt(document.getElementById("shots0").value);
      }
      return Math.round(invPercentage(parseInt(actualValue), shots0));
    } else if (id === "shotsontarget1") {
      let shots1;
      if (document.getElementById("shots1").value.startsWith("+")) {
        shots1 =
          target +
          parseInt(document.getElementById("shots1").value.replace("+", ""));
      } else if (document.getElementById("shots1").value.startsWith("-")) {
        shots1 =
          target -
          parseInt(document.getElementById("shots1").value.replace("-", ""));
      } else {
        shots1 = parseInt(document.getElementById("shots1").value);
      }
      return Math.round(invPercentage(parseInt(actualValue), shots1));
    } else if (id === "passescompleted0") {
      let passes0;
      if (document.getElementById("passes0").value.startsWith("+")) {
        passes0 =
          target +
          parseInt(document.getElementById("passes0").value.replace("+", ""));
      } else if (document.getElementById("passes0").value.startsWith("-")) {
        passes0 =
          target -
          parseInt(document.getElementById("passes0").value.replace("-", ""));
      } else {
        passes0 = parseInt(document.getElementById("passes0").value);
      }
      return Math.round(invPercentage(parseInt(actualValue), passes0));
    } else if (id === "passescompleted1") {
      let passes1;
      if (document.getElementById("passes1").value.startsWith("+")) {
        passes1 =
          target +
          parseInt(document.getElementById("passes1").value.replace("+", ""));
      } else if (document.getElementById("passes1").value.startsWith("-")) {
        passes1 =
          target -
          parseInt(document.getElementById("passes1").value.replace("-", ""));
      } else {
        passes1 = parseInt(document.getElementById("passes1").value);
      }
      return Math.round(invPercentage(parseInt(actualValue), passes1));
    } else {
      return actualValue;
    }
  }
}

export default function MatchTeamStatsEditor(props) {
  const baseObject = i => props.data.teams[i].statistics;
  const statFields = [
    {
      label: "Tiros",
      id: "shots",
      accessor: i => baseObject(i).shots
    },
    {
      label: "Tiros al arco",
      id: "shotsontarget",
      accessor: i => baseObject(i).shotsontarget
    },
    {
      label: "Posesión",
      accessor: i => baseObject(i).possession,
      id: "possession",
      extra: " %",
      onChange: (e, s) => evenUpPos(e.target.value, s),
      maxLength: 4
    },
    {
      label: "Pases",
      id: "passes",
      accessor: i => baseObject(i).passes
    },
    {
      label: "Precisión de los pases",
      id: "passescompleted",
      accessor: i =>
        percentage(baseObject(i).passescompleted, baseObject(i).passes),
      extra: " %",
      maxLength: 4
    },
    {
      label: "Pases clave",
      id: "keypasses",
      accessor: i => baseObject(i).keypasses
    },
    {
      label: "Faltas",
      id: "fouls",
      accessor: i => baseObject(i).fouls
    },
    {
      label: "Offsides",
      id: "offsides",
      accessor: i => baseObject(i).offsides
    },
    {
      label: "Córners",
      id: "corners",
      accessor: i => baseObject(i).corners
    }
  ];

  const inputSane = () => {
    let a = [];
    statFields.forEach(e => {
      a.push(parseValue(e.id + "0", baseObject(0)[e.id]))
      a.push(parseValue(e.id + "1", baseObject(1)[e.id]))
    })
    for (let i in a) {
      if (isNaN(a[i]) || a[i] < 0) {
        return false;
      }
    }
    return true;
  }

  function finishEditing() {
    let teams = JSON.parse(JSON.stringify(props.data.teams));
    if (!inputSane(teams)) {
      alert(
        'Valor(es) inválido(s). Ingrese un número, prefijado por "+" o "-" si se desea sumar o restar, respectivamente.'
      );
    } else {
      statFields.forEach(e => {
        teams[0].statistics[e.id] = parseValue(e.id + "0", teams[0].statistics[e.id])
        teams[1].statistics[e.id] = parseValue(e.id + "1", teams[1].statistics[e.id])
      })
      teams[0].statistics.chancescreated =
        teams[0].statistics.assists +
        parseValue("keypasses0", teams[0].statistics.keypasses);
      teams[1].statistics.chancescreated =
        teams[1].statistics.assists +
        parseValue("keypasses1", teams[1].statistics.keypasses);
      props.setEditing(null);
      props.changeTeamStats(teams);
    }
  }

  return (
    <div>
      <table className="dataTable" id="teamstatstable">
        <thead>
          <tr>
            <th>
              <img
                height="16px"
                alt={props.data.teams[0].teamname}
                src={getTeamLogo(props.data.teams[0].teamname)}
              ></img>
            </th>
            <th width="250px">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "20px"
                }}
              >
                ESTADÍSTICAS DEL EQUIPO
              </div>
            </th>
            <th>
              <img
                height="16px"
                alt={props.data.teams[1].teamname}
                src={getTeamLogo(props.data.teams[1].teamname)}
              ></img>
            </th>
          </tr>
        </thead>
        <tbody>
          {statFields.map(e => (
            <tr>
              <td>
                <input
                  id={e.id + "0"}
                  type="text"
                  style={{ width: "5ch", textAlign: "center" }}
                  maxLength={e.maxLength}
                  onChange={ev => e.onChange ? e.onChange(ev, "home") : null}
                  defaultValue={e.accessor(0)}
                >
                </input>{e.extra}
              </td>
              <td>{e.label}</td>
              <td>
                <input
                  id={e.id + "1"}
                  type="text"
                  style={{ width: "5ch", textAlign: "center" }}
                  maxLength={e.maxLength}
                  defaultValue={e.accessor(1)}
                  onChange={ev => e.onChange ? e.onChange(ev, "away") : null}
                >
                </input>{e.extra}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px"
        }}
      >
        <p style={{ fontSize: "0.85em", color: "var(--header-color)" }}>
          <i>
            Las ocasiones creadas se calculan combinando las asistencias y los
            pases clave.
          </i>
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            columnGap: "10px"
          }}
        >
          <button className="boton" onClick={e => finishEditing()}>
            Guardar
          </button>
          <button className="boton" onClick={e => props.setEditing(null)}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
