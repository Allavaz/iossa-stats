import React, { useState } from 'react';
import MatchIcon from './MatchIcon';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export default function MatchEventEdit(props) {
  const [eventHovering, setEventHovering] = useState(false);
  if (props.side === 'home') {
    if ((props.item.team === 'home' && props.item.event !== 'OWN GOAL') || (props.item.team === 'away' && props.item.event === 'OWN GOAL')) {
      return (
        <li key={props.index}>
          <div className='matchevent' style={{marginLeft: '35px'}} onMouseOver={e => setEventHovering(true)} onMouseOut={e => setEventHovering(false)}>
            <MatchIcon event={props.item.event}></MatchIcon>
            <Link to={`/jugador/${props.item.player1SteamId}`}>
              <div className="fullteamname" style={{maxWidth: '25vw'}}>
                {props.item.name + ' (' + Math.round((props.item.second)/60) + "')"}
              </div>
            </Link>
            <FontAwesomeIcon 
              style={{
                marginLeft: '5px', 
                cursor: 'pointer', 
                opacity: eventHovering ? '100%' : '0%' 
              }} 
              icon={faEdit} 
              onClick={
                e => {
                  props.setEventEditing(props.index);
                  props.setScoreEditing(false);
                  props.setScoreHovering(false);
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
                  props.onRemoveEvent(props.index);
                  props.setScoreEditing(false);
                }
              }>
            </FontAwesomeIcon>
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
          <div className='matchevent' style={{marginLeft: '40px'}} onMouseOver={e => setEventHovering(true)} onMouseOut={e => setEventHovering(false)}>
            <MatchIcon event={props.item.event}></MatchIcon>
            <Link to={`/jugador/${props.item.player1SteamId}`}>
              <div className="fullteamname" style={{maxWidth: '25vw'}}>
                {props.item.name + ' (' + Math.round((props.item.second)/60) + "')"}
              </div>
            </Link>
            <FontAwesomeIcon 
              style={{
                marginLeft: '5px', 
                cursor: 'pointer', 
                opacity: eventHovering ? '100%' : '0%' 
              }} 
              icon={faEdit} 
              onClick={
                e => {
                  props.setEventEditing(props.index);
                  props.setScoreEditing(false);
                  props.setScoreHovering(false);
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
                  props.onRemoveEvent(props.index);
                  props.setScoreEditing(false);
                }
              }>
            </FontAwesomeIcon>
          </div>
        </li>
      );
    } else {
      return null;
    }
  }
}
