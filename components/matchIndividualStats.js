import { useState, useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import MatchIndivStatsEditor from "./matchIndivStatsEditor";

export default function MatchIndividualStats(props) {
  const [playerHovering, setPlayerHovering] = useState(-1);
  const [hovering, setHovering] = useState(false);

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
    setPlayerHovering(-1);
    setHovering(false);
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
        width: 120,
        Cell: row => {
          if (props.editable) {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onMouseOver={e => setPlayerHovering(row.row.index)}
                onMouseOut={e => setPlayerHovering(-1)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ width: "30px" }}></div>
                </div>
                <div style={{ marginLeft: "5px", marginRight: "5px" }}>
                  <Link href={"/jugador/" + row.row.original.info.steam_id}>
                    <a>{row.row.original.info.name}</a>
                  </Link>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "30px",
                      opacity: playerHovering === row.row.index ? "100%" : "0%"
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ cursor: "pointer" }}
                      onClick={e =>
                        props.setEditing({
                          player: row.row.index,
                          side: props.side
                        })
                      }
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      style={{ cursor: "pointer" }}
                      onClick={e => onRemovePlayer(row.row.index)}
                    />
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <Link href={"/jugador/" + row.row.original.info.steam_id}>
                <a>{row.row.original.info.name}</a>
              </Link>
            );
          }
        }
      },
      {
        Header: "Pos.",
        accessor: "statistics.positions[0].position",
        width: 50
      },
      {
        Header: "Goles",
        accessor: "statistics.goals",
        width: 70
      },
      {
        Header: "Asistencias",
        accessor: "statistics.assists",
        width: 100
      },
      {
        Header: "Segundas Asistencias",
        accessor: "statistics.secondassists",
        width: 130
      },
      {
        Header: "Tiros (al Arco)",
        accessor: "statistics.shotsontarget",
        width: 130,
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
        width: 160,
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
        },
        width: 150
      },
      {
        Header: "Pases Clave",
        accessor: "statistics.keypasses",
        width: 130
      },
      {
        Header: "Intercepciones",
        accessor: "statistics.interceptions",
        width: 130
      },
      {
        Header: "Atajadas (Sin Rebote)",
        accessor: "savescaught",
        width: 180,
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
        accessor: "statistics.fouls",
        width: 80
      },
      {
        Header: "Tarjetas Amarillas",
        accessor: "statistics.yellowcards",
        width: 150
      },
      {
        Header: "Tarjetas Rojas",
        accessor: "statistics.redcards",
        width: 130
      },
      {
        Header: "Goles en Contra",
        accessor: "statistics.owngoals",
        width: 130
      },
      {
        Header: "Offsides",
        accessor: "statistics.offsides",
        width: 80
      },
      {
        Header: "Distancia Recorrida",
        accessor: "statistics.distancecovered",
        width: 150,
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
        width: 80,
        Cell: row => {
          return Math.round(row.row.original.statistics.possession) + "%";
        }
      },
      {
        Header: "Córners",
        accessor: "statistics.corners",
        width: 80
      },
      {
        Header: "Laterales",
        accessor: "statistics.throwins",
        width: 90
      },
      {
        Header: "Penales",
        accessor: "statistics.penalties",
        width: 80
      },
      {
        Header: "Tiros Libres",
        accessor: "statistics.freekicks",
        width: 110
      },
      {
        Header: "Tackles (Completados)",
        accessor: "statistics.tacklescompleted",
        width: 180,
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
        accessor: "statistics.foulssuffered",
        width: 120
      },
      {
        Header: "Saques de Arco",
        accessor: "statistics.goalkicks",
        width: 130
      },
      {
        Header: "Goles Recibidos",
        accessor: "statistics.goalsconceded",
        width: 130
      },
      {
        Header: "Ocasiones Creadas",
        accessor: "statistics.chancescreated",
        width: 130
      }
    ],
    [playerHovering, props.editable]
  );

  const data = useMemo(() => props.players, [props.players]);
  const tableInstance = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, rows, headerGroups, prepareRow } =
    tableInstance;

  return (
    <div
      onMouseOver={e => {
        setHovering(true);
      }}
      onMouseOut={e => {
        setHovering(false);
        setPlayerHovering(-1);
      }}
    >
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
              opacity: hovering ? "100%" : "0%",
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
                      {cell.render("Cell")}
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
