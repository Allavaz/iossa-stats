import React from './node_modules/react';
import { Link } from './node_modules/react-router-dom';
import { getTournamentIcon } from '../Utils';

export default function MatchRow(props) {
    return (
        <Link to={'/partido/'+ props.data._id}>
            <table className='dataTable' id='matchesTable'>
                <tbody>
                    <tr>
                        <td><div className='teamlogo' id='home'><div id='fullteamname'>{props.data.teams[0].teamname}</div> <img height='16px' src={props.data.teams[0].teaminfo.logo} alt={props.data.teams[0].teamname}></img></div></td>
                        <td style={{width: "40px"}}>{props.data.teams[0].score} - {props.data.teams[1].score}</td>
                        <td><div className='teamlogo' id='away'><img height='16px' src={props.data.teams[1].teaminfo.logo} alt={props.data.teams[1].teamname}></img> <div id='fullteamname'>{props.data.teams[1].teamname}</div></div></td>
                        <td id='coltorneo'><div className='torneologo'><img id='torneoimg' height='16px' src={getTournamentIcon(props.data.torneo)} alt={props.data.torneo}></img><div className='torneo'>{props.data.torneo}</div></div></td>
                    </tr>
                </tbody>
            </table>
        </Link>
    );
}
