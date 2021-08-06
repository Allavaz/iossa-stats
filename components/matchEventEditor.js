import { useState } from 'react';
import AutocompletePlayers from './autocompletePlayers';
import AutocompleteSteamIDs from './autocompleteSteamIDs';

export default function MatchEventEditor(props) {
  const [playerName, setPlayerName] = useState(props.item.name);
  const [playerSteamId, setPlayerSteamId] = useState(props.item.player1SteamId);

  const finishEditing = () => {
    let selectEventValue = document.getElementById('selectEvent' + props.index).value;
    let selectMinuteValue = document.getElementById('selectMinute' + props.index).value;
    if (playerName.trim() === '' || playerSteamId.trim() === '') {
      alert('Faltan datos');
    } else {
      props.onChangeEvent(selectEventValue, playerName.trim(), playerSteamId.trim(), selectMinuteValue, props.index);
      props.setEventCreating(null);
      props.setEventEditing(-1);
    }
  }

  const cancelEditing = () => {
    props.setEventCreating(null);
    props.setEventEditing(-1);
  }

  const changeSteamIdField = (steamid) => {
    setPlayerSteamId(steamid);
  }

  const changePlayerField = (name) => {
    setPlayerName(name);
  }

  return(
    <div id='overlay'>
      <div className='whitespace' 
        style={{
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent:'space-between', 
          position: 'absolute', 
          zIndex: 5, 
          left: 0, 
          right: 0, 
          width: '520px', 
          padding: '20px', 
          top: '440px', 
          margin: 'auto'
        }}>
        <h3 style={{marginTop: 0}}>{props.eventCreating ? 'CREAR' : 'EDITAR'} EVENTO</h3>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--normal-text-color)'}}>
          <select id={'selectEvent' + props.index} style={{width: '15ch', padding: '2px'}} defaultValue={props.item.event}>
            <option value='GOAL'>Gol</option>
            <option value='OWN GOAL'>Gol en contra</option>
            <option value='YELLOW CARD'>Amarilla</option>
            <option value='RED CARD'>Roja</option>
          </select>
          <AutocompletePlayers defaultValue={props.item.name} 
            defaultId={props.item.player1SteamId} 
            players={props.players}
            index={props.index}
            onChangePlayer={{setPlayerName, setPlayerSteamId}}
            changeSteamIdField={changeSteamIdField}
            value={playerName}>
          </AutocompletePlayers>
          <AutocompleteSteamIDs defaultValue={props.item.name} 
            defaultId={props.item.player1SteamId} 
            players={props.players}
            index={props.index}
            onChangePlayer={{setPlayerName, setPlayerSteamId}}
            changePlayerField={changePlayerField}
            value={playerSteamId}>
          </AutocompleteSteamIDs>
          <div>
            {"("}
            <input id={'selectMinute' + props.index} type='number' 
              defaultValue={Math.round(props.item.second/60)}
              style={{
                width: '5ch',
                height: '16px'
              }}
              min='0'>
            </input>
            {"')"}
          </div>
        </div>
        <div style={{marginTop: '15px', display: 'flex', justifyContent: 'flex-end'}}>
          <button className='boton' style={{marginBottom: 0, marginLeft: '10px', marginRight: 0}} onClick={finishEditing}>Guardar</button>
          <button className='boton' style={{marginBottom: 0, marginLeft: '10px', marginRight: 0}} onClick={cancelEditing}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}