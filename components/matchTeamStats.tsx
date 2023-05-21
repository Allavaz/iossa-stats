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
    <div
      className="flex overflow-x-auto rounded-lg border border-neutral-200 text-sm shadow-lg dark:border-neutral-700"
      style={props.style}
    >
      <table className="min-w-max grow text-center">
        <thead>
          <tr className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <th className="px-2 py-1">
              <div className="flex justify-center">
                <img
                  className="h-6"
                  alt={props.data.teams[0].teamname}
                  src={getTeamLogo(props.data.teams[0].teamname)}
                />
              </div>
            </th>
            <th className="px-2 py-1">
              <div>
                {props.editable ? <div style={{ flex: 1 }}></div> : null}
                <div style={{ marginLeft: "5px", marginRight: "5px" }}>
                  ESTADÍSTICAS DEL EQUIPO
                </div>
              </div>
            </th>
            <th className="px-2 py-1">
              <div className="flex justify-center">
                <img
                  className="h-6"
                  alt={props.data.teams[1].teamname}
                  src={getTeamLogo(props.data.teams[1].teamname)}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            e =>
              e.accessor(0) != null && (
                <tr
                  className="border-b border-neutral-200 last:border-none odd:bg-neutral-100 even:bg-white dark:border-neutral-800 dark:odd:bg-neutral-950 dark:even:bg-neutral-900"
                  key={e.label}
                >
                  <td className="px-2 py-1">
                    {e.accessor(0)}
                    {1 && e.extra}
                  </td>
                  <td className="px-2 py-1">{e.label}</td>
                  <td className="px-2 py-1">
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
