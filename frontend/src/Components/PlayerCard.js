import React from 'react';
import RadarG from './RadarG';
import Teams from '../Teams.json';

function getPosColor(pos) {
	switch (pos) {
		case 'GK':
			return '#f2c350';
		case 'LB':
			return '#36A2EB';
		case 'RB':
			return '#36A2EB';
		case 'CB':
			return '#36A2EB';
		case 'LM':
			return '#3da33b';
		case 'RM':
			return '#3da33b';
		case 'CM':
			return '#3da33b';
		case 'CF':
			return '#FF6384';
		case 'LW':
			return '#FF6384';
		case 'RW':
			return '#FF6384';
		default:
			return '#ff9800';
	}
}

export default function PlayerCard(props) {
	let positions = [];

	for (let i=0; i<props.data.positions.length; i++) {
		if (props.data.positions[i].position !== props.data.lastpos) {
			positions.push(props.data.positions[i].position);
		}
	}

    return (
		<div className='whitespace' style={{paddingBottom: '0px', marginBottom: 0, flexGrow: 1}}>
			<div style={{display: 'flex', padding: '10px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center'}}>
				<div style={{display: 'flex', flexGrow: 1, maxWidth: '328px', marginBottom: '10px'}}>
					<div className='profilepicture'>
						<img src={props.steaminfo.avatarfull} alt={props.data.name}></img>
						<div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
							<div className='position' style={{backgroundColor: getPosColor(props.data.lastpos)}}>{props.data.lastpos}</div>
							{
								positions.map((item, index) => {
									if (index < 2) {
										return <div className='position' key={item} style={{backgroundColor: getPosColor(item)}}>{item}</div>										
									} else return null
								})
							}
						</div>
					</div>
					<div>
						<div className='playername'>{props.data.name}</div>
						<div style={{marginTop: '5px', color: 'var(--header-color)', marginBottom: '10px', display: props.data.name === props.steaminfo.personaname ? 'none' : 'block'}}>{props.steaminfo.personaname}</div>
						<div className='teamlogo' style={{marginTop: '5px'}}><img style={{marginLeft: '0px'}} height='16px' src={`/clubs/${Teams[props.data.team].toLowerCase()}.png`} alt={props.data.name}></img> <div id='fullteamname' style={{color: 'var(--header-color)'}}>{props.data.team}</div></div>
						<div className='playersummary' style={{marginTop: '10px', fontSize: '0.75em'}}>{`${props.data.matches} partido${props.data.matches === 1 ? '' : 's'}`}</div>
						<div className='playersummary' style={{marginTop: '5px', fontSize: '0.75em'}}>{`${props.data.wins} victoria${props.data.wins === 1 ? '' : 's'}`}</div>
						<div className='playersummary' style={{marginTop: '5px', fontSize: '0.75em'}}>{`${props.data.draws} empate${props.data.draws === 1 ? '' : 's'}`}</div>
						<div className='playersummary' style={{marginTop: '5px', fontSize: '0.75em'}}>{`${props.data.losses} derrota${props.data.losses === 1 ? '' : 's'}`}</div>
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