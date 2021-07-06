import React from 'react';

export default function MatchIcon(props) {
    switch (props.event) {
        case 'GOAL':
            return <img src='/matchicons/pelota.png' id='pelota' style={{marginRight: '5px'}} alt='Gol' height='15px'></img>
        case 'OWN GOAL':
            return <img src='/matchicons/gc.png' id='pelota' alt='Gol en Contra' height='15px' style={{marginRight: '5px'}}></img>
        case 'YELLOW CARD':
            return <img src='/matchicons/yellowcard.png' alt='Tarjeta Amarilla' height='15px' style={{marginRight: '5px'}}></img>
        case 'RED CARD':
            return <img src='/matchicons/redcard.png' alt='Tarjeta Roja' height='15px' style={{marginRight: '5px'}}></img>
        case 'SECOND YELLOW':
            return <img src='/matchicons/doubleyellowcard.png' alt='Doble Amarilla' height='15px' style={{marginRight: '5px'}}></img>
        default:
            return null
    }
}
