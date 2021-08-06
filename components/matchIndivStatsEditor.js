import { useState } from 'react';
import AutocompletePlayers from './autocompletePlayers';
import { percentage, invPercentage } from '../utils/Utils';
import AutocompleteSteamIDs from './autocompleteSteamIDs';

const itemStyle = {display: 'flex', alignItems: 'center', marginRight: '20px', marginBottom: '20px'};
const inputStyle = {marginLeft: '5px'};

function parseValue(id, target) {
  let v = document.getElementById(id).value;
  if (v.startsWith('+')) {
    let actualValue = parseInt(v.replace('+', ''));
    if (id === 'passescompleted') {
      let passes;
      if (document.getElementById('passes').value.startsWith('+')) {
        passes = target + parseInt(document.getElementById('passes').value.replace('+', ''));
      } else if (document.getElementById('passes').value.startsWith('-')) {
        passes = target - parseInt(document.getElementById('passes').value.replace('-', ''));
      } else {
        passes = parseInt(document.getElementById('passes').value);
      }
      return (Math.round((target + invPercentage(parseInt(actualValue), passes))/2));
    } else if (id === 'possession') {
      return (Math.round((target + actualValue)/2));
    } else if (id === 'savescaught') {
      let saves;
      if (document.getElementById('saves').value.startsWith('+')) {
        saves = target + parseInt(document.getElementById('saves').value.replace('+', ''));
      } else if (document.getElementById('saves').value.startsWith('-')) {
        saves = target - parseInt(document.getElementById('saves').value.replace('-', ''));
      } else {
        saves = parseInt(document.getElementById('saves').value);
      }
      return (Math.round((target + invPercentage(parseInt(actualValue), saves))/2));
    } else if (id === 'shotsontarget') {
      let shots;
      if (document.getElementById('shots').value.startsWith('+')) {
        shots = target + parseInt(document.getElementById('shots').value.replace('+', ''));
      } else if (document.getElementById('shots').value.startsWith('-')) {
        shots = target - parseInt(document.getElementById('shots').value.replace('-', ''));
      } else {
        shots = parseInt(document.getElementById('shots').value);
      }
      return (Math.round((target + invPercentage(parseInt(actualValue), shots))/2));
    } else if (id === 'tacklescompleted') {
      let tackles;
      if (document.getElementById('tackles').value.startsWith('+')) {
        tackles = target + parseInt(document.getElementById('tackles').value.replace('+', ''));
      } else if (document.getElementById('tackles').value.startsWith('-')) {
        tackles = target - parseInt(document.getElementById('tackles').value.replace('-', ''));
      } else {
        tackles = parseInt(document.getElementById('tackles').value);
      }
      return (Math.round((target + invPercentage(parseInt(actualValue), tackles))/2));
    } else {
      return (target + actualValue);
    }
  } else if (v.startsWith('-')) {
    let actualValue = parseInt(v.replace('-', ''));
    return (target - actualValue);
  } else {
    let actualValue = parseInt(v);
    if (id === 'passescompleted') {
      let passes;
      if (document.getElementById('passes').value.startsWith('+')) {
        passes = target + parseInt(document.getElementById('passes').value.replace('+', ''));
      } else if (document.getElementById('passes').value.startsWith('-')) {
        passes = target - parseInt(document.getElementById('passes').value.replace('-', ''));
      } else {
        passes = parseInt(document.getElementById('passes').value);
      }
      return (Math.round(invPercentage(parseInt(actualValue), passes)));
    } else if (id === 'savescaught') {
      let saves;
      if (document.getElementById('saves').value.startsWith('+')) {
        saves = target + parseInt(document.getElementById('saves').value.replace('+', ''));
      } else if (document.getElementById('saves').value.startsWith('-')) {
        saves = target - parseInt(document.getElementById('saves').value.replace('-', ''));
      } else {
        saves = parseInt(document.getElementById('saves').value);
      }
      return (Math.round(invPercentage(parseInt(actualValue), saves)));
    } else if (id === 'shotsontarget') {
      let shots;
      if (document.getElementById('shots').value.startsWith('+')) {
        shots = target + parseInt(document.getElementById('shots').value.replace('+', ''));
      } else if (document.getElementById('shots').value.startsWith('-')) {
        shots = target - parseInt(document.getElementById('shots').value.replace('-', ''));
      } else {
        shots = parseInt(document.getElementById('shots').value);
      }
      return (Math.round(invPercentage(parseInt(actualValue), shots)));
    } else if (id === 'tacklescompleted') {
      let tackles;
      if (document.getElementById('tackles').value.startsWith('+')) {
        tackles = target + parseInt(document.getElementById('tackles').value.replace('+', ''));
      } else if (document.getElementById('tackles').value.startsWith('-')) {
        tackles = target - parseInt(document.getElementById('tackles').value.replace('-', ''));
      } else {
        tackles = parseInt(document.getElementById('tackles').value);
      }
      return (Math.round(invPercentage(parseInt(actualValue), tackles)));
    } else {
      return actualValue;
    }
  }
}

export default function MatchIndivStatsEditor(props) {
  const [playerName, setPlayerName] = useState(props.player.info.name);
  const [playerSteamId, setPlayerSteamId] = useState(props.player.info.steam_id);
  
  const changeSteamIdField = (value) => {
    setPlayerSteamId(value);
  }

  const changePlayerField = (value) => {
    setPlayerName(value);
  }

  const inputSane = () => {
    let a = [];
    a.push(parseValue('assists', props.player.statistics.assists));
    a.push(parseValue('corners', props.player.statistics.corners));
    a.push(parseValue('distancecovered', props.player.statistics.distancecovered));
    a.push(parseValue('fouls', props.player.statistics.fouls));
    a.push(parseValue('foulssuffered', props.player.statistics.foulssuffered));
    a.push(parseValue('freekicks', props.player.statistics.freekicks));
    a.push(parseValue('goalkicks', props.player.statistics.goalkicks));
    a.push(parseValue('goalsconceded', props.player.statistics.goalsconceded));
    a.push(parseValue('interceptions', props.player.statistics.interceptions));
    a.push(parseValue('offsides', props.player.statistics.offsides));
    a.push(parseValue('passes', props.player.statistics.passes));
    a.push(parseValue('passescompleted', props.player.statistics.passescompleted));
    a.push(parseValue('penalties', props.player.statistics.penalties));
    a.push(parseValue('possession', props.player.statistics.possession));
    a.push(parseValue('saves', props.player.statistics.saves));
    a.push(parseValue('savescaught', props.player.statistics.savescaught));
    a.push(parseValue('shots', props.player.statistics.shots));
    a.push(parseValue('shotsontarget', props.player.statistics.shotsontarget));
    a.push(parseValue('tackles', props.player.statistics.tackles));
    a.push(parseValue('tacklescompleted', props.player.statistics.tacklescompleted));
    a.push(parseValue('throwins', props.player.statistics.throwins));
    for (let i in a) {
      if (isNaN(a[i])) {
        return false;
      }
    }
    return true;
  }
  
  const finishEditing = () => {
    if (!inputSane()) {
      alert('Valor inválido. Ingrese un número, prefijado por "+" o "-" si se desea sumar o restar, respectivamente.');
    } else {
      if (playerName === '') {
        alert('El campo Nombre está vacío.');
      } else if (playerSteamId === '') {
        alert('El campo SteamID está vacío.');
      } else if (document.getElementById('pos').value === '') {
        alert('No hay una posición definida.');
      } else {
        let player = {
          info: {
            name: playerName,
            steam_id: playerSteamId,
            team: props.player.info.team
          },
          statistics: {
            assists: parseValue('assists', props.player.statistics.assists),
            corners: parseValue('corners', props.player.statistics.corners),
            distancecovered: parseValue('distancecovered', props.player.statistics.distancecovered),
            fouls: parseValue('fouls', props.player.statistics.fouls),
            foulssuffered: parseValue('foulssuffered', props.player.statistics.foulssuffered),
            freekicks: parseValue('freekicks', props.player.statistics.freekicks),
            goalkicks: parseValue('goalkicks', props.player.statistics.goalkicks),
            goalsconceded: parseValue('goalsconceded', props.player.statistics.goalsconceded),
            interceptions: parseValue('interceptions', props.player.statistics.interceptions),
            offsides: parseValue('offsides', props.player.statistics.offsides),
            passes: parseValue('passes', props.player.statistics.passes),
            passescompleted: parseValue('passescompleted', props.player.statistics.passescompleted),
            penalties: parseValue('penalties', props.player.statistics.penalties),
            possession: parseValue('possession', props.player.statistics.possession),
            saves: parseValue('saves', props.player.statistics.saves),
            savescaught: parseValue('savescaught', props.player.statistics.savescaught),
            shots: parseValue('shots', props.player.statistics.shots),
            shotsontarget: parseValue('shotsontarget', props.player.statistics.shotsontarget),
            tackles: parseValue('tackles', props.player.statistics.tackles),
            tacklescompleted: parseValue('tacklescompleted', props.player.statistics.tacklescompleted),
            throwins: parseValue('throwins', props.player.statistics.throwins),
            positions: props.player.statistics.positions.length === 0 ? [{position: document.getElementById('pos').value, seconds: 0}] : props.player.statistics.positions,
            redcards: props.player.statistics.redcards,
            yellowcards: props.player.statistics.yellowcards,
            owngoals: props.player.statistics.owngoals,
            goals: props.player.statistics.goals
          }
        }
        props.onChangeIndivStats(player)
      }
    }
  }

  return(
    <div id='overlay'>
      <div className='whitespace' 
        style={{
          display: 'flex', 
          flexDirection: 'column',
          position: 'absolute', 
          zIndex: 5, 
          left: 0, 
          right: 0, 
          width: '780px',
          height: '510px',
          padding: '20px', 
          top: 0, 
          bottom: 0,
          margin: 'auto'
        }}
      > 
        <h3 style={{marginTop: 0}}>{props.playerCreating ? 'CREAR' : 'EDITAR'} JUGADOR</h3>
        <h3 style={{marginTop: 0}}>INFORMACIÓN</h3>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={itemStyle}>
            <div>Nombre:</div>
            <div style={inputStyle}>
              <AutocompletePlayers defaultValue={props.player.info.name} defaultId={props.player.info.steam_id} players={props.players} onChangePlayer={{setPlayerName, setPlayerSteamId}} changeSteamIdField={changeSteamIdField} value={playerName}></AutocompletePlayers>
            </div>
          </div>
          <div style={itemStyle}>
            <div>SteamID:</div>
            <div style={inputStyle}>
              <AutocompleteSteamIDs defaultValue={props.player.info.name} defaultId={props.player.info.steam_id} players={props.players} onChangePlayer={{setPlayerName, setPlayerSteamId}} changePlayerField={changePlayerField} value={playerSteamId}></AutocompleteSteamIDs>
            </div>
          </div>
          <div style={itemStyle}>
            <div>Equipo:</div>
            <div style={inputStyle}><input type='text' disabled defaultValue={props.team} style={{width: '25ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Posición:</div>
            <div style={inputStyle}>
              <select id='pos' 
                disabled={props.player.statistics.positions.length === 0 ? false : true}
                defaultValue={props.player.statistics.positions.length === 0 ? 'GK' : props.player.statistics.positions[0].position}>
                <option value='GK'>GK</option>
                <option value='LB'>LB</option>
                <option value='RB'>RB</option>
                <option value='CB'>CB</option>
                <option value='LM'>LM</option>
                <option value='RM'>RM</option>
                <option value='CM'>CM</option>
                <option value='CF'>CF</option>
                <option value='LW'>LW</option>
                <option value='RW'>RW</option>
              </select>
            </div>
          </div>
        </div>
        <h3 style={{marginTop: 0}}>ESTADÍSTICAS</h3>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={itemStyle}>
            <div>Asistencias:</div>
            <div style={inputStyle}><input id='assists' type='text' defaultValue={props.player.statistics.assists} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tiros:</div>
            <div style={inputStyle}><input id='shots' type='text' defaultValue={props.player.statistics.shots} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tiros (al arco):</div>
            <div style={inputStyle}><input id='shotsontarget' maxLength={4} type='text' defaultValue={percentage(props.player.statistics.shotsontarget, props.player.statistics.shots)} style={{width: '5ch'}}/> %</div>
          </div>
          <div style={itemStyle}>
            <div>Pases:</div>
            <div style={inputStyle}><input id='passes' type='text' defaultValue={props.player.statistics.passes} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Pases completados:</div>
            <div style={inputStyle}><input id='passescompleted' maxLength={4} type='text' defaultValue={percentage(props.player.statistics.passescompleted, props.player.statistics.passes)} style={{width: '5ch'}}/> %</div>
          </div>
          <div style={itemStyle}>
            <div>Intercepciones:</div>
            <div style={inputStyle}><input id='interceptions' type='text' defaultValue={props.player.statistics.interceptions} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Atajadas:</div>
            <div style={inputStyle}><input id='saves' type='text' defaultValue={props.player.statistics.saves} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Atajadas (sin rebote):</div>
            <div style={inputStyle}><input id='savescaught' type='text' maxLength={4} defaultValue={percentage(props.player.statistics.savescaught, props.player.statistics.saves)} style={{width: '5ch'}}/> %</div>
          </div>
          <div style={itemStyle}>
            <div>Faltas:</div>
            <div style={inputStyle}><input id='fouls' type='text' defaultValue={props.player.statistics.fouls} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Offsides:</div>
            <div style={inputStyle}><input id='offsides' type='text' defaultValue={props.player.statistics.offsides} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Distancia recorrida:</div>
            <div style={inputStyle}><input id='distancecovered' type='text' defaultValue={props.player.statistics.distancecovered} style={{width: '8ch'}}/> m</div>
          </div>
          <div style={itemStyle}>
            <div>Posesión:</div>
            <div style={inputStyle}><input id='possession' maxLength={4} type='text' defaultValue={props.player.statistics.possession} style={{width: '5ch'}}/> %</div>
          </div>
          <div style={itemStyle}>
            <div>Córners:</div>
            <div style={inputStyle}><input id='corners' type='text' defaultValue={props.player.statistics.corners} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Laterales:</div>
            <div style={inputStyle}><input id='throwins' type='text' defaultValue={props.player.statistics.throwins} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Penales:</div>
            <div style={inputStyle}><input id='penalties' type='text' defaultValue={props.player.statistics.penalties} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tiros libres:</div>
            <div style={inputStyle}><input id='freekicks' type='text' defaultValue={props.player.statistics.freekicks} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tackles:</div>
            <div style={inputStyle}><input id='tackles' type='text' defaultValue={props.player.statistics.tackles} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tackles completados:</div>
            <div style={inputStyle}><input id='tacklescompleted' maxLength={4} type='text' defaultValue={percentage(props.player.statistics.tacklescompleted, props.player.statistics.tackles)} style={{width: '5ch'}}/> %</div>
          </div>
          <div style={itemStyle}>
            <div>Faltas sufridas:</div>
            <div style={inputStyle}><input id='foulssuffered' type='text' defaultValue={props.player.statistics.foulssuffered} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Saques de arco:</div>
            <div style={inputStyle}><input id='goalkicks' type='text' defaultValue={props.player.statistics.goalkicks} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Goles recibidos:</div>
            <div style={inputStyle}><input id='goalsconceded' type='text' defaultValue={props.player.statistics.goalsconceded} style={{width: '5ch'}}/></div>
          </div>
        </div>
        <div style={{fontSize: '0.85em', color: 'var(--header-color)'}}><i>Los goles, tarjetas amarillas y rojas se editan desde la sección de eventos.</i></div>
        <div style={{marginTop: '15px', display: 'flex', justifyContent: 'flex-end'}}>
          <button className='boton' style={{marginBottom: 0, marginLeft: '10px', marginRight: 0}} onClick={finishEditing}>Guardar</button>
          <button className='boton' style={{marginBottom: 0, marginLeft: '10px', marginRight: 0}} onClick={e => {props.setPlayerEditing(-1); props.setPlayerCreating(null)}}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}