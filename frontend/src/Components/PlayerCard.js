import React from 'react';
import Radar from './Radar';

export default function PlayerCard(props) {
	console.log(props)
    return (
		<div className='whitespace'>
			<h1>{props.data[0].name}</h1>
			<div className='profilepicture'>
				<img src={props.steaminfo.data.avatarfull}></img>
			</div>
			<Radar data={props.data2}></Radar>
		</div>
    );
}