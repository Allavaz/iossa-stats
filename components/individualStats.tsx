import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import Link from "next/link";
import { getTeamLogo } from "../utils/Utils";
import { secondsToMinutes } from "../lib/Utils";
import Title from "./commons/title";
import Button from "./commons/button";
import { Player } from "../types";

interface Props {
  players: Player[];
  category: string;
  pagina: number;
}

export default function IndividualStats(props: Props) {
  const router = useRouter();
  const columnHelper = createColumnHelper<Player>();

  const columns = [
    columnHelper.accessor("name", {
      header: () => "Nombre",
      cell: info => (
        <Link href={"/jugador/" + info.row.original._id}>
          <a>{info.getValue()}</a>
        </Link>
      )
    }),
    columnHelper.accessor("team", {
      header: () => "Equipo",
      cell: info => (
        <Link href={"/equipo/" + info.getValue()}>
          <a className="flex items-center justify-center gap-x-1">
            <img
              className="h-6"
              src={getTeamLogo(info.getValue())}
              alt={info.getValue()}
            />
            <div>{info.getValue()}</div>
          </a>
        </Link>
      )
    }),
    columnHelper.accessor("matches", {
      header: () => "Partidos"
    }),
    columnHelper.accessor("wins", {
      header: () => "Victorias"
    }),
    columnHelper.accessor("losses", {
      header: () => "Derrotas"
    }),
    columnHelper.accessor("draws", {
      header: () => "Empates"
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
    columnHelper.accessor("chancescreated", {
      header: () => "Ocasiones creadas"
    }),
    columnHelper.accessor("secondsplayed", {
      header: () => "Tiempo jugado total",
      cell: info => `${Math.ceil(info.getValue() / 60)}'`
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
      <div className="shadow-lg overflow-x-auto flex border-t border-x border-neutral-200 dark:border-neutral-700 rounded-lg">
        <table className="min-w-max text-center text-sm border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr className="dark:bg-neutral-900 bg-white" key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    className={`py-1 px-2 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 ${
                      header.id === "name" ? "sticky left-0 border-r" : ""
                    }`}
                    key={header.id}
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <tr>
              <td className="sticky left-0 border-r border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950">
                <input
                  className="p-1 text-center bg-neutral-100 dark:bg-neutral-950"
                  placeholder="Buscar jugador…"
                  onChange={e =>
                    table.getColumn("name").setFilterValue(e.target.value)
                  }
                />
              </td>
              <td className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950">
                <input
                  className="p-1 text-center bg-neutral-100 dark:bg-neutral-950"
                  placeholder="Buscar equipo…"
                  onChange={e =>
                    table.getColumn("team").setFilterValue(e.target.value)
                  }
                />
              </td>
              <td
                className="p-1 border-l border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950 text-left text-neutral-500 dark:text-neutral-400 italic"
                colSpan={columns.length - 2}
              >
                {table.getPrePaginationRowModel().rows.length === 0 &&
                  "No hay jugadores"}
              </td>
            </tr>
            {table.getRowModel().rows.map(row => (
              <tr
                className="even:bg-neutral-100 dark:even:bg-neutral-900 dark:bg-neutral-950 group"
                key={row.id}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    className={`py-1 px-2 border-neutral-200 dark:border-neutral-700 group-even:bg-white dark:group-even:bg-neutral-900 group-odd:bg-neutral-100 dark:group-odd:bg-neutral-950 ${
                      cell.column.id === "name" ? "sticky left-0 border-r" : ""
                    }`}
                    key={cell.id}
                  >
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
