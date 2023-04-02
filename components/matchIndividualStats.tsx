import { useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import MatchIndivStatsEditor from "./matchIndivStatsEditor";
import { secondsToMinutes } from "../lib/Utils";

export default function MatchIndividualStats(props) {
  function onChangeIndivStats(player) {
    let oldsteamid;
    if (
      !props.editing.new &&
      player.info.steam_id !== props.players[props.editing.player].info.steam_id
    ) {
      oldsteamid = props.players[props.editing.player].info.steam_id;
    }
    props.changeIndivStats(
      player,
      props.side,
      props.editing.player,
      oldsteamid
    );
    props.setEditing(null);
  }

  function onRemovePlayer(index) {
    props.removePlayer(props.players[index], props.side, index);
  }

  const newItem = () => {
    return {
      info: {
        name: "",
        steam_id: "",
        team: props.teamName
      },
      statistics: {
        assists: 0,
        corners: 0,
        distancecovered: 0,
        fouls: 0,
        foulssuffered: 0,
        freekicks: 0,
        goalkicks: 0,
        goals: 0,
        goalsconceded: 0,
        interceptions: 0,
        offsides: 0,
        owngoals: 0,
        passes: 0,
        passescompleted: 0,
        penalties: 0,
        positions: [],
        possession: 0,
        redcards: 0,
        saves: 0,
        savescaught: 0,
        secondsplayed: 0,
        shots: 0,
        shotsontarget: 0,
        tackles: 0,
        tacklescompleted: 0,
        throwins: 0,
        yellowcards: 0,
        keypasses: 0,
        chancescreated: 0,
        secondassists: 0
      }
    };
  };

  const columns = useMemo(
    () => [
      {
        Header: "Jugador",
        accessor: "info.name",
        sticky: "left",
        Cell: row => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              columnGap: "5px"
            }}
          >
            <Link href={"/jugador/" + row.row.original.info.steam_id}>
              <a>{row.row.original.info.name}</a>
            </Link>
            {props.editable && (
              <>
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    props.setEditing({
                      player: row.row.index,
                      side: props.side
                    })
                  }
                />
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  style={{ cursor: "pointer" }}
                  onClick={() => onRemovePlayer(row.row.index)}
                />
              </>
            )}
          </div>
        )
      },
      {
        Header: "Pos.",
        accessor: "statistics.positions[0].position"
      },
      {
        Header: "Goles",
        accessor: "statistics.goals"
      },
      {
        Header: "Asistencias",
        accessor: "statistics.assists"
      },
      {
        Header: "Segundas Asistencias",
        accessor: "statistics.secondassists"
      },
      {
        Header: "Tiros (al Arco)",
        accessor: "statistics.shotsontarget",
        Cell: row => {
          return (
            row.row.original.statistics.shots +
            " (" +
            row.row.original.statistics.shotsontarget +
            ")"
          );
        }
      },
      {
        Header: "Pases (Completados)",
        accessor: "statistics.passes",
        Cell: row => {
          return (
            row.row.original.statistics.passes +
            " (" +
            row.row.original.statistics.passescompleted +
            ")"
          );
        }
      },
      {
        Header: "Precisión de Pases",
        accessor: "statistics.passescompleted",
        Cell: row => {
          return isNaN(
            row.row.original.statistics.passescompleted /
              row.row.original.statistics.passes
          )
            ? "0%"
            : Math.round(
                (row.row.original.statistics.passescompleted /
                  row.row.original.statistics.passes) *
                  100
              ) + "%";
        }
      },
      {
        Header: "Pases Clave",
        accessor: "statistics.keypasses"
      },
      {
        Header: "Intercepciones",
        accessor: "statistics.interceptions"
      },
      {
        Header: "Atajadas (Sin Rebote)",
        accessor: "statistics.savescaught",
        Cell: row => {
          return (
            row.row.original.statistics.saves +
            " (" +
            row.row.original.statistics.savescaught +
            ")"
          );
        }
      },
      {
        Header: "Faltas",
        accessor: "statistics.fouls"
      },
      {
        Header: "Tarjetas Amarillas",
        accessor: "statistics.yellowcards"
      },
      {
        Header: "Tarjetas Rojas",
        accessor: "statistics.redcards"
      },
      {
        Header: "Goles en Contra",
        accessor: "statistics.owngoals"
      },
      {
        Header: "Offsides",
        accessor: "statistics.offsides"
      },
      {
        Header: "Distancia Recorrida",
        accessor: "statistics.distancecovered",
        Cell: row => {
          return (
            Math.round(row.row.original.statistics.distancecovered) / 1000 +
            " km"
          );
        }
      },
      {
        Header: "Posesión",
        accessor: "statistics.possession",
        Cell: row => {
          return Math.round(row.row.original.statistics.possession) + "%";
        }
      },
      {
        Header: "Córners",
        accessor: "statistics.corners"
      },
      {
        Header: "Laterales",
        accessor: "statistics.throwins"
      },
      {
        Header: "Penales",
        accessor: "statistics.penalties"
      },
      {
        Header: "Tiros Libres",
        accessor: "statistics.freekicks"
      },
      {
        Header: "Tackles (Completados)",
        accessor: "statistics.tacklescompleted",
        Cell: row => {
          return (
            row.row.original.statistics.tackles +
            " (" +
            row.row.original.statistics.tacklescompleted +
            ")"
          );
        }
      },
      {
        Header: "Faltas Sufridas",
        accessor: "statistics.foulssuffered"
      },
      {
        Header: "Saques de Arco",
        accessor: "statistics.goalkicks"
      },
      {
        Header: "Goles Recibidos",
        accessor: "statistics.goalsconceded"
      },
      {
        Header: "Ocasiones Creadas",
        accessor: "statistics.chancescreated"
      },
      {
        Header: "Tiempo Jugado",
        accessor: "statistics.secondsplayed",
        Cell: row => secondsToMinutes(row.row.original.statistics.secondsplayed)
      }
    ],
    [props.editable]
  );

  const data = useMemo(() => props.players, [props.players]);
  const tableInstance = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, rows, headerGroups, prepareRow } =
    tableInstance;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {props.editing &&
        typeof props.editing.player !== "undefined" &&
        props.editing.side === props.side ? (
          <MatchIndivStatsEditor
            player={
              props.editing.new
                ? newItem()
                : props.players[props.editing.player]
            }
            team={props.teamName}
            players={props.playersAutocomplete}
            onChangeIndivStats={onChangeIndivStats}
            setEditing={props.setEditing}
            editing={props.editing}
          />
        ) : null}
        <h3>ESTADÍSTICAS INDIVIDUALES - {props.teamName.toUpperCase()}</h3>
        {props.editable ? (
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              marginLeft: "5px",
              marginBottom: "2px",
              cursor: "pointer"
            }}
            onClick={e => {
              props.setEditing({
                player: props.players.length,
                side: props.side,
                new: true
              });
            }}
          />
        ) : null}
      </div>
      <div
        className="divDataTable"
        style={{
          borderRight: "1px solid var(--table-border-color)",
          borderLeft: "1px solid var(--table-border-color)",
          borderTop: "1px solid var(--table-border-color)"
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
                            cursor: "pointer",
                            userSelect: "none"
                          }
                        : {
                            border: 0,
                            borderBottom: "1px solid var(--table-border-color)",
                            borderLeft:
                              column.Header === "Pos."
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
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
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
                              borderRight: "1px solid var(--table-border-color)"
                            }
                          : {
                              border: 0,
                              borderLeft:
                                cell.column.Header === "Pos."
                                  ? 0
                                  : "1px solid var(--table-border-color)",
                              borderBottom:
                                "1px solid var(--table-border-color)"
                            }
                      }
                      key={index}
                    >
                      {cell.value != null ? cell.render("Cell") : "N/A"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
