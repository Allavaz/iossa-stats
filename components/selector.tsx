"use client";

import { useRouter } from "next/navigation";
import Torneos from "../utils/Torneos.json";
import Button from "./commons/button";
import Select from "./commons/select";

export default function Selector({ context, temporada }) {
  const router = useRouter();

  const selectTorneo = (context: string, torneo: string) => {
    router.push(`/${context}/${torneo}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Select
        defaultValue={temporada}
        onChange={e => selectTorneo(context, e.target.value)}
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
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => selectTorneo(context, item.temporada)}>
                Totales
              </Button>
              {item.torneos.map(
                (e, i) =>
                  e.query && (
                    <Button
                      key={i}
                      onClick={() => selectTorneo(context, e.query)}
                    >
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
