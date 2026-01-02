"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { secondsToMinutes } from "../../../lib/Utils";
import { Player } from "../../../types";
import { getTeamLogo } from "../../../utils/Utils";
import Button from "../../../components/ui/button";
import Table from "../../../components/ui/table";
import Title from "../../../components/ui/title";

interface Props {
  players: Player[];
  category: string;
  pagina: number;
}

export default function IndividualStats(props: Props) {
  const pathname = usePathname();
  const columnHelper = createColumnHelper<Player>();

  const columns = [
    columnHelper.accessor("name", {
      header: () => "Nombre",
      cell: info => (
        <Link href={"/jugador/" + info.row.original._id}>
          {info.getValue()}
        </Link>
      )
    }),
    columnHelper.accessor("team", {
      header: () => "Equipo",
      cell: info => (
        <Link
          href={"/equipo/" + info.getValue()}
          className="flex items-center justify-center gap-x-1"
        >
          <img
            className="h-6"
            src={getTeamLogo(info.getValue())}
            alt={info.getValue()}
          />
          <div>{info.getValue()}</div>
        </Link>
      )
    }),
    columnHelper.accessor("matches", {
      header: () => "Partidos"
    }),
    columnHelper.accessor("wins", {
      header: () => "Victorias"
    }),
    columnHelper.accessor("draws", {
      header: () => "Empates"
    }),
    columnHelper.accessor("losses", {
      header: () => "Derrotas"
    }),
    columnHelper.accessor("goals", {
      header: () => "Goles"
    }),
    columnHelper.accessor("assists", {
      header: () => "Asistencias"
    }),
    columnHelper.accessor("secondassists", {
      header: () => "Segundas asistencias"
    }),
    columnHelper.accessor("shots", {
      header: () => "Tiros (al arco)",
      cell: info => `${info.getValue()} (${info.row.original.shotsontarget})`
    }),
    columnHelper.accessor("passes", {
      header: () => "Pases (completados)",
      cell: info => `${info.getValue()} (${info.row.original.passescompleted})`
    }),
    columnHelper.accessor("keypasses", {
      header: () => "Pases clave"
    }),
    columnHelper.accessor("passescompleted", {
      header: () => "Precisión de pases",
      cell: info =>
        `${Math.round(
          (info.row.original.passescompleted * 100) / info.row.original.passes
        )}%`
    }),
    columnHelper.accessor("interceptions", {
      header: () => "Intercepciones"
    }),
    columnHelper.accessor("saves", {
      header: () => "Atajadas (sin rebote)",
      cell: info => `${info.getValue()} (${info.row.original.savescaught})`
    }),
    columnHelper.accessor("fouls", {
      header: () => "Faltas"
    }),
    columnHelper.accessor("yellowcards", {
      header: () => "Tarjetas amarillas"
    }),
    columnHelper.accessor("redcards", {
      header: () => "Tarjetas rojas"
    }),
    columnHelper.accessor("owngoals", {
      header: () => "Goles en contra"
    }),
    columnHelper.accessor("offsides", {
      header: () => "Offsides"
    }),
    columnHelper.accessor("distancecovered", {
      header: () => "Prom. distancia recorrida",
      cell: info => `${(info.getValue() / 1000).toPrecision(4)} km`
    }),
    columnHelper.accessor("possession", {
      header: () => "Prom. posesión",
      cell: info => `${Math.round(info.getValue())}%`
    }),
    columnHelper.accessor("corners", {
      header: () => "Córners"
    }),
    columnHelper.accessor("throwins", {
      header: () => "Laterales"
    }),
    columnHelper.accessor("penalties", {
      header: () => "Penales"
    }),
    columnHelper.accessor("freekicks", {
      header: () => "Tiros libres"
    }),
    columnHelper.accessor("tackles", {
      header: () => "Tackles (completados)",
      cell: info => `${info.getValue()} (${info.row.original.tacklescompleted})`
    }),
    columnHelper.accessor("foulssuffered", {
      header: () => "Faltas recibidas"
    }),
    columnHelper.accessor("goalkicks", {
      header: () => "Saques de arco"
    }),
    columnHelper.accessor("goalsconceded", {
      header: () => "Goles recibidos"
    }),
    columnHelper.accessor("chancescreated", {
      header: () => "Ocasiones creadas"
    }),
    columnHelper.accessor("secondsplayed", {
      header: () => "Tiempo jugado total",
      cell: info => secondsToMinutes(info.getValue())
    })
  ];

  const table = useReactTable({
    data: props.players,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageIndex: props.pagina,
        pageSize: 15
      }
    }
  });

  return (
    <>
      <Title>Estadísticas Individuales - {props.category}</Title>
      <Table sticky>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.HeaderRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Table.HeaderCell
                  key={header.id}
                  sticky={header.column.id == "name"}
                >
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
          <Table.HeaderRow>
            <Table.HeaderCell sticky>
              <input
                className="w-32 bg-neutral-100 p-1 text-center font-normal dark:bg-neutral-900 sm:w-max"
                placeholder="Buscar jugador…"
                onChange={e =>
                  table.getColumn("name").setFilterValue(e.target.value)
                }
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <input
                className="bg-neutral-100 p-1 text-center font-normal dark:bg-neutral-900"
                placeholder="Buscar equipo…"
                onChange={e =>
                  table.getColumn("team").setFilterValue(e.target.value)
                }
              />
            </Table.HeaderCell>
            <Table.HeaderCell colSpan={columns.length - 2}>
              {table.getPrePaginationRowModel().rows.length === 0 && (
                <div className="text-left font-normal italic text-neutral-500 dark:text-neutral-400">
                  No hay jugadores
                </div>
              )}
            </Table.HeaderCell>
          </Table.HeaderRow>
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <Table.BodyRow sticky key={row.id}>
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
      <div className="flex justify-center gap-x-4">
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={_ => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set(
              "page",
              table.getState().pagination.pageIndex.toString()
            );
            history.replaceState(
              null,
              "",
              pathname.split("?")[0] + "?" + queryParams.toString()
            );
            table.previousPage();
          }}
        >
          Anterior
        </Button>
        <div className="flex flex-col items-center">
          <div>
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {Math.max(table.getPageCount(), 1)}
          </div>
          <div className="text-sm text-neutral-500">
            {table.getPrePaginationRowModel().rows.length} resultado
            {table.getPrePaginationRowModel().rows.length !== 1 ? "s" : ""}
          </div>
        </div>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={_ => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set(
              "page",
              (table.getState().pagination.pageIndex + 2).toString()
            );
            history.replaceState(
              null,
              "",
              pathname.split("?")[0] + "?" + queryParams.toString()
            );
            table.nextPage();
          }}
        >
          Siguiente
        </Button>
      </div>
    </>
  );
}
