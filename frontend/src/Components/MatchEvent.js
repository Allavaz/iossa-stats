import React from 'react';
import EventIcon from './EventIcon';
import { Link } from 'react-router-dom';

export default function MatchEvent(props) {
    console.log(props)
    if (props.side === 'home') {
        if ((props.item.team === 'home' && props.item.event !== 'OWN GOAL') || (props.item.team === 'away' && props.item.event === 'OWN GOAL')) {
            return (
                <li key={props.index}>
                    <div className='matchevent'>
                        <EventIcon event={props.item.event}></EventIcon><Link to={`/jugador/${props.item.player1SteamId}`}>{props.item.name + ' (' + Math.round((props.item.second)/60) + "')"}</Link>
                    </div>
                </li>
            );
        } else {
            return null;
        }
    } else {
        if ((props.item.team === 'away' && props.item.event !== 'OWN GOAL') || (props.item.team === 'home' && props.item.event === 'OWN GOAL')) {
            return (
                <li key={props.index}>
                    <div className='matchevent'>
                        <EventIcon event={props.item.event}></EventIcon><Link to={`/jugador/${props.item.player1SteamId}`}>{props.item.name + ' (' + Math.round((props.item.second)/60) + "')"}</Link>
                    </div>
                </li>
            );
        } else {
            return null;
        }
    }   
}
