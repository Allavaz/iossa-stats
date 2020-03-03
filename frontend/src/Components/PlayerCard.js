import React from 'react';
import RadarG from './RadarG';
import Teams from '../Teams.json'

export default function PlayerCard(props) {
    return (
		<div className='whitespace' style={{paddingBottom: '0px', marginBottom: 0, flexGrow: 1}}>
			<div style={{display: 'flex', padding: '10px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center'}}>
				<div style={{display: 'flex', flexGrow: 1, maxWidth: '330px', marginBottom: '10px'}}>
					<div className='profilepicture'>
						<img src={props.steaminfo.avatarfull} alt={props.data.name}></img>
					</div>
					<div>
						<h2 style={{marginTop: 0, marginBottom: 0}}>{props.data.name}</h2>
						<div style={{marginTop: '5px', color: 'rgb(90,90,90', marginBottom: '10px', display: props.data.name === props.steaminfo.personaname ? 'none' : 'block'}}>{props.steaminfo.personaname}</div>
						<div className='teamlogo' style={{marginTop: '5px'}}><img style={{marginLeft: '0px'}} height='16px' src={`/clubs/${Teams[props.data.team].toLowerCase()}.png`} alt={props.data.name}></img> <div id='fullteamname' style={{color: 'rgb(90,90,90'}}>{props.data.team}</div></div>
						<div style={{marginTop: '10px', color: 'rgb(90,90,90', fontSize: '0.75em'}}>{`${props.data.matches} partido${props.data.wins === 1 ? '' : 's'}`}</div>
						<div style={{marginTop: '5px', color: 'rgb(90,90,90', fontSize: '0.75em'}}>{`${props.data.wins} victoria${props.data.wins === 1 ? '' : 's'}`}</div>
						<div style={{marginTop: '5px', color: 'rgb(90,90,90', fontSize: '0.75em'}}>{`${props.data.draws} empate${props.data.draws === 1 ? '' : 's'}`}</div>
						<div style={{marginTop: '5px', color: 'rgb(90,90,90', fontSize: '0.75em'}}>{`${props.data.losses} derrota${props.data.losses === 1 ? '' : 's'}`}</div>
					</div>
				</div>
				<RadarG data={props.data2}></RadarG>
				<div style={{display: 'flex', justifyContent: 'space-evenly', textAlign: 'center', maxWidth: '260px', flexWrap: 'wrap'}}>
					<div className='stat'>
						<div className='value'>{Math.round((props.data.wins/(props.data.wins+props.data.losses))*100)}%</div>
						<div className='label'>Victorias</div>
					</div>
					{
						props.data.saves > props.data.shotsontarget ?
						<div className='stat'>
							<div className='value'>{props.data.savescaught}</div>
							<div className='label'>Atajadas (S/Rebote)</div>
						</div> :
						<div className='stat'>
							<div className='value'>{props.data.goals}</div>
							<div className='label'>Goles</div>
						</div>
					}
					<div className='stat'>
						<div className='value'>{props.data.assists}</div>
						<div className='label'>Asistencias</div>
					</div>
					<div className='stat'>
						<div className='value'>{Math.round((props.data.passescompleted/props.data.passes)*100)}%</div>
						<div className='label'>Precisión de Pases</div>
					</div>
					{ props.data.saves > props.data.shotsontarget ?
					<div className='stat'>
						<div className='value'>{Math.round((props.data.saves/(props.data.saves+props.data.goalsconceded))*100)}%</div>
						<div className='label'>Atajadas</div>
					</div> :
					<div className='stat'>
						<div className='value'>{props.data.shotsontarget}</div>
						<div className='label'>Tiros al arco</div>
					</div>
					}
					<div className='stat'>
						<div className='value'>{Math.round(props.data.possession)}%</div>
						<div className='label'>Posesión</div>
					</div>
				</div>
			</div>
		</div>
    );
}