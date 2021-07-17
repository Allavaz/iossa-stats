import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default function VodEdit(props) {
  const [vodHovering, setVodHovering] = useState(false);

  return (
    <div onMouseOver={e => setVodHovering(true)} onMouseOut={e => setVodHovering(false)}>
      <h3>VIDEO DEL PARTIDO <FontAwesomeIcon icon={faEdit} style={{cursor: 'pointer', opacity: vodHovering ? '100%' : '0%', height: '15px', marginBottom: '2px'}} onClick={props.setVodEditing}></FontAwesomeIcon></h3>
      <div className='resp-container'>
        <center><iframe title='vod' className='resp-iframe' src={"https://www.youtube.com/embed/" + props.vod} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></center>
      </div>
    </div>
  )
}
