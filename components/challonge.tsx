export default function Challonge({ id }: { id: string }) {
  return (
    <iframe
      title="challonge"
      className="p-0 m-0 max-w-6xl border border-neutral-600 dark:border-neutral-700 shadow-lg"
      src={"https://challonge.com/" + id + "/module"}
      width="100%"
      height="600"
    />
  );
}
