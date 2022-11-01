import { useTable, usePagination, useFilters, useSortBy } from "react-table";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getTeamLogo } from "../utils/Utils";
import { secondsToMinutes } from "../lib/Utils";

export default function IndividualStats({ players, category, pagina }) {
  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        Header: "Jugador",
        accessor: "name",
        fixed: "left",
        width: 150,
        Cell: row => {
          return (
            <Link href={"/jugador/" + row.row.original._id}>
              <a>{row.row.original.name}</a>
            </Link>
          );
        },
        filter: (rows, cIds, fv) =>
          rows.filter(
            r =>
              r.original.name.toLowerCase().includes(fv.toLowerCase()) ||
              r.original._id.toLowerCase() === fv.toLowerCase()
          )
      },
      {
        Header: "Equipo",
        accessor: "team",
        Cell: row => {
          return (
            <div
              className="teamlogo"
              style={{
                justifyContent: "center"
              }}
            >
              <img
                height="16px"
                width="16px"
                src={getTeamLogo(row.row.original.team)}
                alt={row.row.original.team}
                layout="fixed"
              />
              <div style={{ marginLeft: "5px" }}>{row.row.original.team}</div>
            </div>
          );
        }
      },
      {
        Header: "Partidos",
        accessor: "matches",
        width: 70
      },
      {
        Header: "Goles",
        accessor: "goals",
        width: 70
      },
      {
        Header: "Asistencias",
        accessor: "assists",
        width: 100
      },
      {
        Header: "Segundas Asistencias",
        accessor: "secondassists",
        width: 130
      },
      {
        Header: "Tiros (al Arco)",
        accessor: "shotsontarget",
        width: 130,
        Cell: row => {
          return (
            row.row.original.shots + " (" + row.row.original.shotsontarget + ")"
          );
        }
      },
      {
        Header: "Pases (Completados)",
        accessor: "passes",
        width: 160,
        Cell: row => {
          return (
            row.row.original.passes +
            " (" +
            row.row.original.passescompleted +
            ")"
          );
        }
      },
      {
        Header: "Pases Clave",
        accessor: "keypasses",
        width: 130
      },
      {
        Header: "Precisión de Pases",
        accessor: "passescompleted",
        Cell: row => {
          return isNaN(
            row.row.original.passescompleted / row.row.original.passes
          )
            ? "0%"
            : Math.round(
                (row.row.original.passescompleted / row.row.original.passes) *
                  100
              ) + "%";
        },
        width: 150
      },
      {
        Header: "Intercepciones",
        accessor: "interceptions",
        width: 130
      },
      {
        Header: "Atajadas (Sin Rebote)",
        accessor: "savescaught",
        width: 180,
        Cell: row => {
          return (
            row.row.original.saves + " (" + row.row.original.savescaught + ")"
          );
        }
      },
      {
        Header: "Faltas",
        accessor: "fouls",
        width: 80
      },
      {
        Header: "Tarjetas Amarillas",
        accessor: "yellowcards",
        width: 150
      },
      {
        Header: "Tarjetas Rojas",
        accessor: "redcards",
        width: 130
      },
      {
        Header: "Goles en Contra",
        accessor: "owngoals",
        width: 130
      },
      {
        Header: "Offsides",
        accessor: "offsides",
        width: 80
      },
      {
        Header: "Prom. Distancia Recorrida",
        accessor: "distancecovered",
        width: 200,
        Cell: row => {
          return Math.round(row.row.original.distancecovered) / 1000 + " km";
        }
      },
      {
        Header: "Prom. Posesión",
        accessor: "possession",
        width: 130,
        Cell: row => {
          return Math.round(row.row.original.possession) + "%";
        }
      },
      {
        Header: "Córners",
        accessor: "corners",
        width: 80
      },
      {
        Header: "Laterales",
        accessor: "throwins",
        width: 90
      },
      {
        Header: "Penales",
        accessor: "penalties",
        width: 80
      },
      {
        Header: "Tiros Libres",
        accessor: "freekicks",
        width: 110
      },
      {
        Header: "Tackles (Completados)",
        accessor: "tacklescompleted",
        width: 180,
        Cell: row => {
          return (
            row.row.original.tackles +
            " (" +
            row.row.original.tacklescompleted +
            ")"
          );
        }
      },
      {
        Header: "Faltas Sufridas",
        accessor: "foulssuffered",
        width: 120
      },
      {
        Header: "Saques de Arco",
        accessor: "goalkicks",
        width: 130
      },
      {
        Header: "Goles Recibidos",
        accessor: "goalsconceded",
        width: 130
      },
      {
        Header: "Ocasiones Creadas",
        accessor: "chancescreated",
        width: 130
      },
      {
        Header: "Tiempo Jugado Total",
        accessor: "secondsplayed",
        Cell: row => secondsToMinutes(row.row.original.secondsplayed)
      }
    ],
    []
  );

  const data = useMemo(() => players, [players]);
  const tableInstance = useTable(
    { columns, data, initialState: { pageSize: 15 } },
    useFilters,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    page,
    headerGroups,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
    setFilter,
    rows,
    state: { pageIndex, pageSize }
  } = tableInstance;

  useEffect(() => {
    gotoPage(pagina);
  }, []);

  return (
    <>
      <h3>ESTADÍSTICAS INDIVIDUALES - {category.toUpperCase()}</h3>
      <div
        className="divDataTable"
        style={{
          borderRight: "1px solid var(--table-border-color)",
          borderLeft: "1px solid var(--table-border-color)",
          borderTop: "1px solid var(--table-border-color)",
          backgroundColor: "var(--table-odd-row-color)"
        }}
      >
        <table
          {...getTableProps()}
          style={{ borderCollapse: "initial" }}
          className="dataTable"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={
                      column.Header === "Jugador"
                        ? {
                            position: "sticky",
                            left: 0,
                            border: "0px",
                            borderBottom: "1px solid var(--table-border-color)",
                            borderRight: "1px solid var(--table-border-color)",
                            zIndex: 2,
                            cursor: "pointer",
                            userSelect: "none"
                          }
                        : {
                            border: 0,
                            borderBottom: "1px solid var(--table-border-color)",
                            borderLeft:
                              column.Header === "Equipo"
                                ? 0
                                : "1px solid var(--table-border-color)",
                            cursor: "pointer",
                            userSelect: "none"
                          }
                    }
                    key={index}
                  >
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <span>&#9660; </span>
                      ) : (
                        <span>&#9650; </span>
                      )
                    ) : null}
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            <tr>
              <td
                style={{
                  borderTop: 0,
                  borderLeft: 0,
                  position: "sticky",
                  left: 0,
                  zIndex: 2
                }}
              >
                <input
                  type="text"
                  placeholder="Buscar jugador…"
                  style={{ textAlign: "center", width: "21ch" }}
                  onChange={e => {
                    setFilter("name", e.target.value);
                    router.push(router.asPath.split("?")[0], undefined, {
                      shallow: true
                    });
                  }}
                />
              </td>
              <td style={{ borderTop: 0, borderLeft: 0, borderRight: 0 }}>
                <input
                  type="text"
                  placeholder="Buscar equipo…"
                  style={{ textAlign: "center", width: "23ch" }}
                  onChange={e => {
                    setFilter("team", e.target.value);
                    router.push(router.asPath.split("?")[0], undefined, {
                      shallow: true
                    });
                  }}
                />
              </td>
              <td
                colSpan={columns.length - 2}
                style={{ borderTop: 0, borderRight: 0 }}
              >
                {rows.length === 0 ? (
                  <div
                    style={{ display: "flex", color: "var(--header-color)" }}
                  >
                    <i>No hay jugadores</i>
                  </div>
                ) : null}
              </td>
            </tr>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, index) => (
                    <td
                      {...cell.getCellProps()}
                      style={
                        cell.column.Header === "Jugador"
                          ? {
                              position: "sticky",
                              left: 0,
                              border: 0,
                              borderBottom:
                                "1px solid var(--table-border-color)",
                              borderRight:
                                "1px solid var(--table-border-color)",
                              zIndex: 2
                            }
                          : {
                              border: 0,
                              borderLeft:
                                cell.column.Header === "Equipo"
                                  ? 0
                                  : "1px solid var(--table-border-color)",
                              borderBottom:
                                "1px solid var(--table-border-color)"
                            }
                      }
                      width={
                        cell.column.Header === "Equipo" ? "300px" : undefined
                      }
                      key={index}
                    >
                      {cell.value != null ? cell.render("Cell") : "N/A"}
                    </td>
                  ))}
                </tr>
              );
            })}
            {[...Array(pageSize - page.length)].map((e, i) => (
              <tr key={i}>
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    border: 0,
                    borderBottom: "1px solid var(--table-border-color)",
                    borderRight: "1px solid var(--table-border-color)",
                    borderBottom: "1px solid var(--table-border-color)",
                    zIndex: 2
                  }}
                >
                  &nbsp;
                </td>
                <td
                  style={{
                    border: 0,
                    borderBottom: "1px solid var(--table-border-color)"
                  }}
                >
                  &nbsp;
                </td>
                {[...Array(columns.length - 2)].map((e, i) => (
                  <td
                    key={i}
                    style={{
                      border: 0,
                      borderBottom: "1px solid var(--table-border-color)",
                      borderLeft: "1px solid var(--table-border-color)",
                      padding: "5.54px"
                    }}
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          className="boton"
          disabled={!canPreviousPage}
          onClick={e => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set("page", pageIndex);
            router.push(
              router.asPath.split("?")[0] + "?" + queryParams.toString(),
              undefined,
              {
                shallow: true
              }
            );
            previousPage();
          }}
          style={{ margin: 0, marginRight: "10px" }}
        >
          Anterior
        </button>
        <div className="pageIndicator">
          <div>
            Página {pageIndex + 1} de {Math.max(pageCount, 1)}
          </div>
          <div style={{ color: "var(--header-color)", fontSize: "0.75em" }}>
            {rows.length} resultado{rows.length !== 1 ? "s" : ""}
          </div>
        </div>
        <button
          className="boton"
          disabled={!canNextPage}
          onClick={e => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set("page", pageIndex + 2);
            router.push(
              router.asPath.split("?")[0] + "?" + queryParams.toString(),
              undefined,
              {
                shallow: true
              }
            );
            nextPage();
          }}
          style={{ margin: 0, marginLeft: "10px" }}
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
