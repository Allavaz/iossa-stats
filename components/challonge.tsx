export default function Challonge({ id }: { id: string }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-neutral-200 shadow-lg dark:border-neutral-700">
      <iframe
        title="challonge"
        className="m-0 max-w-6xl"
        src={"https://challonge.com/" + id + "/module"}
        width="100%"
        height="600"
      />
    </div>
  );
}
