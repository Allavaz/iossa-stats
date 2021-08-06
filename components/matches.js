import { useRouter } from 'next/router';
import { fecha } from '../utils/Utils';
import MatchRow from './matchRow';

export default function Matches({ matches }) {
  const router = useRouter();

  return (
    <div className='matchesContainer' style={{flexBasis: '595px', flexGrow: 9999}}>
      {matches.map((item, id, array) => (
        <div key={id}>
          <h3 style={{
            display: id === 0 || fecha(array[id].fecha) !== fecha(array[id-1].fecha) ? 'block' : 'none'
          }}>RESULTADOS DEL {fecha(item.fecha)}</h3>
          <div className='divDataTable' id='divMatchesTable' key={id}>
            <MatchRow match={item}></MatchRow>
          </div>
        </div>
      ))}
      <br></br>
      <center><button className='boton' onClick={e => router.push('/resultados')}>Ver más...</button></center>
    </div>
  )
}