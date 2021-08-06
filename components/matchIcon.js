export default function MatchIcon({ event }) {
  switch (event) {
    case 'GOAL':
      return <div className='matchIcon'><img src='/matchicons/pelota.png' id='pelota' alt='Gol' height='15px'></img></div>
    case 'OWN GOAL':
      return <div className='matchIcon'><img src='/matchicons/gc.png' id='pelota' alt='Gol en Contra' height='15px'></img></div>
    case 'YELLOW CARD':
      return <div className='matchIcon'><img src='/matchicons/yellowcard.png' alt='Tarjeta Amarilla' height='15px'></img></div>
    case 'RED CARD':
      return <div className='matchIcon'><img src='/matchicons/redcard.png' alt='Tarjeta Roja' height='15px'></img></div>
    case 'SECOND YELLOW':
      return <div className='matchIcon'><img src='/matchicons/doubleyellowcard.png' alt='Doble Amarilla' height='15px'></img></div>
    default:
      return null
  }
}