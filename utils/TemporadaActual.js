import Torneos from './Torneos.json';

// Esto asume que en Torneos.json se ordenan las temporadas
// de la mas nueva a la mas vieja
export default function temporadaActual() {
  for (let i in Torneos) {
    if (Torneos[i].temporada.startsWith('t')) {
      return Torneos[i].temporada;
    }
  }
}