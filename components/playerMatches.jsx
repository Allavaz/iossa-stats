import { useMemo } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import Link from "next/link";
import {
  getTeamLogo,
  fecha,
  getTeamShortname,
  getTournamentIcon
} from "../utils/Utils";

function WonOrLost(match, playerID) {
  for (let i in match.teams[0].playerStatistics) {
    if (match.teams[0].playerStatistics[i].info.steam_id === playerID) {
      if (match.teams[0].result === 1) {
        return <div style={{ color: "green" }}>W</div>;
      } else if (match.teams[0].result === -1) {
        return <div style={{ color: "red" }}>L</div>;
      } else if (match.teams[0].result === 0) {
        return <div style={{ color: "orange" }}>D</div>;
      }
    }
  }
  for (let i in match.teams[1].playerStatistics) {
    if (match.teams[1].playerStatistics[i].info.steam_id === playerID) {
      if (match.teams[1].result === 1) {
        return <div style={{ color: "green" }}>W</div>;
      } else if (match.teams[1].result === -1) {
        return <div style={{ color: "red" }}>L</div>;
      } else if (match.teams[1].result === 0) {
        return <div style={{ color: "orange" }}>D</div>;
      }
    }
  }
}

export default function PlayerMatches({ matches, id }) {
  const columns = useMemo(
    () => [
      {
        Header: "Fecha",
        accessor: "fecha",
        Cell: row => {
          return (
            <Link href={`/partido/${row.row.original._id}`}>
              {fecha(row.row.original.fecha)}
            </Link>
          );
        },
        width: 110,
        disableGlobalFilter: true
      },
      {
        Header: "Resultado",
        accessor: "result",
        Cell: row => (
          <Link href={`/partido/${row.row.original._id}`}>
            {WonOrLost(row.row.original, id)}
          </Link>
        ),
        disableGlobalFilter: true
      },
      {
        Header: "Local",
        accessor: "teams[0].teamname",
        Cell: row => {
          return (
            <Link href={`/partido/${row.row.original._id}`} passHref>
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
            <Link href={`/partido/${row.row.original._id}`} passHref>
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
            </Link>
          );
        }
      },
      {
        Header: "Torneo",
        accessor: "torneo",
        Cell: row => {
          return (
            <Link href={`/partido/${row.row.original._id}`} passHref>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  id="torneoimg"
                  height="16px"
                  src={getTournamentIcon(row.row.original.torneo)}
                  alt={row.row.original.torneo}
                ></img>{" "}
                <div className="torneo">{row.row.original.torneo}</div>
              </div>
            </Link>
          );
        }
      }
    ],
    []
  );

  const data = useMemo(() => matches, [matches]);
  const tableInstance = useTable(
    { columns, data, initialState: { pageSize: 10 } },
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
      <div style={{ display: "flex", alignItems: "center", marginTop: "-15px" }}>
        <h3 style={{ display: "inline", marginRight: "10px" }}>
          ÚLTIMOS RESULTADOS
        </h3>
        <input
          type="text"
          placeholder="Buscar equipo/torneo…"
          onChange={e => setGlobalFilter(e.target.value)}
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
          borderLeft: "1px solid var(--table-border-color)",
          borderRight: "1px solid var(--table-border-color)"
        }}
      >
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
                  colSpan="6"
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
          onClick={e => previousPage()}
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
          onClick={e => nextPage()}
          style={{ margin: 0, marginLeft: "10px" }}
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
