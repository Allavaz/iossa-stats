import { getTeamLogo } from "../utils/Utils";
import Link from 'next/link';

export default function Top10Goleadores({ players, category }) {
  return (
    <div className='rankingChildDiv'>
      <center><h3>TOP 10 GOLEADORES - {category.toUpperCase()}</h3></center>
      <div className='divDataTable' id='divstatstable'>
        <table className='dataTable' id='statstable'>
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Partidos</th>
              <th>Goles</th>
            </tr>
          </thead>
          <tbody>
            {players.map((item, index) => (
              <tr key={item._id}>
                  <td width='25px'>{index+1}</td>
                  <td><Link href={`/jugador/${item._id}`}><a><div className='teamlogo' style={{paddingRight: '5px', justifyContent: 'center'}}><img height='16px' src={getTeamLogo(item.team)} alt={item.team}></img> <div style={{marginLeft: '5px'}}>{item.name}</div></div></a></Link></td>
                  <td width='75px'>{item.matches}</td>
                  <td width='70px'>{item.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}