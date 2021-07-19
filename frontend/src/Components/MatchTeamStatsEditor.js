import React from 'react';
import { getTeamLogo, invPercentage, percentage } from '../Utils';

function evenUpPos(value, side) {
  if (side === 'home') {
    document.getElementById('pos1').value = 100 - value;
  } else if (side === 'away') {
    document.getElementById('pos0').value = 100 - value;
  }
}

function parseValue(id, target) {
  let v = document.getElementById(id).value;
  if (v.startsWith('+')) {
    return (target + parseInt(v.replace('+', '')));
  } else if (v.startsWith('-')) {
    return (target - parseInt(v.replace('-', '')));
  } else {
    return parseInt(v);
  }
}

function inputSane(teams) {
  let a = [];
  a.push(parseValue('shots0', teams[0].statistics.shots));
  a.push(parseValue('pos0', teams[0].statistics.possession));
  a.push(parseValue('passes0', teams[0].statistics.passes));
  a.push(parseValue('fouls0', teams[0].statistics.fouls));
  a.push(parseValue('offsides0', teams[0].statistics.offsides));
  a.push(parseValue('corners0', teams[0].statistics.corners));
  a.push(parseValue('shots1', teams[1].statistics.shots));
  a.push(parseValue('pos1', teams[1].statistics.possession));
  a.push(parseValue('passes1', teams[1].statistics.passes));
  a.push(parseValue('fouls1', teams[1].statistics.fouls));
  a.push(parseValue('offsides1', teams[1].statistics.offsides));
  a.push(parseValue('corners1', teams[1].statistics.corners));
  for (let i in a) {
    if (isNaN(a[i])) {
      return false;
    }
  }
  return true;
}

export default function MatchTeamStatsEditor(props) {
  function finishEditing() {
    let teams = props.data.teams;
    if (!inputSane(teams)) {
      alert('Valor inválido. Ingrese un número, prefijado por "+" o "-" si se desea sumar o restar, respectivamente.')
    } else {
      teams[0].statistics.shots = parseValue('shots0', teams[0].statistics.shots);
      teams[0].statistics.shotsontarget = Math.round(invPercentage(parseInt(document.getElementById('shotstarget0').value), parseInt(document.getElementById('shots0').value)));
      teams[0].statistics.possession = parseValue('pos0', teams[0].statistics.possession);
      teams[0].statistics.passes = parseValue('passes0', teams[0].statistics.passes);
      teams[0].statistics.passescompleted = Math.round(invPercentage(parseInt(document.getElementById('passescomp0').value), parseInt(document.getElementById('passes0').value)));
      teams[0].statistics.fouls = parseValue('fouls0', teams[0].statistics.fouls);
      teams[0].statistics.offsides = parseValue('offsides0', teams[0].statistics.offsides);
      teams[0].statistics.corners = parseValue('corners0', teams[0].statistics.corners);
      teams[1].statistics.shots = parseValue('shots1', teams[1].statistics.shots);
      teams[1].statistics.shotsontarget = Math.round(invPercentage(parseInt(document.getElementById('shotstarget1').value), parseInt(document.getElementById('shots1').value)));
      teams[1].statistics.possession = parseValue('pos1', teams[1].statistics.possession);
      teams[1].statistics.passes = parseValue('passes1', teams[1].statistics.passes);
      teams[1].statistics.passescompleted = Math.round(invPercentage(parseInt(document.getElementById('passescomp1').value), parseInt(document.getElementById('passes1').value)));
      teams[1].statistics.fouls = parseValue('fouls1', teams[1].statistics.fouls);
      teams[1].statistics.offsides = parseValue('offsides1', teams[1].statistics.offsides);
      teams[1].statistics.corners = parseValue('corners1', teams[1].statistics.corners);
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
            <td><input id='shots0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.shots} min={0}></input></td>
            <td>Tiros</td>
            <td><input id='shots1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.shots} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='shotstarget0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={percentage(props.data.teams[0].statistics.shotsontarget, props.data.teams[0].statistics.shots)} min={0} max={100}></input> %</td>
            <td>Tiros al arco</td>
            <td><input id='shotstarget1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={percentage(props.data.teams[1].statistics.shotsontarget, props.data.teams[1].statistics.shots)} min={0} max={100}></input> %</td>
          </tr>
          <tr>
            <td><input id='pos0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.possession} min={0} max={100} onChange={e => evenUpPos(e.target.value, 'home')}></input> %</td>
            <td>Posesión</td>
            <td><input id='pos1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.possession} min={0} max={100} onChange={e => evenUpPos(e.target.value, 'away')}></input> %</td>
          </tr>
          <tr>
            <td><input id='passes0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.passes} min={0}></input></td>
            <td>Pases</td>
            <td><input id='passes1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.passes} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='passescomp0' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={percentage(props.data.teams[0].statistics.passescompleted, props.data.teams[0].statistics.passes)} min={0} max={100}></input> %</td>
            <td>Pases completados</td>
            <td><input id='passescomp1' type='number' style={{width: '5ch', textAlign: 'center'}} defaultValue={percentage(props.data.teams[1].statistics.passescompleted, props.data.teams[1].statistics.passes)} min={0} max={100}></input> %</td>
          </tr>
          <tr>
            <td><input id='fouls0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.fouls} min={0}></input></td>
            <td>Faltas</td>
            <td><input id='fouls1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.fouls} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='offsides0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.offsides} min={0}></input></td>
            <td>Offsides</td>
            <td><input id='offsides1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.offsides} min={0}></input></td>
          </tr>
          <tr>
            <td><input id='corners0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.corners} min={0}></input></td>
            <td>Córners</td>
            <td><input id='corners1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.corners} min={0}></input></td>
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
