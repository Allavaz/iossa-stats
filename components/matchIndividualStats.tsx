import { useMemo } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import MatchIndivStatsEditor from "./matchIndivStatsEditor";
import { secondsToMinutes } from "../lib/Utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { MatchPlayer } from "../types";
import Title from "./commons/title";
import Table from "./commons/table";
import Modal from "./commons/modal";

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

  const columnHelper = createColumnHelper<MatchPlayer>();

  const columns = [
    columnHelper.accessor(row => row.info.name, {
      id: "name",
      header: "Jugador",
      cell: info => (
        <div className="flex items-center justify-center gap-x-1">
          <Link href={"/jugador/" + info.row.original.info.steam_id}>
            <a>{info.getValue()}</a>
          </Link>
          {props.editable && (
            <>
              <FontAwesomeIcon
                icon={faEdit}
                className="cursor-pointer"
                onClick={() =>
                  props.setEditing({
                    player: info.row.index,
                    side: props.side
                  })
                }
              />
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="cursor-pointer"
                onClick={() => onRemovePlayer(info.row.index)}
              />
            </>
          )}
        </div>
      )
    }),
    columnHelper.accessor(row => row.statistics.positions[0].position, {
      id: "position",
      header: "Posición"
    }),
    columnHelper.accessor(row => row.statistics.goals, {
      id: "goals",
      header: "Goles"
    }),
    columnHelper.accessor(row => row.statistics.assists, {
      id: "assists",
      header: "Asistencias"
    }),
    columnHelper.accessor(row => row.statistics.secondassists, {
      id: "secondassists",
      header: "Segundas asistencias"
    }),
    columnHelper.accessor(row => row.statistics.shots, {
      id: "shots",
      header: "Tiros (al arco)",
      cell: info => {
        return `${info.getValue()} (${
          info.row.original.statistics.shotsontarget
        })`;
      }
    }),
    columnHelper.accessor(row => row.statistics.passes, {
      id: "passes",
      header: "Pases (completados)",
      cell: info => {
        return `${info.getValue()} (${
          info.row.original.statistics.passescompleted
        })`;
      }
    }),
    columnHelper.accessor(
      row =>
        isNaN(row.statistics.passescompleted / row.statistics.passes)
          ? 0
          : Math.round(
              (row.statistics.passescompleted / row.statistics.passes) * 100
            ),
      {
        id: "passaccuracy",
        header: "Precisión de pases",
        cell: info => `${info.getValue()}%`
      }
    ),
    columnHelper.accessor(row => row.statistics.keypasses, {
      id: "keypasses",
      header: "Pases clave"
    }),
    columnHelper.accessor(row => row.statistics.interceptions, {
      id: "interceptions",
      header: "Intercepciones"
    }),
    columnHelper.accessor(row => row.statistics.saves, {
      id: "saves",
      header: "Atajadas (sin rebote)",
      cell: info => {
        return `${info.getValue()} (${
          info.row.original.statistics.savescaught
        })`;
      }
    }),
    columnHelper.accessor(row => row.statistics.fouls, {
      id: "fouls",
      header: "Faltas"
    }),
    columnHelper.accessor(row => row.statistics.yellowcards, {
      id: "yellowcards",
      header: "Tarjetas amarillas"
    }),
    columnHelper.accessor(row => row.statistics.redcards, {
      id: "redcards",
      header: "Tarjetas rojas"
    }),
    columnHelper.accessor(row => row.statistics.owngoals, {
      id: "owngoals",
      header: "Goles en contra"
    }),
    columnHelper.accessor(row => row.statistics.offsides, {
      id: "offsides",
      header: "Offsides"
    }),
    columnHelper.accessor(
      row => (row.statistics.distancecovered / 1000).toPrecision(4),
      {
        id: "distancecovered",
        header: "Distancia recorrida",
        cell: info => `${info.getValue()} km`
      }
    ),
    columnHelper.accessor(row => Math.round(row.statistics.possession), {
      id: "possession",
      header: "Posesión",
      cell: info => `${info.getValue()}%`
    }),
    columnHelper.accessor(row => row.statistics.corners, {
      id: "corners",
      header: "Corners"
    }),
    columnHelper.accessor(row => row.statistics.throwins, {
      id: "throwins",
      header: "Laterales"
    }),
    columnHelper.accessor(row => row.statistics.penalties, {
      id: "penalties",
      header: "Penales"
    }),
    columnHelper.accessor(row => row.statistics.freekicks, {
      id: "freekicks",
      header: "Tiros libres"
    }),
    columnHelper.accessor(row => row.statistics.tackles, {
      id: "tackles",
      header: "Tackles (completados)",
      cell: info => {
        return `${info.getValue()} (${
          info.row.original.statistics.tacklescompleted
        })`;
      }
    }),
    columnHelper.accessor(row => row.statistics.foulssuffered, {
      id: "foulssuffered",
      header: "Faltas recibidas"
    }),
    columnHelper.accessor(row => row.statistics.goalkicks, {
      id: "goalkicks",
      header: "Saques de arco"
    }),
    columnHelper.accessor(row => row.statistics.goalsconceded, {
      id: "goalsconceded",
      header: "Goles recibidos"
    }),
    columnHelper.accessor(row => row.statistics.chancescreated, {
      id: "chancescreated",
      header: "Ocasiones creadas"
    }),
    columnHelper.accessor(row => row.statistics.secondsplayed, {
      id: "secondsplayed",
      header: "Tiempo jugado",
      cell: info => secondsToMinutes(info.getValue())
    })
  ];

  const table = useReactTable({
    data: props.players,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <>
      <div>
        {props.editing &&
        typeof props.editing.player !== "undefined" &&
        props.editing.side === props.side ? (
          <Modal>
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
          </Modal>
        ) : null}
        <div className="flex items-center gap-x-2">
          <Title style={{ display: "inline", width: "fit-content" }}>
            Estadísticas Individuales - {props.teamName}
          </Title>
          {props.editable ? (
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={faPlus}
              onClick={_ => {
                props.setEditing({
                  player: props.players.length,
                  side: props.side,
                  new: true
                });
              }}
            />
          ) : null}
        </div>
      </div>
      <Table sticky>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.HeaderRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Table.HeaderCell sticky={header.id === "name"} key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      className="cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{ asc: " ↑", desc: " ↓" }[
                        header.column.getIsSorted() as string
                      ] ?? null}
                    </div>
                  )}
                </Table.HeaderCell>
              ))}
            </Table.HeaderRow>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <Table.BodyRow key={row.id} sticky>
              {row.getVisibleCells().map(cell => (
                <Table.BodyCell
                  sticky={cell.column.id === "name"}
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.BodyCell>
              ))}
            </Table.BodyRow>
          ))}
        </tbody>
      </Table>
    </>
  );
}
