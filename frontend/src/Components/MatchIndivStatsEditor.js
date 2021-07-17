import React, { useState } from 'react';
import AutocompletePlayers from './AutocompletePlayers';

const itemStyle = {display: 'flex', alignItems: 'center', marginRight: '20px', marginBottom: '20px'};
const inputStyle = {marginLeft: '5px'};

export default function MatchIndivStatsEditor(props) {
  const [playerName, setPlayerName] = useState(props.player.info.name);
  const [playerSteamId, setPlayerSteamId] = useState(props.player.info.steam_id);

  const changeSteamIdField = (value) => {
    document.getElementById('steamid').value = value;
  }

  const finishEditing = () => {
    if (document.getElementById('shots').value < document.getElementById('shotsontarget').value) {
      alert('Hay menos tiros que tiros al arco.');
    } else if (document.getElementById('passes').value < document.getElementById('passescompleted').value) {
      alert('Hay menos pases que pases completados.');
    } else if (document.getElementById('tackles').value < document.getElementById('tacklescompleted').value) {
      alert('Hay menos tackles que tackles completados.');
    } else if (document.getElementById('saves').value < document.getElementById('savescaught').value) {
      alert('Hay menos atajadas que atajadas sin rebote.');
    } else if ((props.playerCreating && playerName === '') || (!props.playerCreating && document.getElementById('name').value === '')) {
      alert('El campo Nombre está vacío.');
    } else if (props.playerCreating && playerSteamId === '') {
      alert('El campo SteamID está vacío.');
    } else if (document.getElementById('pos').value === '') {
      alert('No hay una posición definida.');
    } else {
      let player = {
        info: {
          name: props.playerCreating ? playerName : document.getElementById('name').value,
          steam_id: props.playerCreating ? playerSteamId : props.player.info.steam_id,
          team: props.player.info.team
        },
        statistics: {
          assists: parseInt(document.getElementById('assists').value),
          corners: parseInt(document.getElementById('corners').value),
          distancecovered: parseInt(document.getElementById('distancecovered').value),
          fouls: parseInt(document.getElementById('fouls').value),
          foulssuffered: parseInt(document.getElementById('foulssuffered').value),
          freekicks: parseInt(document.getElementById('freekicks').value),
          goalkicks: parseInt(document.getElementById('goalkicks').value),
          goalsconceded: parseInt(document.getElementById('goalsconceded').value),
          interceptions: parseInt(document.getElementById('interceptions').value),
          offsides: parseInt(document.getElementById('offsides').value),
          passes: parseInt(document.getElementById('passes').value),
          passescompleted: parseInt(document.getElementById('passescompleted').value),
          penalties: parseInt(document.getElementById('penalties').value),
          saves: parseInt(document.getElementById('saves').value),
          savescaught: parseInt(document.getElementById('savescaught').value),
          secondsplayed: parseInt(props.player.statistics.secondsplayed),
          shots: parseInt(document.getElementById('shots').value),
          shotsontarget: parseInt(document.getElementById('shotsontarget').value),
          tackles: parseInt(document.getElementById('tackles').value),
          tacklescompleted: parseInt(document.getElementById('tacklescompleted').value),
          throwins: parseInt(document.getElementById('throwins').value),
          positions: props.player.statistics.positions.length === 0 ? [{position: document.getElementById('pos').value, seconds: 0}] : props.player.statistics.positions,
          possession: props.player.statistics.possession,
          redcards: props.player.statistics.redcards,
          yellowcards: props.player.statistics.yellowcards,
          owngoals: props.player.statistics.owngoals,
          goals: props.player.statistics.goals
        }
      }
      props.onChangeIndivStats(player)
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
          height: '470px',
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
              {props.playerCreating ? <AutocompletePlayers defaultValue={props.player.info.name} defaultId={props.player.info.steam_id} players={props.players} onChangePlayer={{setPlayerName, setPlayerSteamId}} changeSteamIdField={changeSteamIdField}></AutocompletePlayers> :
              <input id='name' type='text' defaultValue={props.player.info.name} placeholder='Nombre' style={{width: '160px'}}/>}
            </div>
          </div>
          <div style={itemStyle}>
            <div>SteamID:</div>
            <div style={inputStyle}>
              <input id='steamid' type='text' disabled={props.playerCreating ? false : true} defaultValue={props.player.info.steam_id} placeholder='SteamID' style={{width: '20ch'}} onChange={e => setPlayerSteamId(e.target.value.trim())} />
            </div>
          </div>
          <div style={itemStyle}>
            <div>Equipo:</div>
            <div style={inputStyle}><input type='text' disabled defaultValue={props.team.teamname} style={{width: '25ch'}}/></div>
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
            <div style={inputStyle}><input id='assists' type='number' defaultValue={props.player.statistics.assists} min={0} max={props.team.score} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tiros:</div>
            <div style={inputStyle}><input id='shots' type='number' defaultValue={props.player.statistics.shots} min={props.player.statistics.goals} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tiros (al arco):</div>
            <div style={inputStyle}><input id='shotsontarget' type='number' defaultValue={props.player.statistics.shotsontarget} min={props.player.statistics.goals} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Pases:</div>
            <div style={inputStyle}><input id='passes' type='number' defaultValue={props.player.statistics.passes} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Pases completados:</div>
            <div style={inputStyle}><input id='passescompleted' type='number' defaultValue={props.player.statistics.passescompleted} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Intercepciones:</div>
            <div style={inputStyle}><input id='interceptions' type='number' defaultValue={props.player.statistics.interceptions} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Atajadas:</div>
            <div style={inputStyle}><input id='saves' type='number' defaultValue={props.player.statistics.saves} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Atajadas (sin rebote):</div>
            <div style={inputStyle}><input id='savescaught' type='number' defaultValue={props.player.statistics.savescaught} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Faltas:</div>
            <div style={inputStyle}><input id='fouls' type='number' defaultValue={props.player.statistics.fouls} min={props.player.statistics.yellowcards + props.player.statistics.redcards} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Offsides:</div>
            <div style={inputStyle}><input id='offsides' type='number' defaultValue={props.player.statistics.offsides} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Distancia recorrida:</div>
            <div style={inputStyle}><input id='distancecovered' type='number' defaultValue={props.player.statistics.distancecovered} min={0} style={{width: '8ch'}}/> m</div>
          </div>
          <div style={itemStyle}>
            <div>Posesión:</div>
            <div style={inputStyle}><input id='possession' type='number' disabled defaultValue={props.player.statistics.possession} min={0} max={100} style={{width: '5ch'}}/> %</div>
          </div>
          <div style={itemStyle}>
            <div>Córners:</div>
            <div style={inputStyle}><input id='corners' type='number' defaultValue={props.player.statistics.corners} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Laterales:</div>
            <div style={inputStyle}><input id='throwins' type='number' defaultValue={props.player.statistics.throwins} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Penales:</div>
            <div style={inputStyle}><input id='penalties' type='number' defaultValue={props.player.statistics.penalties} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tiros libres:</div>
            <div style={inputStyle}><input id='freekicks' type='number' defaultValue={props.player.statistics.freekicks} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tackles:</div>
            <div style={inputStyle}><input id='tackles' type='number' defaultValue={props.player.statistics.tackles} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Tackles completados:</div>
            <div style={inputStyle}><input id='tacklescompleted' type='number' defaultValue={props.player.statistics.tacklescompleted} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Faltas sufridas:</div>
            <div style={inputStyle}><input id='foulssuffered' type='number' defaultValue={props.player.statistics.foulssuffered} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Saques de arco:</div>
            <div style={inputStyle}><input id='goalkicks' type='number' defaultValue={props.player.statistics.goalkicks} min={0} style={{width: '5ch'}}/></div>
          </div>
          <div style={itemStyle}>
            <div>Goles recibidos:</div>
            <div style={inputStyle}><input id='goalsconceded' type='number' defaultValue={props.player.statistics.goalsconceded} min={0} style={{width: '5ch'}}/></div>
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