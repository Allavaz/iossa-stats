export default function Card({ children }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      {children}
    </div>
  );
}
