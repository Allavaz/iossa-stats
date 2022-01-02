import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTeamLogo, percentage } from "../utils/Utils";
import { useState } from "react";

export default function MatchTeamStats(props) {
  const [hovering, setHovering] = useState(false);

  const baseObject = i => props.data.teams[i].statistics;
  const rows = [
    {
      label: "Tiros",
      accessor: i => baseObject(i).shots
    },
    {
      label: "Tiros al arco",
      accessor: i => baseObject(i).shotsontarget
    },
    {
      label: "Posesión",
      accessor: i => baseObject(i).possession,
      extra: "%"
    },
    {
      label: "Pases",
      accessor: i => baseObject(i).passes
    },
    {
      label: "Precisión de los pases",
      accessor: i =>
        percentage(baseObject(i).passescompleted, baseObject(i).passes),
      extra: "%"
    },
    {
      label: "Pases clave",
      accessor: i => baseObject(i).keypasses
    },
    {
      label: "Faltas",
      accessor: i => baseObject(i).fouls
    },
    {
      label: "Tarjetas amarillas",
      accessor: i => baseObject(i).yellowcards
    },
    {
      label: "Tarjetas rojas",
      accessor: i => baseObject(i).redcards
    },
    {
      label: "Offsides",
      accessor: i => baseObject(i).offsides
    },
    {
      label: "Córners",
      accessor: i => baseObject(i).corners
    },
    {
      label: "Ocasiones creadas",
      accessor: i => baseObject(i).chancescreated
    },
  ];

  return (
    <div
      className="divDataTable"
      id="divStatsTable"
      style={props.style}
      onMouseOver={e => setHovering(true)}
      onMouseOut={e => setHovering(false)}
    >
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
                  alignItems: "center"
                }}
              >
                {props.editable ? <div style={{ flex: 1 }}></div> : null}
                <div style={{ marginLeft: "5px", marginRight: "5px" }}>
                  ESTADÍSTICAS DEL EQUIPO
                </div>
                {props.editable ? (
                  <div
                    style={{ flex: 1, textAlign: "left", marginBottom: "4px" }}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{
                        cursor: "pointer",
                        opacity: hovering ? "100%" : "0%"
                      }}
                      onClick={e => props.setEditing("teamStats")}
                    />
                  </div>
                ) : null}
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
          {rows.map(e => (e.accessor(0) != null &&
            <tr>
              <td>{e.accessor(0)}{1 && e.extra}</td>
              <td>{e.label}</td>
              <td>{e.accessor(1)}{1 && e.extra}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
