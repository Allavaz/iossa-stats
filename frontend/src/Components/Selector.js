import React from "react";
import Torneos from "../Torneos.json";

export default function Selector(props) {
  return (
    <div className="torSelect">
      <select id="selector" defaultValue={props.prop3} onChange={props.prop2}>
        {
          Torneos.map((item) => (
            <option value={item.temporada}>{item.titulo}</option>
          ))
        }
      </select>
      {
        Torneos.map((item) => (
          <div
              className={item.temporada}
              style={{ display: props.prop3 === item.temporada ? "block" : "none" }}
            >
              <div className="botonera">
                <button className="boton" onClick={() => props.prop1(item.temporada)}>
                  Totales
                </button>
                {item.torneos.map((e) => (
                  e.query === undefined ? null : 
                  <button className="boton" onClick={() => props.prop1(e.query)}>
                    {e.torneo}
                  </button>
                ))}
              </div>
            </div>
        ))
      }
    </div>
  );
}
