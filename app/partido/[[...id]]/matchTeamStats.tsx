import { getTeamLogo, percentage } from "../../../utils/Utils";
import Table from "../../../components/ui/table";

export default function MatchTeamStats({ match }) {
  const baseObject = i => match.teams[i].statistics;
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
    <Table>
      <thead>
        <Table.HeaderRow>
          <Table.HeaderCell>
            <div className="flex justify-center">
              <img
                className="h-6"
                alt={match.teams[0].teamname}
                src={getTeamLogo(match.teams[0].teamname)}
              />
            </div>
          </Table.HeaderCell>
          <Table.HeaderCell>ESTADÍSTICAS DEL EQUIPO</Table.HeaderCell>
          <Table.HeaderCell>
            <div className="flex justify-center">
              <img
                className="h-6"
                alt={match.teams[1].teamname}
                src={getTeamLogo(match.teams[1].teamname)}
              />
            </div>
          </Table.HeaderCell>
        </Table.HeaderRow>
      </thead>
      <tbody>
        {rows.map(
          e =>
            e.accessor(0) != null && (
              <Table.BodyRow key={e.label}>
                <Table.BodyCell>
                  {e.accessor(0)}
                  {1 && e.extra}
                </Table.BodyCell>
                <Table.BodyCell>{e.label}</Table.BodyCell>
                <Table.BodyCell>
                  {e.accessor(1)}
                  {1 && e.extra}
                </Table.BodyCell>
              </Table.BodyRow>
            )
        )}
      </tbody>
    </Table>
  );
}
