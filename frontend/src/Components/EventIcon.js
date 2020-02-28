import React from 'react';

export default function EventIcon(props) {
    switch (props.event) {
        case 'GOAL':
            return <img src='/eventicons/pelota.png' alt='Gol' height='15px' style={{marginRight: '5px'}}></img>
        case 'OWN GOAL':
            return <img src='/eventicons/gc.png' alt='Gol en Contra' height='15px' style={{marginRight: '5px'}}></img>
        case 'YELLOW CARD':
            return <img src='/eventicons/yellowcard.png' alt='Tarjeta Amarilla' height='15px' style={{marginRight: '5px'}}></img>
        case 'RED CARD':
            return <img src='/eventicons/redcard.png' alt='Tarjeta Roja' height='15px' style={{marginRight: '5px'}}></img>
        case 'SECOND YELLOW':
            return <img src='/eventicons/doubleyellowcard.png' alt='Doble Amarilla' height='15px' style={{marginRight: '5px'}}></img>
        default:
            return null
    }
}
