import React from './node_modules/react';

export default function Challonge(props) {
    return ( <iframe title='challonge' className='whitespace' style={{padding: 0, maxWidth: 1100, marginBottom: 0}} src={"https://challonge.com/" + props.id + "/module"} width="100%" height="600" frameborder="0" scrolling="auto" allowtransparency="true"></iframe>);
}
