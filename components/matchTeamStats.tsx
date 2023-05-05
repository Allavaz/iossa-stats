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
      className="shadow-lg overflow-x-auto flex text-sm rounded-lg border border-neutral-200 dark:border-neutral-700"
      style={props.style}
    >
      <table className="min-w-max text-center grow">
        <thead>
          <tr className="dark:bg-neutral-900 bg-white border-b border-neutral-200 dark:border-neutral-700">
            <th className="py-1 px-2">
              <div className="flex justify-center">
                <img
                  className="h-6"
                  alt={props.data.teams[0].teamname}
                  src={getTeamLogo(props.data.teams[0].teamname)}
                />
              </div>
            </th>
            <th className="py-1 px-2">
              <div>
                {props.editable ? <div style={{ flex: 1 }}></div> : null}
                <div style={{ marginLeft: "5px", marginRight: "5px" }}>
                  ESTADÍSTICAS DEL EQUIPO
                </div>
              </div>
            </th>
            <th className="py-1 px-2">
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
                  className="odd:bg-neutral-100 even:bg-white dark:even:bg-neutral-900 dark:odd:bg-neutral-950 border-b last:border-none border-neutral-200 dark:border-neutral-800"
                  key={e.label}
                >
                  <td className="py-1 px-2">
                    {e.accessor(0)}
                    {1 && e.extra}
                  </td>
                  <td className="py-1 px-2">{e.label}</td>
                  <td className="py-1 px-2">
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
