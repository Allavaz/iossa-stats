import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import AutocompleteTorneos from './AutocompleteTorneos';

export default function TorneoEditor(props) {
  const [value, setValue] = useState(props.torneo);
  return(
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '29px'}}>
      <AutocompleteTorneos defaultValue={props.torneo} setValue={setValue}></AutocompleteTorneos>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '5px', width: '30px'}}>
        <FontAwesomeIcon icon={faCheckCircle} style={{cursor: 'pointer', color: 'var(--normal-text-color)'}} onClick={e => props.onChangeTorneo(value)}></FontAwesomeIcon>
        <FontAwesomeIcon icon={faTimesCircle} style={{cursor: 'pointer', color: 'var(--normal-text-color)'}} onClick={e => props.setTorneoEditing(false)}></FontAwesomeIcon>
      </div>
    </div>
  )
}