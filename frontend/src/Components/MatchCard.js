import React from 'react';
import MatchEvent from './MatchEvent';
import { fecha } from '../Utils';

export default function MatchCard(props) {
    return (
        <div className='whitespace'>
			<div style={{color: 'rgb(90,90,90)', fontSize: '10pt', marginTop: '10px'}}><center>{props.data.torneo}</center></div>
			<table className='resulttable'>
				<tbody>
					<tr>
						<td><h2><div id='teamname'>{props.data.teams[0].teamname}</div><div id='shortname'>{props.data.teams[0].teaminfo.shortname}</div></h2></td>
						<td style={{color: 'rgb(90,90,90)'}}>{fecha(props.data.fecha)}</td>
						<td><h2><div id='teamname'>{props.data.teams[1].teamname}</div><div id='shortname'>{props.data.teams[1].teaminfo.shortname}</div></h2></td>
					</tr>
					<tr>
						<td><img className='bigClubLogo' alt={props.data.teams[0].teamname} src={props.data.teams[0].teaminfo.logo}></img></td>
						<td><h2 id='result'>{props.data.teams[0].score} - {props.data.teams[1].score}</h2></td>
						<td><img className='bigClubLogo' alt={props.data.teams[1].teamname} src={props.data.teams[1].teaminfo.logo}></img></td>
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
