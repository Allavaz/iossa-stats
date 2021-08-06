import { getTeamLogo, invPercentage, percentage } from '../utils/Utils';

function evenUpPos(value, side) {
  if (side === 'home') {
    if (value.startsWith('+')) {
      document.getElementById('pos1').value = '+' + (100 - parseInt(document.getElementById('pos0').value.replace('+', '')));
    } else {
      document.getElementById('pos1').value = 100 - value;
    }
  } else if (side === 'away') {
    if (value.startsWith('+')) {
      document.getElementById('pos0').value = '+' + (100 - parseInt(document.getElementById('pos1').value.replace('+', '')));
    } else {
      document.getElementById('pos0').value = 100 - value;
    }
  }
}

function parseValue(id, target) {
  let v = document.getElementById(id).value;
  if (v.startsWith('+')) {
    let actualValue = parseInt(v.replace('+', ''));
    if (id === 'shotstarget0') {
      let shots0;
      if (document.getElementById('shots0').value.startsWith('+')) {
        shots0 = target + parseInt(document.getElementById('shots0').value.replace('+', ''));
      } else if (document.getElementById('shots0').value.startsWith('-')) {
        shots0 = target - parseInt(document.getElementById('shots0').value.replace('-', ''));
      } else {
        shots0 = parseInt(document.getElementById('shots0').value);
      }
      return (Math.round((target + invPercentage(parseInt(actualValue), shots0))/2));
    } else if (id === 'shotstarget1') {
      let shots1;
      if (document.getElementById('shots1').value.startsWith('+')) {
        shots1 = target + parseInt(document.getElementById('shots1').value.replace('+', ''));
      } else if (document.getElementById('shots1').value.startsWith('-')) {
        shots1 = target - parseInt(document.getElementById('shots1').value.replace('-', ''));
      } else {
        shots1 = parseInt(document.getElementById('shots1').value);
      }
      return (Math.round((target + invPercentage(parseInt(actualValue), shots1))/2));
    } else if (id === 'pos0' || id === 'pos1') {
      return (Math.round((target + actualValue)/2));
    } else if (id === 'passescomp0') {
      let passes0;
      if (document.getElementById('passes0').value.startsWith('+')) {
        passes0 = target + parseInt(document.getElementById('passes0').value.replace('+', ''));
      } else if (document.getElementById('passes0').value.startsWith('-')) {
        passes0 = target - parseInt(document.getElementById('passes0').value.replace('-', ''));
      } else {
        passes0 = parseInt(document.getElementById('passes0').value);
      }
      return (Math.round((target + invPercentage(parseInt(actualValue), passes0))/2));
    } else if (id === 'passescomp1') {
      let passes1;
      if (document.getElementById('passes1').value.startsWith('+')) {
        passes1 = target + parseInt(document.getElementById('passes1').value.replace('+', ''));
      } else if (document.getElementById('passes1').value.startsWith('-')) {
        passes1 = target - parseInt(document.getElementById('passes1').value.replace('-', ''));
      } else {
        passes1 = parseInt(document.getElementById('passes1').value);
      }
      return (Math.round((target + invPercentage(parseInt(actualValue), passes1))/2));
    } else {
      return (target + actualValue);
    }
  } else if (v.startsWith('-')) {
    let actualValue = parseInt(v.replace('-', ''));
    return (target - actualValue);
  } else {
    let actualValue = parseInt(v);
    if (id === 'shotstarget0') {
      let shots0;
      if (document.getElementById('shots0').value.startsWith('+')) {
        shots0 = target + parseInt(document.getElementById('shots0').value.replace('+', ''));
      } else if (document.getElementById('shots0').value.startsWith('-')) {
        shots0 = target - parseInt(document.getElementById('shots0').value.replace('-', ''));
      } else {
        shots0 = parseInt(document.getElementById('shots0').value);
      }
      return (Math.round(invPercentage(parseInt(actualValue), shots0)));
    } else if (id === 'shotstarget1') {
      let shots1;
      if (document.getElementById('shots1').value.startsWith('+')) {
        shots1 = target + parseInt(document.getElementById('shots1').value.replace('+', ''));
      } else if (document.getElementById('shots1').value.startsWith('-')) {
        shots1 = target - parseInt(document.getElementById('shots1').value.replace('-', ''));
      } else {
        shots1 = parseInt(document.getElementById('shots1').value);
      }
      return (Math.round(invPercentage(parseInt(actualValue), shots1)));
    } else if (id === 'passescomp0') {
      let passes0;
      if (document.getElementById('passes0').value.startsWith('+')) {
        passes0 = target + parseInt(document.getElementById('passes0').value.replace('+', ''));
      } else if (document.getElementById('passes0').value.startsWith('-')) {
        passes0 = target - parseInt(document.getElementById('passes0').value.replace('-', ''));
      } else {
        passes0 = parseInt(document.getElementById('passes0').value);
      }
      return (Math.round(invPercentage(parseInt(actualValue), passes0)));
    } else if (id === 'passescomp1') {
      let passes1;
      if (document.getElementById('passes1').value.startsWith('+')) {
        passes1 = target + parseInt(document.getElementById('passes1').value.replace('+', ''));
      } else if (document.getElementById('passes1').value.startsWith('-')) {
        passes1 = target - parseInt(document.getElementById('passes1').value.replace('-', ''));
      } else {
        passes1 = parseInt(document.getElementById('passes1').value);
      }
      return (Math.round(invPercentage(parseInt(actualValue), passes1)));
    } else {
      return actualValue;
    }
  }
}

function inputSane(teams) {
  let a = [];
  a.push(parseValue('shots0', teams[0].statistics.shots));
  a.push(parseValue('shotstarget0', teams[0].statistics.shotsontarget));
  a.push(parseValue('pos0', teams[0].statistics.possession));
  a.push(parseValue('passes0', teams[0].statistics.passes));
  a.push(parseValue('passescomp0', teams[0].statistics.passescompleted));
  a.push(parseValue('fouls0', teams[0].statistics.fouls));
  a.push(parseValue('offsides0', teams[0].statistics.offsides));
  a.push(parseValue('corners0', teams[0].statistics.corners));
  a.push(parseValue('shots1', teams[1].statistics.shots));
  a.push(parseValue('shotstarget1', teams[1].statistics.shotsontarget));
  a.push(parseValue('pos1', teams[1].statistics.possession));
  a.push(parseValue('passes1', teams[1].statistics.passes));
  a.push(parseValue('passescomp1', teams[1].statistics.passescompleted));
  a.push(parseValue('fouls1', teams[1].statistics.fouls));
  a.push(parseValue('offsides1', teams[1].statistics.offsides));
  a.push(parseValue('corners1', teams[1].statistics.corners));
  for (let i in a) {
    if (isNaN(a[i]) || a[i] < 0) {
      return false;
    }
  }
  return true;
}

export default function MatchTeamStatsEditor(props) {
  function finishEditing() {
    let teams = JSON.parse(JSON.stringify(props.data.teams));
    if (!inputSane(teams)) {
      alert('Valor inválido. Ingrese un número, prefijado por "+" o "-" si se desea sumar o restar, respectivamente.');
    } else {
      teams[0].statistics.shots = parseValue('shots0', teams[0].statistics.shots);
      teams[0].statistics.shotsontarget = parseValue('shotstarget0', teams[0].statistics.shotsontarget);
      teams[0].statistics.possession = parseValue('pos0', teams[0].statistics.possession);
      teams[0].statistics.passes = parseValue('passes0', teams[0].statistics.passes);
      teams[0].statistics.passescompleted = parseValue('passescomp0', teams[0].statistics.passescompleted);
      teams[0].statistics.fouls = parseValue('fouls0', teams[0].statistics.fouls);
      teams[0].statistics.offsides = parseValue('offsides0', teams[0].statistics.offsides);
      teams[0].statistics.corners = parseValue('corners0', teams[0].statistics.corners);
      teams[1].statistics.shots = parseValue('shots1', teams[1].statistics.shots);
      teams[1].statistics.shotsontarget = parseValue('shotstarget1', teams[1].statistics.shotsontarget);
      teams[1].statistics.possession = parseValue('pos1', teams[1].statistics.possession);
      teams[1].statistics.passes = parseValue('passes1', teams[1].statistics.passes);
      teams[1].statistics.passescompleted = parseValue('passescomp1', teams[1].statistics.passescompleted);
      teams[1].statistics.fouls = parseValue('fouls1', teams[1].statistics.fouls);
      teams[1].statistics.offsides = parseValue('offsides1', teams[1].statistics.offsides);
      teams[1].statistics.corners = parseValue('corners1', teams[1].statistics.corners);
      props.setTeamStatsEditing(false);
      props.changeTeamStats(teams);
    }
  }

  return (
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
            <td><input id='shots0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.shots}></input></td>
            <td>Tiros</td>
            <td><input id='shots1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.shots}></input></td>
          </tr>
          <tr>
            <td><input id='shotstarget0' type='text' maxLength={4} style={{width: '5ch', textAlign: 'center'}} defaultValue={percentage(props.data.teams[0].statistics.shotsontarget, props.data.teams[0].statistics.shots)}></input> %</td>
            <td>Tiros al arco</td>
            <td><input id='shotstarget1' type='text' maxLength={4} style={{width: '5ch', textAlign: 'center'}} defaultValue={percentage(props.data.teams[1].statistics.shotsontarget, props.data.teams[1].statistics.shots)}></input> %</td>
          </tr>
          <tr>
            <td><input id='pos0' type='text' maxLength={4} style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.possession} onChange={e => evenUpPos(e.target.value, 'home')}></input> %</td>
            <td>Posesión</td>
            <td><input id='pos1' type='text' maxLength={4} style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.possession} onChange={e => evenUpPos(e.target.value, 'away')}></input> %</td>
          </tr>
          <tr>
            <td><input id='passes0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.passes}></input></td>
            <td>Pases</td>
            <td><input id='passes1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.passes}></input></td>
          </tr>
          <tr>
            <td><input id='passescomp0' type='text' maxLength={4} style={{width: '5ch', textAlign: 'center'}} defaultValue={percentage(props.data.teams[0].statistics.passescompleted, props.data.teams[0].statistics.passes)}></input> %</td>
            <td>Precisión de los pases</td>
            <td><input id='passescomp1' type='text' maxLength={4} style={{width: '5ch', textAlign: 'center'}} defaultValue={percentage(props.data.teams[1].statistics.passescompleted, props.data.teams[1].statistics.passes)}></input> %</td>
          </tr>
          <tr>
            <td><input id='fouls0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.fouls}></input></td>
            <td>Faltas</td>
            <td><input id='fouls1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.fouls}></input></td>
          </tr>
          <tr>
            <td><input id='offsides0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.offsides}></input></td>
            <td>Offsides</td>
            <td><input id='offsides1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.offsides}></input></td>
          </tr>
          <tr>
            <td><input id='corners0' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[0].statistics.corners}></input></td>
            <td>Córners</td>
            <td><input id='corners1' type='text' style={{width: '5ch', textAlign: 'center'}} defaultValue={props.data.teams[1].statistics.corners}></input></td>
          </tr>
        </tbody>
      </table>
      <div style={{marginTop: '15px', display: 'flex', justifyContent: 'flex-end'}}>
        <button className='boton' style={{marginBottom: 0, marginLeft: '10px', marginRight: 0}} onClick={e => finishEditing()}>Guardar</button>
        <button className='boton' style={{marginBottom: 0, marginLeft: '10px', marginRight: 0}} onClick={e => props.setTeamStatsEditing(false)}>Cancelar</button>
      </div>
    </div>
  )
}
