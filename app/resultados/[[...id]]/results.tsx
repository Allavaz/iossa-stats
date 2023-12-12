"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  fecha,
  getTeamLogo,
  getTeamShortname,
  getTournamentIcon
} from "../../../utils/Utils";
import Title from "../../../components/ui/title";
import Button from "../../../components/ui/button";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Match } from "../../../types";
import Table from "../../../components/ui/table";
import DefaultIndicator from "../../../components/defaultIndicator";

interface Props {
  matches: Match[];
  category: string;
  pagina: number;
}

export default function Results(props: Props) {
  const pathname = usePathname();
  const columnHelper = createColumnHelper<Match>();

  const columns = [
    columnHelper.accessor("fecha", {
      header: "Fecha",
      cell: info => (
        <Link href={"/partido/" + info.row.original._id}>
          {fecha(info.getValue())}
        </Link>
      ),
      enableGlobalFilter: false
    }),
    columnHelper.accessor(row => row.teams[0].teamname, {
      id: "home",
      header: "Local",
      cell: info => (
        <Link
          href={`/equipo/${info.getValue()}`}
          className="flex items-center justify-end gap-x-1"
        >
          <div className="hidden sm:block">{info.getValue()}</div>
          <div className="sm:hidden">{getTeamShortname(info.getValue())}</div>
          <img
            src={getTeamLogo(info.getValue())}
            alt={info.getValue()}
            className="h-6"
          />
        </Link>
      )
    }),
    columnHelper.accessor(
      row => {
        const scoreHome = row.teams[0].score;
        const scoreAway = row.teams[1].score;
        return `${scoreHome} - ${scoreAway}`;
      },
      {
        id: "score",
        header: "Resultado",
        enableGlobalFilter: false,
        cell: info => (
          <Link href={"/partido/" + info.row.original._id}>
            <div className="flex flex-col gap-1">
              {info.getValue()}
              {info.row.original.isdefault && <DefaultIndicator />}
            </div>
          </Link>
        )
      }
    ),
    columnHelper.accessor(row => row.teams[1].teamname, {
      id: "away",
      header: "Visitante",
      cell: info => (
        <Link
          href={`/equipo/${info.getValue()}`}
          className="flex items-center justify-start gap-x-1"
        >
          <img
            src={getTeamLogo(info.getValue())}
            alt={info.getValue()}
            className="h-6"
          />
          <div className="hidden sm:block">{info.getValue()}</div>
          <div className="sm:hidden">{getTeamShortname(info.getValue())}</div>
        </Link>
      )
    }),
    columnHelper.accessor("torneo", {
      header: "Torneo",
      cell: info => (
        <Link
          href={"/partido/" + info.row.original._id}
          className="flex items-center justify-center gap-x-1"
        >
          <img
            src={getTournamentIcon(info.getValue())}
            alt={info.getValue()}
            className="h-6"
          />
          <div className="hidden sm:block">{info.getValue()}</div>
        </Link>
      )
    })
  ];

  const table = useReactTable({
    data: props.matches,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: props.pagina,
        pageSize: 15
      }
    }
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Title style={{ display: "inline", width: "fit-content" }}>
          Resultados - {props.category}
        </Title>
        <input
          type="text"
          placeholder="Buscar equipo/torneo…"
          onChange={e => {
            table.setGlobalFilter(e.target.value);
            history.replaceState(null, "", pathname.split("?")[0]);
          }}
          className="rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <Table>
        {table.getPrePaginationRowModel().rows.length === 0 ? (
          <div className="border-b border-l border-neutral-200 bg-neutral-100 p-1 text-left italic text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400">
            No hay partidos
          </div>
        ) : null}
        <tbody>
          {table.getRowModel().rows.map(row => (
            <Table.BodyRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <Table.BodyCell key={cell.id}>
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
