import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Vod({ vod, editable, setVodEditing, changeVod }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div onMouseOver={e => setHovering(true)} onMouseOut={e => setHovering(false)}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <h3>VIDEO DEL PARTIDO</h3>
        {editable ? <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '38px', marginLeft: '5px'}}>
          <FontAwesomeIcon icon={faEdit} style={{cursor: 'pointer', opacity: hovering ? '100%' : '0%'}} onClick={e => setVodEditing(true)} />
          <FontAwesomeIcon icon={faTrashAlt} style={{cursor: 'pointer', opacity: hovering ? '100%' : '0%'}} onClick={e => changeVod(null)} />
        </div> : null}
      </div>
      <div className='resp-container'>
        <center><iframe title='vod' className='resp-iframe' src={"https://www.youtube.com/embed/" + vod} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></center>
      </div>
    </div>
  )
}