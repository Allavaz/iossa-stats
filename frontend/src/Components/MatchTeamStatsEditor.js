import React from 'react';
import { getTeamLogo } from '../Utils';

function evenUpPos(value, side) {
  if (side === 'home') {
    document.getElementById('pos1').value = 100 - value;
  } else if (side === 'away') {
    document.getElementById('pos0').value = 100 - value;
  }
}

export default function MatchTeamStatsEditor(props) {
  function finishEditing() {
    if ((parseInt(document.getElementById('shots0').value) < parseInt(document.getElementById('shotstarget0').value))
      || (parseInt(document.getElementById('shots1').value) < parseInt(document.getElementById('shotstarget1').value))) {
      alert('Hay menos tiros que tiros al arco.');
    } else if ((parseInt(document.getElementById('passes0').value) < parseInt(document.getElementById('passescomp0').value))
    || (parseInt(document.getElementById('passes1').value) < parseInt(document.getElementById('passescomp1').value))) {
      alert('Hay menos pases que pases completados.');
    } else {
      let teams = props.data.teams;
      teams[0].statistics.shots = parseInt(document.getElementById('shots0').value);
      teams[0].statistics.shotsontarget = parseInt(document.getElementById('shotstarget0').value);
      teams[0].statistics.possession = parseInt(document.getElementById('pos0').value);
      teams[0].statistics.passes = parseInt(document.getElementById('passes0').value);
      teams[0].statistics.passescompleted = parseInt(document.getElementById('passescomp0').value);
      teams[0].statistics.fouls = parseInt(document.getElementById('fouls0').value);
      teams[0].statistics.offsides = parseInt(document.getElementById('offsides0').value);
      teams[0].statistics.corners = parseInt(document.getElementById('corners0').value);
      teams[1].statistics.shots = parseInt(document.getElementById('shots1').value);
      teams[1].statistics.shotsontarget = parseInt(document.getElementById('shotstarget1').value);
      teams[1].statistics.possession = parseInt(document.getElementById('pos1').value);
      teams[1].statistics.passes = parseInt(document.getElementById('passes1').value);
      teams[1].statistics.passescompleted = parseInt(document.getElementById('passescomp1').value);
      teams[1].statistics.fouls = parseInt(document.getElementById('fouls1').value);
      teams[1].statistics.offsides = parseInt(document.getElementById('offsides1').value);
      teams[1].statistics.corners = parseInt(document.getElementById('corners1').value);
      props.changeTeamStats(teams);
      props.setEditing(false);
    }
  }

  return(
    <div>
      <table className='dataTable' id='teamstatstable'>
        <thead>
          <tr>
            <th><img height='16px' alt={props.data.teams[0].teamname} src={getTeamLogo(props.data.teams[0].teamname)}></img></th>
            <th width='250px'>
              <div style={{
                display: 'flex', 
                justifyContent: 'center',
                marginLeft: '20px',
              }}>
                ESTADÍSTICAS DEL EQUIPO 
              </div>
            </th>
            <th><img height='16px' alt={props.data.teams[1].teamname} src={getTeamLogo(props.data.teams[1].teamname)}></img></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input id='shots0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.shots} min={0}></input></td>
            <td>Tiros</td>
            <td><input id='shots1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.shots} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='shotstarget0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.shotsontarget} min={0}></input></td>
            <td>Tiros al arco</td>
            <td><input id='shotstarget1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.shotsontarget} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='pos0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.possession} min={0} max={100} onChange={e => evenUpPos(e.target.value, 'home')}></input> %</td>
            <td>Posesión</td>
            <td><input id='pos1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.possession} min={0} max={100} onChange={e => evenUpPos(e.target.value, 'away')}></input> %</td>
          </tr>
          <tr>
            <td><input id='passes0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.passes} min={0}></input></td>
            <td>Pases</td>
            <td><input id='passes1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.passes} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='passescomp0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.passescompleted} min={0}></input></td>
            <td>Pases completados</td>
            <td><input id='passescomp1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.passescompleted} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='fouls0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.fouls} min={0}></input></td>
            <td>Faltas</td>
            <td><input id='fouls1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.fouls} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='offsides0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.offsides} min={0}></input></td>
            <td>Offsides</td>
            <td><input id='offsides1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.offsides} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='corners0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.corners} min={0}></input></td>
            <td>Córners</td>
            <td><input id='corners1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.corners} min={0}></input></td>
          </tr>
        </tbody>
      </table>
      <div style={{marginTop: '15px', display: 'flex', justifyContent: 'flex-end'}}>
        <button className='boton' style={{marginBottom: 0, marginLeft: '10px', marginRight: 0}} onClick={e => finishEditing()}>Guardar</button>
        <button className='boton' style={{marginBottom: 0, marginLeft: '10px', marginRight: 0}} onClick={e => props.setEditing(false)}>Cancelar</button>
      </div>
    </div>
  )
}
