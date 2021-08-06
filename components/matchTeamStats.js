import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getTeamLogo, percentage } from "../utils/Utils";
import { useState } from "react";

export default function MatchTeamStats({ data, style, editable, setTeamStatsEditing }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div className='divDataTable' id='divStatsTable' style={style} onMouseOver={e => setHovering(true)} onMouseOut={e => setHovering(false)}>
      <table className='dataTable' id='teamstatstable'>
        <thead>
          <tr>
            <th><img height='16px' alt={data.teams[0].teamname} src={getTeamLogo(data.teams[0].teamname)}></img></th>
            <th width='250px'>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {editable ? <div style={{flex: 1}}></div> : null}
                <div style={{marginLeft: '5px', marginRight: '5px'}}>
                  ESTADÍSTICAS DEL EQUIPO
                </div>
                {editable ? <div style={{flex: 1, textAlign: 'left', marginBottom: '4px'}}>
                  <FontAwesomeIcon icon={faEdit} style={{cursor: 'pointer', opacity: hovering ? '100%' : '0%'}} onClick={e => setTeamStatsEditing(true)} />
                </div> : null}
              </div>
            </th>
            <th><img height='16px' alt={data.teams[1].teamname} src={getTeamLogo(data.teams[1].teamname)}></img></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.teams[0].statistics.shots}</td>
            <td>Tiros</td>
            <td>{data.teams[1].statistics.shots}</td>
          </tr>
          <tr>
            <td>{data.teams[0].statistics.shotsontarget}</td>
            <td>Tiros al arco</td>
            <td>{data.teams[1].statistics.shotsontarget}</td>
          </tr>
          <tr>
            <td>{data.teams[0].statistics.possession}%</td>
            <td>Posesión</td>
            <td>{data.teams[1].statistics.possession}%</td>
          </tr>
          <tr>
            <td>{data.teams[0].statistics.passes}</td>
            <td>Pases</td>
            <td>{data.teams[1].statistics.passes}</td>
          </tr>
          <tr>
            <td>{percentage(data.teams[0].statistics.passescompleted, data.teams[0].statistics.passes)}%</td>
            <td>Precisión de los pases</td>
            <td>{percentage(data.teams[1].statistics.passescompleted, data.teams[1].statistics.passes)}%</td>
          </tr>
          <tr>
            <td>{data.teams[0].statistics.fouls}</td>
            <td>Faltas</td>
            <td>{data.teams[1].statistics.fouls}</td>
          </tr>
          <tr>
            <td>{data.teams[0].statistics.yellowcards}</td>
            <td>Tarjetas amarillas</td>
            <td>{data.teams[1].statistics.yellowcards}</td>
          </tr>
          <tr>
            <td>{data.teams[0].statistics.redcards}</td>
            <td>Tarjetas rojas</td>
            <td>{data.teams[1].statistics.redcards}</td>
          </tr>
          <tr>
            <td>{data.teams[0].statistics.offsides}</td>
            <td>Offsides</td>
            <td>{data.teams[1].statistics.offsides}</td>
          </tr>
          <tr>
            <td>{data.teams[0].statistics.corners}</td>
            <td>Córners</td>
            <td>{data.teams[1].statistics.corners}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}