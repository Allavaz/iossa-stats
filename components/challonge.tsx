export default function Challonge({ id }: { id: string }) {
  return (
    <iframe
      title="challonge"
      className="m-0 max-w-6xl border border-neutral-600 p-0 shadow-lg dark:border-neutral-700"
      src={"https://challonge.com/" + id + "/module"}
      width="100%"
      height="600"
    />
  );
}
