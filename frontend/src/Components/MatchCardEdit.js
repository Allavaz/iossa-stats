import React, { useState } from 'react';
import { getTeamLogo } from '../Utils';
import AutocompleteTorneos from './AutocompleteTorneos';
import AutocompleteTeams from './AutocompleteTeams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import MatchEventEditor from './MatchEventEditor';
import MatchEventEdit from './MatchEventEdit';
import ScoreEditor from './ScoreEditor';

export default function MatchCardEdit(props) {
  const [eventEditing, setEventEditing] = useState(-1);
  const [eventCreating, setEventCreating] = useState(null);
  const [scoreEditing, setScoreEditing] = useState(false);
  const [scoreHovering, setScoreHovering] = useState(false);

  function onChangeTeam(value, side) {
    props.changeTeam(value, side);
  }

  function onChangeTorneo(value) {
    props.changeTorneo(value);
  }

  function onAddEvent(side) {
    setEventCreating(side);
    setEventEditing(props.data.matchevents.length);
  }

  function onRemoveEvent(index) {
    let matchEvents = props.data.matchevents;
    matchEvents.splice(index, 1);
    props.changeEvents(matchEvents);
  }

  function onChangeScore(home, away) {
    props.changeScore(home, away);
  }

  function onChangeEvent(event, playerName, playerSteamId, minute, index) {
    let matchEvents = props.data.matchevents;
    if (eventCreating) {
      let team = eventCreating;
      if (event === 'OWN GOAL') {
        if (eventCreating === 'home') {
          team = 'away';
        } else if (eventCreating === 'away') {
          team = 'home';
        }
      }
      matchEvents.push({
        event: event,
        name: playerName,
        period: minute*60 > 45 ? 'SECOND HALF' : 'FIRST HALF',
        player1SteamId: playerSteamId,
        player2SteamId: '',
        second: minute*60,
        team: team
      })
    } else {
      matchEvents[index].event = event;
      matchEvents[index].name = playerName;
      matchEvents[index].player1SteamId = playerSteamId;
      matchEvents[index].second = minute*60;
      matchEvents[index].period = minute*60 > 45 ? 'SECOND HALF' : 'FIRST HALF';
      let prevEvent = matchEvents[index].event;
      if ((event === 'OWN GOAL' && prevEvent !== 'OWN GOAL')
        || (event !== 'OWN GOAL' && prevEvent === 'OWN GOAL')) {
        if (matchEvents[index].team === 'home') {
          matchEvents[index].team = 'away';
        } else if (matchEvents[index].team === 'away') {
          matchEvents[index].team = 'home';
        }
      }
    }
    matchEvents.sort((a, b) => {
      return a.second - b.second
    });
    props.changeEvents(matchEvents);
  }

  const newItem = (side) => {
    return ({
      event: 'GOAL',
      name: '',
      period: 'FIRST HALF',
      player1SteamId: '',
      player2SteamId: '',
      second: props.data.matchevents[props.data.matchevents.length - 1].second,
      team: side
    })
  }

  return (
    <div className='whitespace'>
      <div style={{
          color: 'var(--header-color)', 
          fontSize: '10pt', 
          marginTop: '10px'
        }}>
        <center><AutocompleteTorneos defaultValue={props.data.torneo} onChangeTorneo={onChangeTorneo}></AutocompleteTorneos></center>
      </div>
      <table className='resulttable'>
        <tbody>
          <tr>
            <td>
              <h2>
                <div id='teamname'><AutocompleteTeams defaultValue={props.data.teams[0].teamname} onChangeTeam={onChangeTeam} side='home'></AutocompleteTeams></div>
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
              <div id='teamname'><AutocompleteTeams defaultValue={props.data.teams[1].teamname} onChangeTeam={onChangeTeam} side='away'></AutocompleteTeams></div>
              </h2>
            </td>
          </tr>
          <tr>
            <td><img className='bigClubLogo' 
              alt={props.data.teams[0].teamname} 
              src={getTeamLogo(props.data.teams[0].teamname)}>
            </img></td>
            <td>{scoreEditing ? <ScoreEditor home={props.data.teams[0].score} away={props.data.teams[1].score} onChangeScore={onChangeScore} setScoreEditing={setScoreEditing}></ScoreEditor> : 
              <h2 id='result' style={{marginLeft: '25px'}} onMouseOver={e => setScoreHovering(true)} onMouseOut={e => setScoreHovering(false)}>
              {props.data.teams[0].score} - {props.data.teams[1].score}
              <FontAwesomeIcon style={{marginLeft: '0px', cursor: 'pointer', opacity: scoreHovering ? '100%' : '0%', height: '15px', marginBottom: '4px' }} icon={faEdit} onClick={e => setScoreEditing(true)}></FontAwesomeIcon>
              </h2>
              }
            </td>
            <td><img className='bigClubLogo' 
              alt={props.data.teams[1].teamname} 
              src={getTeamLogo(props.data.teams[1].teamname)}>
            </img></td>
          </tr>
        </tbody>	
      </table>
      {eventEditing === -1 ? null :
        <MatchEventEditor item={eventCreating ? newItem(eventCreating) : props.data.matchevents[eventEditing]} 
          index={eventCreating ? props.data.matchevents.length : eventEditing} 
          players={props.players}
          onChangeEvent={onChangeEvent}
          setEventEditing={setEventEditing}
          setEventCreating={setEventCreating}
          eventCreating={eventCreating}>
        </MatchEventEditor>
      }
      <table className='resulttable'>
        <tbody>
        <tr id='eventslist'>
            <td style={{float: 'left'}}>
              <center><ul style={{listStyleType: 'none', paddingInlineStart: '0px', width: '280px'}}>
                {props.data.matchevents.map((item, index) => (
                  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: '40px'}}>
                    <MatchEventEdit item={item} side='home' index={index} setEventEditing={setEventEditing} onRemoveEvent={onRemoveEvent} />
                  </div>
                ))}
                <tr>
                <td colSpan='4'><FontAwesomeIcon icon={faPlus} style={{cursor: 'pointer'}} onClick={e => onAddEvent('home')}></FontAwesomeIcon></td>
                </tr>
              </ul></center>
            </td>
            <td style={{float: 'right'}}>
            <center><ul style={{listStyleType: 'none', paddingInlineStart: '0px', width: '280px'}}>
              {props.data.matchevents.map((item, index) => (
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: '40px'}}>
                  <MatchEventEdit item={item} side='away' index={index} setEventEditing={setEventEditing} onRemoveEvent={onRemoveEvent} />
                </div>
              ))}
                <tr>
                  <td colSpan='4'><FontAwesomeIcon icon={faPlus} style={{cursor: 'pointer'}} onClick={e => onAddEvent('away')}></FontAwesomeIcon></td>
                </tr>
              </ul></center>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
