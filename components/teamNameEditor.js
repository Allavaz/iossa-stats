import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import AutocompleteTeams from './autocompleteTeams';

export default function TeamNameEditor(props) {
  let s = props.side === 'home' ? 0 : 1;
  const [value, setValue] = useState(props.teams[s].teamname);
  return(
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{flex: 1}}></div>
      <div style={{marginLeft: '5px', marginRight: '5px'}}>
        <AutocompleteTeams defaultValue={props.teams[s].teamname} setValue={setValue} side={props.side}></AutocompleteTeams>
      </div>
      <div style={{flex: 1}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '30px'}}>
          <FontAwesomeIcon icon={faCheckCircle} style={{cursor: 'pointer'}} onClick={e => props.onChangeTeam(value, props.side)}></FontAwesomeIcon>
          <FontAwesomeIcon icon={faTimesCircle} style={{cursor: 'pointer'}} onClick={e => props.side === 'home' ? props.setHomeTeamNameEditing(false) : props.setAwayTeamNameEditing(false)}></FontAwesomeIcon>
        </div>
      </div>
    </div>
  )
}