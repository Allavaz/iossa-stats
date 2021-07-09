import React from 'react';
import { getTeamLogo, getTeamShortname } from '../Utils';
import AutocompleteTorneos from './AutocompleteTorneos';
import AutocompleteTeams from './AutocompleteTeams';
import AutocompletePlayers from './AutocompletePlayers';

export default function MatchCardEdit(props) {
  return (
    <div className='whitespace'>
      <div style={{
          color: 'var(--header-color)', 
          fontSize: '10pt', 
          marginTop: '10px'
        }}>
        <center><AutocompleteTorneos defaultValue={props.data.torneo}></AutocompleteTorneos></center>
      </div>
      <table className='resulttable'>
        <tbody>
          <tr>
            <td>
              <h2>
                <div id='teamname'><AutocompleteTeams defaultValue={props.data.teams[0].teamname}></AutocompleteTeams></div>
                <div id='shortname'>{getTeamShortname(props.data.teams[0].teamname)}</div>
              </h2>
            </td>
            <td style={{color: 'var(--header-color)'}}>
              <input type='datetime-local' 
                defaultValue={props.data.fecha.replace('.000Z', '')}
                style={{
                  textAlign: 'center'
                }}
              />
            </td>
            <td>
              <h2>
              <div id='teamname'><AutocompleteTeams defaultValue={props.data.teams[1].teamname}></AutocompleteTeams></div>
                <div id='shortname'>{getTeamShortname(props.data.teams[1].teamname)}</div>
              </h2>
            </td>
          </tr>
          <tr>
            <td><img className='bigClubLogo' 
              alt={props.data.teams[0].teamname} 
              src={getTeamLogo(props.data.teams[0].teamname)}>
            </img></td>
            <td><h2 id='result'>
              <input type='number' 
                style={{
                  textAlign: 'center', 
                  fontSize: '1em', 
                  fontWeight: 'bold', 
                  width: '3ch'
                }} 
                defaultValue={props.data.teams[0].score} 
                min='0'
                max='99'>  
              </input>
              <span> - </span> 
              <input type='number' 
                style={{
                  textAlign: 'center', 
                  fontSize: '1em', 
                  fontWeight: 'bold', 
                  width: '3ch'}} 
                defaultValue={props.data.teams[1].score} 
                min='0'
                max='99'>
              </input>
            </h2></td>
            <td><img className='bigClubLogo' 
              alt={props.data.teams[1].teamname} 
              src={getTeamLogo(props.data.teams[1].teamname)}>
            </img></td>
          </tr>
          <tr id='eventslist'>
            <td>
              <center><table>
                {props.data.matchevents.map((item, index) => (
                  item.team === 'away' ? null : 
                  <tr>
                    <td>
                      <select style={{width: '8ch', padding: '2px'}} defaultValue={item.event}>
                        <option value='GOAL'>GOL</option>
                        <option value='OWN GOAL'>GC</option>
                        <option value='YELLOW CARD'>TA</option>
                        <option value='RED CARD'>TR</option>
                      </select>
                    </td>
                    <td>
                      <AutocompletePlayers defaultValue={item.name} defaultId={item.player1SteamId} players={props.players}></AutocompletePlayers>
                    </td>
                    <td>
                      (
                      <input type='number' 
                        defaultValue={Math.round(item.second/60)}
                        style={{
                          width: '4ch',
                          height: '16px'
                        }}
                        min='0'>
                      </input>
                      ')
                    </td>
                  </tr>
                ))}
              </table></center>
            </td>
            <td>
            </td>
            <td>
            <center><table>
                {props.data.matchevents.map((item, index) => (
                  item.team === 'home' ? null : 
                  <tr>
                    <td>
                      <select style={{width: '8ch', padding: '2px'}} defaultValue={item.event}>
                        <option value='GOAL'>GOL</option>
                        <option value='OWN GOAL'>GC</option>
                        <option value='YELLOW CARD'>TA</option>
                        <option value='RED CARD'>TR</option>
                      </select>
                    </td>
                    <td>
                      <AutocompletePlayers defaultValue={item.name} defaultId={item.player1SteamId} players={props.players}></AutocompletePlayers>
                    </td>
                    <td>
                      (
                      <input type='number' 
                        defaultValue={Math.round(item.second/60)}
                        style={{
                          width: '4ch',
                          height: '16px'
                        }}
                        min='0'>
                      </input>
                      ')
                    </td>
                  </tr>
                ))}
              </table></center>
            </td>
          </tr>
        </tbody>	
      </table>
    </div>
  );
}
