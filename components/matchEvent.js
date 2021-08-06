import MatchIcon from "./matchIcon";
import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function MatchEvent({ item, side, index, editable, setEventEditing, setScoreEditing, setScoreHovering, onRemoveEvent }) {
  const [eventHovering, setEventHovering] = useState(false);
  if (side === 'home') {
    if ((item.team === 'home' && item.event !== 'OWN GOAL') || (item.team === 'away' && item.event === 'OWN GOAL')) {
      return (
        <li key={index}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            onMouseOver={e => setEventHovering(true)}
            onMouseOut={e => setEventHovering(false)}
          >
            {editable ? <div style={{flex: 1}}></div> : null}
            <div className='matchevent' style={{marginLeft: '5px', marginRight: '5px'}}>
              <MatchIcon event={item.event}></MatchIcon><Link href={`/jugador/${item.player1SteamId}`}><a><div className="fullteamname" style={{maxWidth: '25vw'}}>{item.name + ' (' + Math.round((item.second)/60) + "')"}</div></a></Link>
            </div>
            {editable ? <div style={{flex: 1, textAlign: 'left'}}>
              <FontAwesomeIcon 
                style={{
                  marginLeft: '5px', 
                  cursor: 'pointer', 
                  opacity: eventHovering ? '100%' : '0%' 
                }} 
                icon={faEdit} 
                onClick={
                  e => {
                    setEventEditing(index);
                    setScoreEditing(false);
                    setScoreHovering(false);
                  }
                }>
              </FontAwesomeIcon>
              <FontAwesomeIcon 
                style={{
                  marginLeft: '5px', 
                  cursor: 'pointer', 
                  opacity: eventHovering ? '100%' : '0%' 
                }} 
                icon={faTrashAlt} 
                onClick={
                  e => {
                    onRemoveEvent(index);
                    setScoreEditing(false);
                  }
                }>
              </FontAwesomeIcon>
            </div> : null}
          </div>
        </li>
      );
    } else {
      return null;
    }
  } else {
    if ((item.team === 'away' && item.event !== 'OWN GOAL') || (item.team === 'home' && item.event === 'OWN GOAL')) {
      return (
        <li key={index}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            onMouseOver={e => setEventHovering(true)}
            onMouseOut={e => setEventHovering(false)}
          >
            {editable ? <div style={{flex: 1}}></div> : null}
            <div className='matchevent' style={{marginLeft: '5px', marginRight: '5px'}}>
              <MatchIcon event={item.event}></MatchIcon><Link href={`/jugador/${item.player1SteamId}`}><a><div className="fullteamname" style={{maxWidth: '25vw'}}>{item.name + ' (' + Math.round((item.second)/60) + "')"}</div></a></Link>
            </div>
            {editable ? <div style={{flex: 1, textAlign: 'left'}}>
              <FontAwesomeIcon 
                style={{
                  marginLeft: '5px', 
                  cursor: 'pointer', 
                  opacity: eventHovering ? '100%' : '0%' 
                }} 
                icon={faEdit} 
                onClick={
                  e => {
                    setEventEditing(index);
                    setScoreEditing(false);
                    setScoreHovering(false);
                  }
                }>
              </FontAwesomeIcon>
              <FontAwesomeIcon 
                style={{
                  marginLeft: '5px', 
                  cursor: 'pointer', 
                  opacity: eventHovering ? '100%' : '0%' 
                }} 
                icon={faTrashAlt} 
                onClick={
                  e => {
                    onRemoveEvent(index);
                    setScoreEditing(false);
                  }
                }>
              </FontAwesomeIcon>
            </div> : null}
          </div>
        </li>
      );
    } else {
      return null;
    }
  }   
}