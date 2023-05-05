import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
  fecha,
  getTeamLogo,
  getTeamShortname,
  getTournamentIcon
} from "../utils/Utils";
import Title from "./commons/title";
import Button from "./commons/button";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Match } from "../types";

interface Props {
  matches: Match[];
  category: string;
  pagina: number;
}

export default function Results(props: Props) {
  const router = useRouter();
  const columnHelper = createColumnHelper<Match>();

  const columns = [
    columnHelper.accessor("fecha", {
      header: "Fecha",
      cell: info => (
        <Link href={"/partido/" + info.row.original._id}>
          <a>{fecha(info.getValue())}</a>
        </Link>
      ),
      enableGlobalFilter: false
    }),
    columnHelper.accessor(row => row.teams[0].teamname, {
      id: "home",
      header: "Local",
      cell: info => (
        <Link href={`/equipo/${info.getValue()}`}>
          <a className="flex items-center gap-x-1 justify-center">
            <img
              src={getTeamLogo(info.getValue())}
              alt={info.getValue()}
              className="h-6"
            />
            <div className="hidden sm:block">{info.getValue()}</div>
            <div className="sm:hidden">{getTeamShortname(info.getValue())}</div>
          </a>
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
            <a>{info.getValue()}</a>
          </Link>
        )
      }
    ),
    columnHelper.accessor(row => row.teams[1].teamname, {
      id: "away",
      header: "Visitante",
      cell: info => (
        <Link href={`/equipo/${info.getValue()}`}>
          <a className="flex items-center gap-x-1 justify-center">
            <img
              src={getTeamLogo(info.getValue())}
              alt={info.getValue()}
              className="h-6"
            />
            <div className="hidden sm:block">{info.getValue()}</div>
            <div className="sm:hidden">{getTeamShortname(info.getValue())}</div>
          </a>
        </Link>
      )
    }),
    columnHelper.accessor("torneo", {
      header: "Torneo",
      cell: info => (
        <Link href={"/partido/" + info.row.original._id}>
          <a className="flex items-center gap-x-1 justify-center">
            <img
              src={getTournamentIcon(info.getValue())}
              alt={info.getValue()}
              className="h-6"
            />
            <div className="hidden sm:block">{info.getValue()}</div>
          </a>
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
      <div className="flex gap-2 items-center flex-wrap">
        <Title style={{ display: "inline", width: "fit-content" }}>
          Resultados - {props.category}
        </Title>
        <input
          type="text"
          placeholder="Buscar equipo/torneo…"
          onChange={e => {
            table.setGlobalFilter(e.target.value);
            router.push(router.asPath.split("?")[0], undefined, {
              shallow: true
            });
          }}
          className="p-1 border shadow-lg border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-700"
        />
      </div>
      <div className="shadow-lg overflow-x-auto flex rounded-lg border border-neutral-200 dark:border-neutral-700">
        {table.getPrePaginationRowModel().rows.length === 0 ? (
          <div className="p-1 border-l border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950 text-left text-neutral-500 dark:text-neutral-400 italic">
            No hay partidos
          </div>
        ) : null}
        <table className="grow min-w-max text-center text-sm border-neutral-200 dark:border-neutral-700 overflow-x-auto">
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                className="even:bg-neutral-100 dark:even:bg-neutral-900 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-700"
                key={row.id}
              >
                {row.getVisibleCells().map(cell => (
                  <td className="py-1 px-2" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-x-4 justify-center">
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={e => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set(
              "page",
              table.getState().pagination.pageIndex.toString()
            );
            router.push(
              router.asPath.split("?")[0] + "?" + queryParams.toString(),
              undefined,
              {
                shallow: true
              }
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
          <div className="text-neutral-500 text-sm">
            {table.getPrePaginationRowModel().rows.length} resultado
            {table.getPrePaginationRowModel().rows.length !== 1 ? "s" : ""}
          </div>
        </div>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={e => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set(
              "page",
              (table.getState().pagination.pageIndex + 2).toString()
            );
            router.push(
              router.asPath.split("?")[0] + "?" + queryParams.toString(),
              undefined,
              {
                shallow: true
              }
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
