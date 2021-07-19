import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import AutocompleteTeams from './AutocompleteTeams';

export default function TeamNameEditor(props) {
  let s = props.side === 'home' ? 0 : 1;
  const [value, setValue] = useState(props.teams[s].teamname);
  return(
    <div style={{display: 'flex', marginTop: '0.85em', marginBottom: '0.85em', marginLeft: '17px', justifyContent: 'center'}}>
      <AutocompleteTeams defaultValue={props.teams[s].teamname} setValue={setValue} side={props.side}></AutocompleteTeams>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '5px'}}>
        <FontAwesomeIcon icon={faCheckCircle} style={{cursor: 'pointer'}} onClick={e => props.onChangeTeam(value, props.side)}></FontAwesomeIcon>
        <FontAwesomeIcon icon={faTimesCircle} style={{cursor: 'pointer'}} onClick={e => props.side === 'home' ? props.setHomeTeamNameEditing(false) : props.setAwayTeamNameEditing(false)}></FontAwesomeIcon>
      </div>
    </div>
  )
}