import React from 'react';
import Radar from './Radar';
import Teams from '../Teams.json'

export default function PlayerCard(props) {
	console.log(props)
    return (
		<div className='whitespace'>
			<h2>{props.data[0].name}</h2>
			<p style={{color: 'rgb(90,90,90'}}>{props.steaminfo.data.personaname}</p>
			<div className='teamlogo'><img style={{marginLeft: '0px'}} height='16px' src={`/clubs/${Teams[props.data[0].team].toLowerCase()}.png`} alt={props.data[0].name}></img> <div id='fullteamname' style={{color: 'rgb(90,90,90'}}>{props.data[0].team}</div></div>
			<div className='profilepicture'>
				<img src={props.steaminfo.data.avatarfull}></img>
			</div>
			<Radar data={props.data2}></Radar>
		</div>
    );
}