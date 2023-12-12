export default function Table({
  children,
  sticky
}: {
  children: any;
  sticky?: boolean;
}) {
  return (
    <div
      className={`flex overflow-x-auto rounded-lg ${
        sticky ? "border-x border-t" : "border"
      } border-neutral-200 text-sm shadow-lg dark:border-neutral-700`}
    >
      <table
        className={`min-w-max grow text-center ${
          sticky ? "border-separate border-spacing-0" : ""
        }`}
      >
        {children}
      </table>
    </div>
  );
}

Table.HeaderRow = ({ children }) => {
  return (
    <tr className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {children}
    </tr>
  );
};

Table.HeaderCell = ({
  children,
  colSpan,
  sticky
}: {
  children: any;
  colSpan?: number;
  sticky?: boolean;
}) => {
  return (
    <th
      className={`border-b border-neutral-200 px-2 py-1 dark:border-neutral-700 ${
        sticky
          ? "sticky left-0 border-b border-r border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
          : ""
      }`}
      colSpan={colSpan}
    >
      {children}
    </th>
  );
};

Table.BodyRow = ({ children, sticky }: { children: any; sticky?: boolean }) => {
  return (
    <tr
      className={`border-b border-neutral-200 last:border-none odd:bg-neutral-100 even:bg-white dark:border-neutral-800 dark:odd:bg-neutral-950 dark:even:bg-neutral-900 ${
        sticky ? "group" : ""
      }`}
    >
      {children}
    </tr>
  );
};

Table.BodyCell = ({
  children,
  colSpan,
  sticky
}: {
  children: any;
  colSpan?: number;
  sticky?: boolean;
}) => {
  return (
    <td
      className={`px-2 py-1 ${
        sticky
          ? "sticky left-0 border-r border-neutral-200 shadow-lg group-odd:bg-neutral-100 group-even:bg-white dark:border-neutral-700 dark:group-odd:bg-neutral-950 dark:group-even:bg-neutral-900"
          : ""
      }`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};
