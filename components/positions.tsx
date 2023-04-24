import { getTeamLogo, getTeamShortname, plus } from "../utils/Utils";

const ColoredBar = ({ color }) => {
  return (
    <div
      style={{
        marginTop: "-5px",
        marginBottom: "-5px",
        height: "26px",
        width: "4px",
        marginLeft: "-5px",
        marginRight: "5px",
        backgroundColor: color
      }}
    />
  );
};

const classifications = [
  {
    matchingTournaments: header => header.startsWith("Superliga"),
    colors: [
      {
        color: "#fa9d41",
        matchingIndexes: index => index < 6,
        label: "Clasifica a Liga D1"
      },
      {
        color: "#1cc2ff",
        matchingIndexes: index => index >= 6,
        label: "Clasifica a Liga D2"
      }
    ]
  },
  {
    matchingTournaments: header => header === "Liga D1 T9",
    colors: [
      {
        color: "#FFD700",
        matchingIndexes: () => true,
        label: "Clasifica a Intrazonal de Oro"
      }
    ]
  },
  {
    matchingTournaments: header => header === "Liga D2 T9",
    colors: [
      {
        color: "#FFD700",
        matchingIndexes: index => index < 3,
        label: "Clasifica a Intrazonal de Oro"
      },
      {
        color: "green",
        matchingIndexes: index => index === 3,
        label: "Clasifica a semifinales de Intrazonal de Plata"
      },
      {
        color: "#C0C0C0",
        matchingIndexes: index => index > 3,
        label: "Clasifica a Intrazonal de Plata"
      }
    ]
  },
  {
    matchingTournaments: header => header === "Liga D3 T9",
    colors: [
      {
        color: "#C0C0C0",
        matchingIndexes: () => true,
        label: "Clasifica a Intrazonal de Plata"
      }
    ]
  }
];

export default function PositionsComponent({
  teams,
  header,
  mini = false
}: {
  teams: any[];
  header: string;
  mini?: boolean;
}) {
  const classification = classifications.find(c =>
    c.matchingTournaments(header)
  );

  const columns = [
    {
      header: "#",
      width: "15px",
      render: (item, index) => index + 1
    },
    {
      header: "Equipo",
      render: (item, index) => (
        <div className="teamlogo">
          {classification &&
            classification.colors.find(c => c.matchingIndexes(index)) && (
              <ColoredBar
                color={
                  classification.colors.find(c => c.matchingIndexes(index))
                    .color
                }
              />
            )}
          <img
            height="16px"
            src={getTeamLogo(item._id)}
            alt={item._id}
            style={{ marginRight: "5px" }}
          />
          <div id={mini ? "fullteamname" : "teamname"}>{item._id}</div>
          {!mini && <div id="shortname">{getTeamShortname(item._id)}</div>}
        </div>
      )
    },
    {
      header: "PJ",
      accessor: "PJ"
    },
    {
      header: "Pts",
      accessor: "Pts"
    },
    ...(!mini
      ? [
          {
            header: "GF",
            accessor: "GF"
          },
          {
            header: "GC",
            accessor: "GC"
          },
          {
            header: "PG",
            accessor: "PG"
          },
          {
            header: "PE",
            accessor: "PE"
          },
          {
            header: "PP",
            accessor: "PP"
          },
          {
            header: "DF",
            render: item => plus(item.DF)
          }
        ]
      : [])
  ];

  return (
    <div>
      <h3>{header.toUpperCase()}</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <thead>
            <tr>
              {columns.map(e => (
                <th key={e.header}>{e.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((item, index) => (
              <tr key={item.name}>
                {columns.map(e => (
                  <td key={e.header}>
                    {e.render ? e.render(item, index) : item[e.accessor]}
                  </td>
                ))}
              </tr>
            ))}
            {classification &&
              classification.colors.map(c => (
                <tr key={c.label}>
                  <td colSpan={columns.length}>
                    <div className="teamlogo">
                      <ColoredBar color={c.color} />
                      {c.label}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
