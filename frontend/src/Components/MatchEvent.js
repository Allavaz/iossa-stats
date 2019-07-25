import React from './node_modules/react';
import EventIcon from './EventIcon';

export default function MatchEvent(props) {
    if (props.side === 'home') {
        if ((props.item.team === 'home' && props.item.event !== 'OWN GOAL') || (props.item.team === 'away' && props.item.event === 'OWN GOAL')) {
            return (
                <li key={props.index}>
                    <div className='matchevent'>
                        <EventIcon event={props.item.event}></EventIcon>{props.item.name + ' (' + Math.round((props.item.second)/60) + "')"}
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
                        <EventIcon event={props.item.event}></EventIcon>{props.item.name + ' (' + Math.round((props.item.second)/60) + "')"}
                    </div>
                </li>
            );
        } else {
            return null;
        }
    }   
}
