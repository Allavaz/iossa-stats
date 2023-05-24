import Link from "next/link";
import { getTeamLogo, getTeamShortname, plus } from "../utils/Utils";
import Title from "./commons/title";
import Table from "./commons/table";

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
      <Table>
        <thead>
          <Table.HeaderRow>
            {columns.map(e => (
              <Table.HeaderCell key={e.header}>{e.header}</Table.HeaderCell>
            ))}
          </Table.HeaderRow>
        </thead>
        <tbody>
          {teams.map((item, index) => (
            <Table.BodyRow key={item._id}>
              {columns.map(e => (
                <Table.BodyCell key={e.header}>
                  <span
                    className={`${highlight === item._id ? "font-bold" : ""}`}
                  >
                    {e.render ? e.render(item, index) : item[e.accessor]}
                  </span>
                </Table.BodyCell>
              ))}
            </Table.BodyRow>
          ))}
          {classification &&
            classification.colors.map(c => (
              <Table.BodyRow key={c.label}>
                <Table.BodyCell colSpan={columns.length}>
                  <div className="flex items-center gap-x-2">
                    <ColoredBar color={c.color} />
                    {c.label}
                  </div>
                </Table.BodyCell>
              </Table.BodyRow>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
