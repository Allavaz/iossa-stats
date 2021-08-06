import { getTeamLogo, getTeamShortname, plus } from "../utils/Utils";

const d1color = "#fa9d41";
const d2color = "#1cc2ff";

export default function FullPositions({ teams, torneo, unificada, style }) {
  return (
    <div style={style}>
      <h3>POSICIONES {torneo.toUpperCase()}</h3>
      <div className='divDataTable'>
        <table className='dataTable'>
          <thead>
            <tr>
              <th width='15px'>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>Pts</th>
              <th>GF</th>
              <th>GC</th>
              <th>PG</th>
              <th>PE</th>
              <th>PP</th>
              <th>DF</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>
                <div className='teamlogo' style={{marginLeft: unificada ? '5px' : '0px'}}>
                  {unificada ? <div style={{position: 'absolute', height: '26px', width: '4px', marginLeft: '-10px', backgroundColor: index < 6 ? d1color : d2color}}></div> : null}
                  <img height='16px' src={getTeamLogo(item._id)} alt={item._id} style={{marginRight: '5px'}} />
                  <div id='teamname'>{item._id}</div><div id='shortname'>{getTeamShortname(item._id)}</div>
                </div>
              </td>
              <td>{item.PJ}</td>
              <td>{item.Pts}</td>
              <td>{item.GF}</td>
              <td>{item.GC}</td>
              <td>{item.PG}</td>
              <td>{item.PE}</td>
              <td>{item.PP}</td>
              <td>{plus(item.DF)}</td>
            </tr>
            ))}
            {unificada ? 
            <>
              <tr>
                <td colSpan="10">
                  <div className="teamlogo" style={{marginLeft: '5px'}}>
                    <div style={{position: 'absolute', height: '25px', width: '4px', marginLeft: '-10px', backgroundColor: d1color}}></div>
                    Clasifica a Liga D1
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="10">
                  <div className="teamlogo" style={{marginLeft: '5px'}}>
                    <div style={{position: 'absolute', height: '25px', width: '4px', marginLeft: '-10px', backgroundColor: d2color}}></div>
                    Clasifica a Liga D2
                  </div>
                </td>
              </tr>
            </>
            : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}