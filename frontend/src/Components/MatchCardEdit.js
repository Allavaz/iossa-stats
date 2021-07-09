import React from 'react';
import MatchEvent from './MatchEvent';
import { getTeamLogo, getTeamShortname } from '../Utils';
import AutosuggestTorneos from './AutocompleteTorneos';
import AutosuggestTeams from './AutocompleteTeams';

export default function MatchCardEdit(props) {
  return (
    <div className='whitespace'>
      <div style={{
          color: 'var(--header-color)', 
          fontSize: '10pt', 
          marginTop: '10px'
        }}>
        <center><AutosuggestTorneos defaultValue={props.data.torneo}></AutosuggestTorneos></center>
      </div>
      <table className='resulttable'>
        <tbody>
          <tr>
            <td>
              <h2>
                <div id='teamname'><AutosuggestTeams defaultValue={props.data.teams[0].teamname}></AutosuggestTeams></div>
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
              <div id='teamname'><AutosuggestTeams defaultValue={props.data.teams[1].teamname}></AutosuggestTeams></div>
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
              <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}}>
                {props.data.matchevents.map((item, index) => (
                  <MatchEvent item={item} side='home' index={index}></MatchEvent>
                ))}
              </ul>
            </td>
            <td>
            </td>
            <td>
              <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}}>
                {props.data.matchevents.map((item, index) => (
                  <MatchEvent item={item} side='away' index={index}></MatchEvent>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>	
      </table>
    </div>
  );
}
