import Torneos from '../utils/Torneos.json';

export default function Selector({selectTorneo, selectTemporada, temporada}) {
  return (
    <div className="torSelect">
      <select id="selector" defaultValue={temporada} onChange={(e) => selectTemporada(e.target.value)}>
        {Torneos.map((item, index) => (
          <option key={index} value={item.temporada}>{item.titulo}</option>
        ))}
      </select>
      {
        Torneos.map((item, index) => (
          <div
            className={item.temporada}
            key={index}
            style={{ display: temporada === item.temporada ? "block" : "none" }}
          >
            <div className="botonera">
              <button className="boton" onClick={() => selectTorneo(item.temporada)}>
                Totales
              </button>
              {item.torneos.map((e, i) => (
                e.query === undefined ? null : 
                <button className="boton" key={i} onClick={() => selectTorneo(e.query)}>
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