import { getTeamLogo, getTeamShortname, fecha } from '../utils/Utils';
import MatchEvent from './matchEvent';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import TorneoEditor from './torneoEditor';
import DateTimeEditor from './dateTimeEditor';
import TeamNameEditor from './teamNameEditor';
import ScoreEditor from './scoreEditor';
import MatchEventEditor from './matchEventEditor';

export default function MatchCard(props) {
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

	function onChangeTorneo(value) {
    props.changeTorneo(value);
    setTorneoEditing(false);
    setTorneoHovering(false);
  }

	function onChangeDate(date) {
    props.changeDate(date);
    setDateHovering(false);
  }

	function onChangeTeam(value, side) {
    props.changeTeam(value, side);
    setHomeTeamNameEditing(false);
    setAwayTeamNameEditing(false);
    setHomeTeamNameHovering(false);
    setAwayTeamNameHovering(false);
  }

	function onChangeScore(home, away) {
    props.changeScore(home, away);
    setScoreHovering(false);
  }

	function onAddEvent(side) {
    setEventCreating(side);
    setEventEditing(props.data.matchevents.length);
  }

	function onChangeEvent(event, playerName, playerSteamId, minute, index) {
    let matchEvents = JSON.parse(JSON.stringify(props.data.matchevents));
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

	function onRemoveEvent(index) {
    let matchEvents = JSON.parse(JSON.stringify(props.data.matchevents));
    matchEvents.splice(index, 1);
    props.changeEvents(matchEvents);
  }

	function newItem(side) {
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
			{torneoEditing ? 
			<TorneoEditor torneo={props.data.torneo} onChangeTorneo={onChangeTorneo} setTorneoEditing={setTorneoEditing} /> :
			<div 
				style={{
					display: 'flex', 
					justifyContent: 'center', 
					alignItems: 'center', 
					marginTop: '10px',
					height: '22px'
				}} 
				onMouseOver={e => setTorneoHovering(true)} 
				onMouseOut={e => setTorneoHovering(false)}
			>
				{props.editable ? <div style={{flex: 1}}></div> : null}
				<div style={{color: 'var(--header-color)', fontSize: '10pt', marginLeft: '5px', marginRight: '5px'}}>{props.data.torneo}</div>
				{props.editable ? <div style={{flex: 1, opacity: torneoHovering ? '100%' : '0%'}}>
					<FontAwesomeIcon 
						icon={faEdit} 
						style={{cursor: 'pointer', fontSize: '10pt', color: 'var(--normal-text-color)'}} 
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
				</div> : null}
			</div>}
			{eventEditing === -1 ? null :
        <MatchEventEditor item={eventCreating ? newItem(eventCreating) : props.data.matchevents[eventEditing]} 
          index={eventCreating ? props.data.matchevents.length : eventEditing} 
          players={props.players}
          onChangeEvent={onChangeEvent}
          setEventEditing={setEventEditing}
          setEventCreating={setEventCreating}
          eventCreating={eventCreating}
        />
      }
			<table className='resulttable'>
				<tbody>
					<tr>
						<td>
							{homeTeamNameEditing ? <TeamNameEditor teams={props.data.teams} side='home' onChangeTeam={onChangeTeam} setHomeTeamNameEditing={setHomeTeamNameEditing} setAwayTeamNameEditing={setAwayTeamNameEditing} /> :
								<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
								onMouseOver={e => setHomeTeamNameHovering(true)}
								onMouseOut={e => setHomeTeamNameHovering(false)}
							>
								{props.editable ? <div style={{flex: 1}}></div> : null}
								<div style={{marginLeft: '5px', marginRight: '5px'}}>
									<h2><div id='teamname'>{props.data.teams[0].teamname}</div><div id='shortname'>{getTeamShortname(props.data.teams[0].teamname)}</div></h2>
								</div>
								{props.editable ? <div style={{flex: 1, textAlign: 'left', opacity: homeTeamNameHovering ? '100%' : '0%'}}>
									<FontAwesomeIcon 
										icon={faEdit} 
										style={{cursor: 'pointer', fontSize: '1.2em', color: 'var(--normal-text-color)'}} 
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
								</div> : null}
							</div>}
						</td>
						<td>
							{dateEditing ? <DateTimeEditor date={props.data.fecha} onChangeDate={onChangeDate} setDateEditing={setDateEditing} /> :
								<div 
								style={{
									display: 'flex', 
									justifyContent: 'center', 
									alignItems: 'center'
								}}
								onMouseOver={e => setDateHovering(true)}
								onMouseOut={e => setDateHovering(false)}
							>
								{props.editable ? <div style={{flex: 1}}></div> : null}
								<div style={{marginLeft: '5px', marginRight: '5px', color: 'var(--header-color)'}}>{fecha(props.data.fecha)}</div>
								{props.editable ? <div style={{flex: 1, textAlign: 'left', opacity: dateHovering ? '100%' : '0%'}}>
									<FontAwesomeIcon 
										icon={faEdit} 
										style={{cursor: 'pointer', color: 'var(--normal-text-color)'}} 
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
								</div> : null}
							</div>}
						</td>
						<td>
							{awayTeamNameEditing ? <TeamNameEditor teams={props.data.teams} side='away' onChangeTeam={onChangeTeam} setHomeTeamNameEditing={setHomeTeamNameEditing} setAwayTeamNameEditing={setAwayTeamNameEditing} /> :
								<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
								onMouseOver={e => setAwayTeamNameHovering(true)}
								onMouseOut={e => setAwayTeamNameHovering(false)}
							>
								{props.editable ? <div style={{flex: 1}}></div> : null}
								<div style={{marginLeft: '5px', marginRight: '5px'}}>
									<h2><div id='teamname'>{props.data.teams[1].teamname}</div><div id='shortname'>{getTeamShortname(props.data.teams[1].teamname)}</div></h2>
								</div>
								{props.editable ? <div style={{flex: 1, textAlign: 'left', opacity: awayTeamNameHovering ? '100%' : '0%'}}>
									<FontAwesomeIcon 
										icon={faEdit} 
										style={{cursor: 'pointer', fontSize: '1.2em', color: 'var(--normal-text-color)'}} 
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
								</div> : null}
							</div>}
						</td>
					</tr>
					<tr>
						<td><img className='bigClubLogo' alt={props.data.teams[0].teamname} src={getTeamLogo(props.data.teams[0].teamname)}></img></td>
						<td>
							{scoreEditing ? <ScoreEditor home={props.data.teams[0].score} away={props.data.teams[1].score} onChangeScore={onChangeScore} setScoreEditing={setScoreEditing} /> :
							<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
								onMouseOver={e => setScoreHovering(true)}
								onMouseOut={e => setScoreHovering(false)}
							>
								{props.editable ? <div style={{flex: 1}}></div> : null}
								<div style={{marginLeft: '5px', marginRight: '5px'}}>
									<h2 id='result'>{props.data.teams[0].score} - {props.data.teams[1].score}</h2>
								</div>
								{props.editable ? <div style={{flex: 1, textAlign: 'left', opacity: scoreHovering ? '100%' : '0%'}}>
									<FontAwesomeIcon 
										icon={faEdit} 
										style={{cursor: 'pointer', fontSize: '1.2em', color: 'var(--normal-text-color)'}} 
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
										}} 
									/>
								</div> : null}
							</div>}
						</td>
						<td><img className='bigClubLogo' alt={props.data.teams[1].teamname} src={getTeamLogo(props.data.teams[1].teamname)}></img></td>
					</tr>
					<tr id='eventslist'>
						<td>
							<ul style={{listStyleType: 'none', paddingInlineStart: '0px'}}>
								{props.data.matchevents.map((item, index) => (
									<MatchEvent item={item} 
										key={index} 
										side='home' 
										index={index} 
										editable={props.editable} 
										setEventEditing={setEventEditing} 
										onRemoveEvent={onRemoveEvent} 
										setScoreEditing={setScoreEditing}
										setScoreHovering={setScoreHovering}
									/>
								))}
								{props.editable ? <li>
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
								</li> : null}
							</ul>
						</td>
						<td>
							{props.editable ? <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <input id='password' disabled={props.loading} type='password' placeholder='Contraseña' style={{textAlign: 'center', width: '20ch', height: '22px'}}></input>
                <button className='boton' disabled={props.loading} style={{marginRight: 0, marginTop: '10px'}} onClick={e => {
                  props.updateMatch(document.getElementById('password').value);
                }}>Guardar cambios</button>
                <button className='boton' disabled={props.loading} style={{marginRight: 0}} onClick={e => {
                  props.deleteMatch(document.getElementById('password').value);
                }}>Eliminar partido</button>
                <button className='boton' disabled={props.loading} style={{marginRight: 0}} onClick={e => props.exportMatch()}>Exportar JSON</button>
                <button className='boton' disabled={props.loading} style={{marginRight: 0}} onClick={e => {
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
								{props.loading ? <FontAwesomeIcon
									icon={faSpinner}
									spin
									color="#ff9800"
									size='lg'
								/> : null}
              </div> : null}
						</td>
						<td>
							<ul style={{listStyleType: 'none', paddingInlineStart: '0px'}}>
								{props.data.matchevents.map((item, index) => (
									<MatchEvent item={item} 
										key={index} 
										side='away' 
										index={index} 
										editable={props.editable} 
										setEventEditing={setEventEditing} 
										onRemoveEvent={onRemoveEvent} 
										setScoreEditing={setScoreEditing}
										setScoreHovering={setScoreHovering}
									/>
								))}
								{props.editable ? <li>
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
								</li> : null}
							</ul>
						</td>
					</tr>
				</tbody>	
			</table>
		</div>
  )
}