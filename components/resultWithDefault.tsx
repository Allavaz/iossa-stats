export default function ResultWithDefault({
  home,
  away,
  isDefault
}: {
  home: number;
  away: number;
  isDefault: boolean;
}) {
  const defaultStyle =
    "rounded border border-red-300 bg-red-500 p-1 text-xs text-white dark:border-red-600 dark:bg-red-800 w-fit m-auto";
  return (
    <div className={isDefault ? defaultStyle : ""}>
      {home} - {away}
    </div>
  );
}
