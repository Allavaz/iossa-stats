import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import AutocompletePlayers from './AutocompletePlayers';

export default function MatchEventEditor(props) {
  const [playerName, setPlayerName] = useState(props.item.name);
  const [playerSteamId, setPlayerSteamId] = useState(props.item.player1SteamId);

  const finishEditing = () => {
    let selectEventValue = document.getElementById('selectEvent' + props.index).value;
    let selectMinuteValue = document.getElementById('selectMinute' + props.index).value;
    props.onChangeEvent(selectEventValue, playerName, playerSteamId, selectMinuteValue, props.index);
    props.setEventCreating(null);
    props.setEventEditing(-1);
  }

  const cancelEditing = () => {
    props.setEventCreating(null);
    props.setEventEditing(-1);
  }

  const changeSteamIdField = (steamid) => {
    let selectSteamId = document.getElementById('selectSteamId' + props.index);
    selectSteamId.value = steamid;
  }

  return(
    <div id='overlay'>
      <div className='whitespace' style={{position: 'absolute', zIndex: 3, left: 0, right: 0, width: '520px', padding: '20px', top: '440px', margin: 'auto'}}>
        <h3 style={{marginTop: 0, marginLeft: '5px'}}>{props.eventCreating ? 'CREAR' : 'EDITAR'} EVENTO</h3>
        <table className='resulttable' style={{tableLayout: 'initial'}}>
          <tbody>
            <tr>
              <td>
                <select id={'selectEvent' + props.index} style={{width: '8ch', padding: '2px'}} defaultValue={props.item.event}>
                  <option value='GOAL'>GOL</option>
                  <option value='OWN GOAL'>GC</option>
                  <option value='YELLOW CARD'>TA</option>
                  <option value='RED CARD'>TR</option>
                </select>
              </td>
              <td>
                <AutocompletePlayers defaultValue={props.item.name} 
                  defaultId={props.item.player1SteamId} 
                  players={props.players} 
                  index={props.index}
                  onChangePlayer={{setPlayerName, setPlayerSteamId}}
                  changeSteamIdField={changeSteamIdField}>
                </AutocompletePlayers>
              </td>
              <td>
                <input type='text'
                  id={'selectSteamId' + props.index}
                  defaultValue={props.item.player1SteamId}
                  onChange={e => setPlayerSteamId(e.target.value)}
                  placeholder='SteamID'
                  style={{textAlign: 'center'}}>
                </input>
              </td>
              <td>
                (
                <input id={'selectMinute' + props.index} type='number' 
                  defaultValue={Math.round(props.item.second/60)}
                  style={{
                    width: '5ch',
                    height: '16px'
                  }}
                  min='0'>
                </input>
                ')
              </td>
              <td><FontAwesomeIcon icon={faCheckCircle} style={{marginTop: '5px', cursor: 'pointer'}} onClick={finishEditing}></FontAwesomeIcon></td>
              <td><FontAwesomeIcon icon={faTimesCircle} style={{marginTop: '5px', cursor: 'pointer'}} onClick={cancelEditing}></FontAwesomeIcon></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
