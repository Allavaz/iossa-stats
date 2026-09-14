"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import Link from "next/link";
import Table from "../../../components/ui/table";
import Title from "../../../components/ui/title";
import { secondsToMinutes } from "../../../lib/Utils";
import { MatchPlayer } from "../../../types";

export default function MatchIndividualStats(props) {
  const columnHelper = createColumnHelper<MatchPlayer>();

  const columns = [
    columnHelper.accessor(row => row.info.name, {
      id: "name",
      header: "Jugador",
      cell: info => (
        <div className="flex items-center justify-center gap-x-1">
          <Link href={"/jugador/" + info.row.original.info.steam_id}>
            {info.getValue()}
          </Link>
        </div>
      )
    }),
    columnHelper.accessor(row => row.statistics.positions[0]?.position, {
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
    columnHelper.accessor(row => row.statistics.expectedgoals, {
      id: "expectedgoals",
      header: "Goles esperados",
      cell: info => `${(info.getValue() / 100).toFixed(2)}`
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
        <div className="flex items-center gap-x-2">
          <Title style={{ display: "inline", width: "fit-content" }}>
            Estadísticas Individuales - {props.teamName}
          </Title>
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
