import { getTeamLogo, percentage } from "../utils/Utils";

export default function MatchTeamStats(props) {
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
    }
  ];

  return (
    <div className="divDataTable" id="divStatsTable" style={props.style}>
      <table className="dataTable" id="teamstatstable">
        <thead>
          <tr>
            <th>
              <img
                height="16px"
                alt={props.data.teams[0].teamname}
                src={getTeamLogo(props.data.teams[0].teamname)}
              />
            </th>
            <th>
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
              </div>
            </th>
            <th>
              <img
                height="16px"
                alt={props.data.teams[1].teamname}
                src={getTeamLogo(props.data.teams[1].teamname)}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            e =>
              e.accessor(0) != null && (
                <tr key={e.label}>
                  <td>
                    {e.accessor(0)}
                    {1 && e.extra}
                  </td>
                  <td>{e.label}</td>
                  <td>
                    {e.accessor(1)}
                    {1 && e.extra}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
}
