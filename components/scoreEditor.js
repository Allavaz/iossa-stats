import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const style = {
  textAlign: 'center', 
  fontSize: '2em', 
  fontWeight: 'bold', 
  width: '3ch'
}

export default function ScoreEditor(props) {
  function sendScore() {
    let home = document.getElementById('homeScore').value;
    let away = document.getElementById('awayScore').value;
    props.onChangeScore(home, away);
    props.setScoreEditing(false);
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{flex: 1}}></div>
      <div style={{marginLeft: '5px', marginRight: '5px'}}>
        <input type='number'
          id='homeScore' 
          style={style} 
          defaultValue={props.home}
          min='0'
          max='99'>  
        </input>
        <span style={style}> - </span> 
        <input type='number' 
          id='awayScore'
          style={style}
          defaultValue={props.away}
          min='0'
          max='99'>
        </input>
      </div>
      <div style={{flex: 1}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '40px'}}>
          <FontAwesomeIcon icon={faCheckCircle} style={{cursor: 'pointer'}} size='lg' onClick={e => sendScore()}></FontAwesomeIcon>
          <FontAwesomeIcon icon={faTimesCircle} style={{cursor: 'pointer'}} size='lg' onClick={e => props.setScoreEditing(false)}></FontAwesomeIcon>
        </div>
      </div>
    </div>
  )
}