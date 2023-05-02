import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
      ),
      enablePinning: true
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
      header: () => "Partidos",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("wins", {
      header: () => "Victorias",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("losses", {
      header: () => "Derrotas",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("draws", {
      header: () => "Empates",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("goals", {
      header: () => "Goles",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("assists", {
      header: () => "Asistencias",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("secondassists", {
      header: () => "Segundas asistencias",
      cell: info => info.getValue()
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
      header: () => "Pases clave",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("passescompleted", {
      header: () => "Precisión de pases",
      cell: info =>
        `${Math.round(
          (info.row.original.passescompleted * 100) / info.row.original.passes
        )}%`
    }),
    columnHelper.accessor("interceptions", {
      header: () => "Intercepciones",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("saves", {
      header: () => "Atajadas (sin rebote)",
      cell: info => `${info.getValue()} (${info.row.original.savescaught})`
    }),
    columnHelper.accessor("fouls", {
      header: () => "Faltas",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("yellowcards", {
      header: () => "Tarjetas amarillas",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("redcards", {
      header: () => "Tarjetas rojas",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("owngoals", {
      header: () => "Goles en contra",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("offsides", {
      header: () => "Offsides",
      cell: info => info.getValue()
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
      header: () => "Córners",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("throwins", {
      header: () => "Laterales",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("penalties", {
      header: () => "Penales",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("freekicks", {
      header: () => "Tiros libres",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("tackles", {
      header: () => "Tackles (completados)",
      cell: info => `${info.getValue()} (${info.row.original.tacklescompleted})`
    }),
    columnHelper.accessor("foulssuffered", {
      header: () => "Faltas recibidas",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("goalkicks", {
      header: () => "Saques de arco",
      cell: info => info.getValue()
    }),
    columnHelper.accessor("chancescreated", {
      header: () => "Ocasiones creadas",
      cell: info => info.getValue()
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
    initialState: {
      pagination: {
        pageIndex: props.pagina,
        pageSize: 15
      },
      columnPinning: {
        left: ["name"]
      }
    },
    enablePinning: true
  });

  return (
    <div className="flex flex-col gap-y-4">
      <Title>Estadísticas Individuales - {props.category}</Title>
      <div className="shadow-lg overflow-x-auto flex border-t border-r border-neutral-200 dark:border-neutral-700">
        <table className="min-w-max text-center text-sm border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr className="dark:bg-neutral-900 bg-white" key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    className="py-1 px-2 border-l border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    key={header.id}
                    style={
                      header.id === "name"
                        ? {
                            position: "sticky",
                            left: 0,
                            borderRightWidth: "1px"
                          }
                        : {}
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                className="even:bg-neutral-100 dark:even:bg-neutral-900 dark:bg-neutral-950 group"
                key={row.id}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    className="py-1 px-2 border-l border-b border-neutral-200 dark:border-neutral-700 group-even:bg-white dark:group-even:bg-neutral-900 group-odd:bg-neutral-100 dark:group-odd:bg-neutral-950"
                    key={cell.id}
                    style={
                      cell.column.id === "name"
                        ? {
                            position: "sticky",
                            left: 0,
                            borderRightWidth: "1px"
                          }
                        : {}
                    }
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
            {table.getPageCount()}
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
    </div>
  );
}
