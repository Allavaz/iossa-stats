import { getTeamLogo } from "../utils/Utils";

const d1color = "#fa9d41";
const d2color = "#1cc2ff";

export default function MiniPositions({ teams, header, unificada }) {
  return(
    <div>
      <h3>{header.toUpperCase()}</h3>
      <div className="divDataTable">
        <table className="dataTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((item, index) => (
            <tr key={item._id}>
              <td width="15px">{index + 1}</td>
              <td><div className="teamlogo" style={{marginLeft: unificada ? '5px' : '0px'}}>
                {unificada ? <div style={{position: 'absolute', height: '26px', width: '4px', marginLeft: '-10px', backgroundColor: index < 6 ? d1color : d2color}}></div> : null}
                <img style={{marginRight: "5px"}} width='16px' height="16px" src={getTeamLogo(item._id)} alt={item._id} />
                <div id="fullteamname">{item._id}</div>
              </div></td>
              <td width="15px">{item.PJ}</td>
              <td width="15px">{item.Pts}</td>
            </tr>
          ))}
          {unificada ? 
            <>
              <tr>
                <td colSpan="4">
                  <div className="teamlogo" style={{marginLeft: '5px'}}>
                    <div style={{position: 'absolute', height: '25px', width: '4px', marginLeft: '-10px', backgroundColor: d1color}}></div>
                    Clasifica a Liga D1
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="4">
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
  )
}