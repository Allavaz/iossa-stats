import Link from "next/link";
import { getTeamLogo, getTeamShortname, plus } from "../utils/Utils";
import Title from "./commons/title";

const ColoredBar = ({ color }) => {
  return (
    <div
      style={{
        height: "26px",
        width: "4px",
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
  mini = false,
  highlight
}: {
  teams: any[];
  header: string;
  mini?: boolean;
  highlight?: string;
}) {
  const classification = classifications.find(c =>
    c.matchingTournaments(header)
  );

  const columns = [
    {
      header: "#",
      width: "15px",
      render: (_, index) => index + 1
    },
    {
      header: "Equipo",
      render: (item, index) => (
        <Link href={`/equipo/${item._id}`}>
          <a className="flex items-center gap-x-1">
            {classification &&
              classification.colors.find(c => c.matchingIndexes(index)) && (
                <ColoredBar
                  color={
                    classification.colors.find(c => c.matchingIndexes(index))
                      .color
                  }
                />
              )}
            <img className="h-6" src={getTeamLogo(item._id)} alt={item._id} />
            <div className={`${!mini && "hidden"} sm:block`}>{item._id}</div>
            {!mini && (
              <div className="sm:hidden">{getTeamShortname(item._id)}</div>
            )}
          </a>
        </Link>
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
    <div className="flex flex-col gap-y-4">
      <Title>{header}</Title>
      <div className="shadow-lg overflow-x-auto flex text-sm border rounded-lg border-neutral-200 dark:border-neutral-700">
        <table className="min-w-max text-center grow">
          <thead>
            <tr className="dark:bg-neutral-900 bg-white border-b border-neutral-100 dark:border-neutral-700">
              {columns.map(e => (
                <th className="py-1 px-2" key={e.header}>
                  {e.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((item, index) => (
              <tr
                className="odd:bg-neutral-100 even:bg-white dark:even:bg-neutral-900 dark:odd:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 last:border-none"
                key={item._id}
              >
                {columns.map(e => (
                  <td
                    key={e.header}
                    className={`p-1 ${
                      highlight === item._id ? "bold" : "font-normal"
                    }`}
                  >
                    {e.render ? e.render(item, index) : item[e.accessor]}
                  </td>
                ))}
              </tr>
            ))}
            {classification &&
              classification.colors.map(c => (
                <tr key={c.label}>
                  <td className="py-1 px-2" colSpan={columns.length}>
                    <div className="flex items-center gap-x-2">
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
