import React from 'react';

export default function Vod(props) {
    return (
        <div>
            <h3>VIDEO DEL PARTIDO</h3>
            <div className='resp-container'>
                <center><iframe title='vod' className='resp-iframe' src={"https://www.youtube.com/embed/" + props.vod} frameBorder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></center>
            </div>
        </div>
    )
}
