import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useGlobalFilter, usePagination, useTable } from "react-table";
import {
  fecha,
  getTeamLogo,
  getTeamShortname,
  getTournamentIcon
} from "../utils/Utils";

export default function Results({ matches, category, pagina }) {
  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        Header: "Fecha",
        accessor: "fecha",
        Cell: row => {
          return (
            <Link href={`/partido/${row.row.original._id}`}>
              <a>{fecha(row.row.original.fecha)}</a>
            </Link>
          );
        },
        width: 110,
        disableGlobalFilter: true
      },
      {
        Header: "Local",
        accessor: "teams[0].teamname",
        Cell: row => {
          return (
            <Link href={`/partido/${row.row.original._id}`}>
              <a>
                <div className="teamlogo" id="home">
                  <div id="teamname">{row.row.original.teams[0].teamname}</div>
                  <div id="shortname">
                    {getTeamShortname(row.row.original.teams[0].teamname)}
                  </div>{" "}
                  <div style={{ marginLeft: "5px" }}>
                    <img
                      height="16px"
                      src={getTeamLogo(row.row.original.teams[0].teamname)}
                      alt={row.row.original.teams[0].teamname}
                    ></img>
                  </div>
                </div>
              </a>
            </Link>
          );
        }
      },
      {
        Header: "Resultado",
        accessor: "teams[0].score",
        Cell: row => {
          return (
            <Link href={`/partido/${row.row.original._id}`}>
              {row.row.original.teams[0].score +
                " - " +
                row.row.original.teams[1].score}
            </Link>
          );
        },
        width: 60,
        disableGlobalFilter: true
      },
      {
        Header: "Visitante",
        accessor: "teams[1].teamname",
        Cell: row => {
          return (
            <Link href={`/partido/${row.row.original._id}`}>
              <a>
                <div className="teamlogo" id="away">
                  <div style={{ marginRight: "5px" }}>
                    <img
                      height="16px"
                      src={getTeamLogo(row.row.original.teams[1].teamname)}
                      alt={row.row.original.teams[1].teamname}
                    ></img>
                  </div>{" "}
                  <div id="teamname">{row.row.original.teams[1].teamname}</div>
                  <div id="shortname">
                    {getTeamShortname(row.row.original.teams[1].teamname)}
                  </div>
                </div>
              </a>
            </Link>
          );
        }
      },
      {
        Header: "Torneo",
        accessor: "torneo",
        Cell: row => {
          return (
            <Link href={`/partido/${row.row.original._id}`}>
              <a>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    id="torneoimg"
                    height="16px"
                    src={getTournamentIcon(row.row.original.torneo)}
                    alt={row.row.original.torneo}
                  ></img>{" "}
                  <div className="torneo">{row.row.original.torneo}</div>
                </div>
              </a>
            </Link>
          );
        }
      }
    ],
    []
  );

  const data = useMemo(() => matches, [matches]);
  const tableInstance = useTable(
    { columns, data, initialState: { pageSize: 15, pageIndex: pagina } },
    useGlobalFilter,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    setGlobalFilter,
    rows,
    state: { pageIndex, pageSize }
  } = tableInstance;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ display: "inline", marginRight: "10px" }}>
          RESULTADOS - {category.toUpperCase()}
        </h3>
        <input
          type="text"
          placeholder="Buscar equipo/torneo…"
          onChange={e => {
            setGlobalFilter(e.target.value);
            router.push(router.asPath.split("?")[0], undefined, {
              shallow: true
            });
          }}
          style={{
            border: "1px solid var(--button-border)",
            fontSize: "11pt",
            padding: "5px",
            height: "20px",
            backgroundColor: "var(--card-background)",
            color: "var(--normal-text-color)",
            boxShadow: "var(--shadow)"
          }}
        />
      </div>
      <div
        className="divDataTable"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          border: 0,
          borderRight: "1px solid var(--table-border-color)",
          borderLeft: "1px solid var(--table-border-color)",
          backgroundColor: "var(--table-odd-row-color)"
        }}
      >
        {rows.length === 0 ? (
          <div
            style={{
              position: "absolute",
              color: "var(--header-color)",
              alignSelf: "center",
              border: 0
            }}
          >
            <i>No hay partidos</i>
          </div>
        ) : null}
        <table className="dataTable" {...getTableProps()}>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => (
                    <td
                      style={{ borderLeft: 0, borderRight: 0, padding: "7px" }}
                      key={index}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
            {[...Array(pageSize - page.length)].map((e, i) => (
              <tr key={i}>
                <td
                  colSpan={5}
                  style={{ borderLeft: 0, borderRight: 0, padding: "9px" }}
                >
                  &nbsp;
                </td>
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