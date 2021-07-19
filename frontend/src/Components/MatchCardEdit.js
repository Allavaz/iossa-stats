import React, { useState, useEffect } from 'react';
import { fecha, getTeamLogo, getTeamShortname } from '../Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import MatchEventEditor from './MatchEventEditor';
import MatchEventEdit from './MatchEventEdit';
import ScoreEditor from './ScoreEditor';
import DateTimeEditor from './DateTimeEditor';
import TeamNameEditor from './TeamNameEditor';
import TorneoEditor from './TorneoEditor';

export default function MatchCardEdit(props) {
  const [eventEditing, setEventEditing] = useState(-1);
  const [eventCreating, setEventCreating] = useState(null);
  const [scoreEditing, setScoreEditing] = useState(false);
  const [scoreHovering, setScoreHovering] = useState(false);
  const [dateHovering, setDateHovering] = useState(false);
  const [dateEditing, setDateEditing] = useState(false);
  const [homeTeamNameEditing, setHomeTeamNameEditing] = useState(false);
  const [awayTeamNameEditing, setAwayTeamNameEditing] = useState(false);
  const [homeTeamNameHovering, setHomeTeamNameHovering] = useState(false);
  const [awayTeamNameHovering, setAwayTeamNameHovering] = useState(false);
  const [torneoEditing, setTorneoEditing] = useState(false);
  const [torneoHovering, setTorneoHovering] = useState(false);

  useEffect(() => {
    if (props.teamStatsEditing || props.vodEditing) {
      setEventEditing(-1);
      setEventCreating(null);
      setScoreEditing(false);
      setScoreHovering(false);
      setDateHovering(false);
      setDateEditing(false);
      setHomeTeamNameEditing(false);
      setAwayTeamNameEditing(false);
      setHomeTeamNameHovering(false);
      setAwayTeamNameHovering(false);
      setTorneoEditing(false);
      setTorneoHovering(false);
    }
  }, [props]);

  function onChangeTeam(value, side) {
    props.changeTeam(value, side);
    setHomeTeamNameEditing(false);
    setAwayTeamNameEditing(false);
    setHomeTeamNameHovering(false);
    setAwayTeamNameHovering(false);
  }

  function onChangeTorneo(value) {
    props.changeTorneo(value);
    setTorneoEditing(false);
    setTorneoHovering(false);
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
    setScoreHovering(false);
  }

  function onChangeDate(date) {
    props.changeDate(date);
    setDateHovering(false);
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
    
    let yellows = 0;
    for (let i in matchEvents) {
      if (matchEvents[i].player1SteamId === playerSteamId) {
        if (matchEvents[i].event === 'YELLOW CARD' || matchEvents[i].event === 'SECOND YELLOW') {
          yellows++;
          if (yellows % 2 === 0) {
            matchEvents[i].event = 'SECOND YELLOW';
          }
        }
      }
    }

    for (let i in matchEvents) {
      if (matchEvents[i].player1SteamId === playerSteamId) {
        matchEvents[i].name = playerName;
      }
    }

    props.changeEvents(matchEvents);
  }

  const newItem = (side) => {
    return ({
      event: 'GOAL',
      name: '',
      period: 'FIRST HALF',
      player1SteamId: '',
      player2SteamId: '',
      second: props.data.matchevents.length === 0 ? 0 : props.data.matchevents[props.data.matchevents.length - 1].second,
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
        <center>{torneoEditing ? <TorneoEditor torneo={props.data.torneo} onChangeTorneo={onChangeTorneo} setTorneoEditing={setTorneoEditing}></TorneoEditor> : 
        <div style={{display:'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '14px', height: '22px'}} onMouseOver={e => setTorneoHovering(true)} onMouseOut={e => setTorneoHovering(false)}>
          {props.data.torneo} 
          <FontAwesomeIcon icon={faEdit} style={{
              cursor: 'pointer',
              marginLeft: '5px',
              color: 'var(--normal-text-color)',
              opacity: torneoHovering ? '100%' : '0%'
            }}
            onClick={e => {
              setTorneoEditing(true);
              setHomeTeamNameEditing(false); 
              setAwayTeamNameEditing(false);
              setDateEditing(false);
              setEventEditing(-1);
              setScoreEditing(false);
              setHomeTeamNameHovering(false);
              setAwayTeamNameHovering(false);
              setDateHovering(false);
              setScoreHovering(false);
              setTorneoHovering(false);
              props.setTeamStatsEditing(false);
              props.setVodEditing(false);
            }}
          />
        </div>}</center>
      </div>
      <table className='resulttable'>
        <tbody>
          <tr>
            <td>
              {homeTeamNameEditing ? 
              <TeamNameEditor teams={props.data.teams} 
                side='home' 
                onChangeTeam={onChangeTeam} 
                setHomeTeamNameEditing={setHomeTeamNameEditing} 
                setAwayTeamNameEditing={setAwayTeamNameEditing}
              /> : 
              <h2><div id='teamname' style={{display:'flex', justifyContent:'center', alignItems:'center', marginLeft: '21px'}} onMouseOver={e => setHomeTeamNameHovering(true)} onMouseOut={e => setHomeTeamNameHovering(false)}>
                {props.data.teams[0].teamname} 
                <FontAwesomeIcon 
                  icon={faEdit} 
                  style={{
                    fontSize: '0.75em', 
                    marginLeft: '5px', 
                    marginBottom: '2px', 
                    opacity: homeTeamNameHovering ? '100%' : '0%',
                    cursor: 'pointer'}}
                  onClick={e => {
                    setHomeTeamNameEditing(true); 
                    setAwayTeamNameEditing(false);
                    setDateEditing(false);
                    setEventEditing(-1);
                    setScoreEditing(false);
                    setTorneoEditing(false);
                    setHomeTeamNameHovering(false);
                    setDateHovering(false);
                    setScoreHovering(false);
                    setTorneoHovering(false);
                    props.setTeamStatsEditing(false);
                    props.setVodEditing(false);
                  }}
                />
              </div>
              <div id='shortname'>{getTeamShortname(props.data.teams[1].teamname)}</div></h2>}
            </td>
            <td>{dateEditing ? <center><DateTimeEditor date={props.data.fecha} onChangeDate={onChangeDate} setDateEditing={setDateEditing}></DateTimeEditor></center> : 
            <div style={{color: 'var(--header-color)', marginLeft: '11px'}}
              onMouseOver={e => setDateHovering(true)}
              onMouseOut={e => setDateHovering(false)}
              >
              {fecha(props.data.fecha)}
              <FontAwesomeIcon icon={faEdit} 
                style={{color: 'var(--normal-text-color)', cursor: 'pointer', opacity: dateHovering ? '100%' : '0%', marginLeft: '5px'}}
                onClick={e => {
                  setDateEditing(true);
                  setEventEditing(-1);
                  setScoreEditing(false);
                  setTorneoEditing(false);
                  setHomeTeamNameEditing(false);
                  setAwayTeamNameEditing(false);
                  setScoreHovering(false);
                  setTorneoHovering(false);
                  setHomeTeamNameHovering(false);
                  setAwayTeamNameHovering(false);
                  props.setTeamStatsEditing(false);
                  props.setVodEditing(false);
                }}
              />
              </div>}</td>
            <td>
              {awayTeamNameEditing ? 
              <TeamNameEditor teams={props.data.teams} 
                side='away' 
                onChangeTeam={onChangeTeam} 
                setHomeTeamNameEditing={setHomeTeamNameEditing} 
                setAwayTeamNameEditing={setAwayTeamNameEditing}
              /> : 
              <h2><div id='teamname' style={{display:'flex', justifyContent:'center', alignItems:'center', marginLeft: '21px'}} onMouseOver={e => setAwayTeamNameHovering(true)} onMouseOut={e => setAwayTeamNameHovering(false)}>
                {props.data.teams[1].teamname} 
                <FontAwesomeIcon 
                  icon={faEdit} 
                  style={{
                    fontSize: '0.75em', 
                    marginLeft: '5px', 
                    marginBottom: '2px', 
                    opacity: awayTeamNameHovering ? '100%' : '0%',
                    cursor: 'pointer'}}
                  onClick={e => {
                    setAwayTeamNameEditing(true); 
                    setHomeTeamNameEditing(false);
                    setDateEditing(false);
                    setEventEditing(-1);
                    setScoreEditing(false);
                    setTorneoEditing(false);
                    setHomeTeamNameHovering(false);
                    setDateHovering(false);
                    setScoreHovering(false);
                    setTorneoHovering(false);
                    props.setTeamStatsEditing(false);
                    props.setVodEditing(false);
                  }}
                />
              </div>
              <div id='shortname'>{getTeamShortname(props.data.teams[1].teamname)}</div></h2>}
            </td>
          </tr>
          <tr>
            <td><img className='bigClubLogo' 
              alt={props.data.teams[0].teamname} 
              src={getTeamLogo(props.data.teams[0].teamname)}>
            </img></td>
            <td>{scoreEditing ? <ScoreEditor home={props.data.teams[0].score} 
                away={props.data.teams[1].score} 
                onChangeScore={onChangeScore} 
                setScoreEditing={setScoreEditing}>
              </ScoreEditor> : 
              <h2 id='result' style={{marginLeft: '25px'}} onMouseOver={e => setScoreHovering(true)} onMouseOut={e => setScoreHovering(false)}>
                {props.data.teams[0].score} - {props.data.teams[1].score}
                <FontAwesomeIcon style={{
                    marginLeft: '0px', 
                    cursor: 'pointer', 
                    opacity: scoreHovering ? '100%' : '0%', 
                    height: '16px', 
                    marginBottom: '4px' 
                  }} 
                  icon={faEdit} 
                  onClick={e => {
                    setScoreEditing(true);
                    setDateEditing(false);
                    setEventEditing(-1);
                    setTorneoEditing(false);
                    setHomeTeamNameEditing(false);
                    setAwayTeamNameEditing(false);
                    setDateHovering(false);
                    setTorneoHovering(false);
                    setHomeTeamNameHovering(false);
                    setAwayTeamNameHovering(false);
                    props.setTeamStatsEditing(false);
                    props.setVodEditing(false);
                  }}/>
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
            <td>
              <center><ul style={{listStyleType: 'none', paddingInlineStart: '0px', width: '280px'}}>
                {props.data.matchevents.map((item, index) => (
                  <MatchEventEdit 
                    item={item} 
                    side='home' 
                    index={index} 
                    setEventEditing={setEventEditing} 
                    onRemoveEvent={onRemoveEvent} 
                    setScoreEditing={setScoreEditing}
                    setScoreHovering={setScoreHovering}
                  />
                ))}
                <li>
                  <FontAwesomeIcon icon={faPlus} 
                  style={{cursor: 'pointer'}} 
                  onClick={e => {
                    onAddEvent('home'); 
                    setScoreEditing(false); 
                    setHomeTeamNameEditing(false);
                    setAwayTeamNameEditing(false);
                    setDateEditing(false);
                    setTorneoEditing(false);
                    setScoreHovering(false); 
                    setHomeTeamNameHovering(false);
                    setAwayTeamNameHovering(false);
                    setDateHovering(false);
                    setTorneoHovering(false);
                    props.setTeamStatsEditing(false);
                    props.setVodEditing(false);
                  }}/>
                </li>
              </ul></center>
            </td>
            <td>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <input type='password' placeholder='Contraseña' style={{textAlign: 'center', width: '20ch', height: '22px'}}></input>
                <button className='boton' style={{marginRight: 0, marginTop: '10px'}}>Modificar partido</button>
                <button className='boton' style={{marginRight: 0}}>Eliminar partido</button>
                <button className='boton' style={{marginRight: 0}} onClick={e => props.exportMatch()}>Exportar JSON</button>
                <button className='boton' style={{marginRight: 0}} onClick={e => {
                  props.restartEditing();
                  setEventEditing(-1);
                  setEventCreating(null);
                  setScoreEditing(false);
                  setScoreHovering(false);
                  setDateHovering(false);
                  setDateEditing(false);
                  setHomeTeamNameEditing(false);
                  setAwayTeamNameEditing(false);
                  setHomeTeamNameHovering(false);
                  setAwayTeamNameHovering(false);
                  setTorneoEditing(false);
                  setTorneoHovering(false);
                }}>Reiniciar edición</button>
              </div>
            </td>
            <td>
            <center><ul style={{listStyleType: 'none', paddingInlineStart: '0px', width: '280px'}}>
              {props.data.matchevents.map((item, index) => (
                <MatchEventEdit 
                  item={item} 
                  side='away' 
                  index={index} 
                  setEventEditing={setEventEditing} 
                  onRemoveEvent={onRemoveEvent} 
                  setScoreEditing={setScoreEditing}
                  setScoreHovering={setScoreHovering}
                />
              ))}
                <li>
                  <FontAwesomeIcon icon={faPlus} 
                  style={{cursor: 'pointer'}} 
                  onClick={e => {
                    onAddEvent('away'); 
                    setScoreEditing(false); 
                    setHomeTeamNameEditing(false);
                    setAwayTeamNameEditing(false);
                    setDateEditing(false);
                    setTorneoEditing(false);
                    setScoreHovering(false); 
                    setHomeTeamNameHovering(false);
                    setAwayTeamNameHovering(false);
                    setDateHovering(false);
                    setTorneoHovering(false);
                    props.setTeamStatsEditing(false);
                    props.setVodEditing(false);
                  }}/>
                </li>
              </ul></center>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
