import Torneos from "../utils/Torneos.json";
import Button from "./commons/button";
import Select from "./commons/select";

export default function Selector({ selectTorneo, selectTemporada, temporada }) {
  return (
    <div className="flex flex-col gap-y-2">
      <Select
        defaultValue={temporada}
        onChange={e => selectTemporada(e.target.value)}
      >
        {Torneos.map((item, index) => (
          <option key={index} value={item.temporada}>
            {item.titulo}
          </option>
        ))}
      </Select>
      {Torneos.map((item, index) => (
        <div
          className={item.temporada}
          key={index}
          style={{ display: temporada === item.temporada ? "block" : "none" }}
        >
          {item.torneos.length > 1 && (
            <div className="flex flex-wrap gap-x-2">
              <Button onClick={() => selectTorneo(item.temporada)}>
                Totales
              </Button>
              {item.torneos.map(
                (e, i) =>
                  e.query && (
                    <Button key={i} onClick={() => selectTorneo(e.query)}>
                      {e.torneo}
                    </Button>
                  )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
