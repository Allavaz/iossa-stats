import React from 'react';
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function DateTimeEditor(props) {
  function formatAndSendDate(date) {
    let dt = DateTime.fromISO(date);
    props.onChangeDate(dt.toUTC().toString());
    props.setDateEditing(false);
  }

  let dt = DateTime.fromISO(props.date);
  return(
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '225px'}}>
      <input id='inputDate' type='datetime-local' style={{width: '25ch'}} defaultValue={dt.toFormat("y-LL-dd'T'T")}></input>
      <FontAwesomeIcon icon={faCheckCircle} style={{cursor: 'pointer'}} onClick={e => formatAndSendDate(document.getElementById('inputDate').value)}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faTimesCircle} style={{cursor: 'pointer'}} onClick={e => props.setDateEditing(false)}></FontAwesomeIcon>
    </div>
  )
}