export default function Form({ results }) {
  return (
    <div className="flex justify-center whitespace-nowrap">
      {results.map((result, index) => {
        switch (result) {
          case 1:
            return (
              <div
                className="text-center"
                key={index}
                style={{ color: "green", width: "1.8ch" }}
              >
                W
              </div>
            );
          case 0:
            return (
              <div
                className="text-center"
                key={index}
                style={{ color: "gold", width: "1.8ch" }}
              >
                D
              </div>
            );
          case -1:
            return (
              <div
                className="text-center"
                key={index}
                style={{ color: "red", width: "1.8ch" }}
              >
                L
              </div>
            );
        }
      })}
    </div>
  );
}
