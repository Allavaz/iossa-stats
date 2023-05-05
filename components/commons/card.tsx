export default function Card({ children }) {
  return (
    <div className="p-5 bg-white border border-neutral-200 shadow-lg dark:bg-neutral-900 dark:border-neutral-700 rounded-lg">
      {children}
    </div>
  );
}
