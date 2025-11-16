export default function Form({ results }) {
  return (
    <div className="flex justify-center gap-1 whitespace-nowrap">
      {results.map((result, index) => {
        switch (result) {
          case 1:
            return (
              <div
                className="rounded-sm bg-green-500 px-1 text-center text-white dark:bg-green-700"
                key={index}
              >
                V
              </div>
            );
          case 0:
            return (
              <div
                className="rounded-sm bg-yellow-500 px-1 text-center text-white dark:bg-yellow-700"
                key={index}
              >
                E
              </div>
            );
          case -1:
            return (
              <div
                className="rounded-sm bg-red-500 px-1 text-center text-white dark:bg-red-700"
                key={index}
              >
                D
              </div>
            );
        }
      })}
    </div>
  );
}
