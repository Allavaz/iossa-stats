import { getTeamLogo, getTournamentIcon } from '../utils/Utils';
import Link from 'next/link';

export default function MatchRow({ match }) {
  return(
    <Link href={'/partido/'+ match._id}><a>
      <table id='matchesTable'>
        <tbody>
          <tr>
            <td>
              <div className='teamlogo' id='home' style={{marginRight: '5px'}}>
                <div id='fullteamname' style={{marginRight: '5px'}}>{match.teams[0].teamname}</div> 
                <img height='16px' src={getTeamLogo(match.teams[0].teamname)} alt={match.teams[0].teamname} />
              </div>
            </td>
            <td style={{width: "40px"}}>{match.teams[0].score} - {match.teams[1].score}</td>
            <td>
              <div className='teamlogo' id='away' style={{marginLeft: '5px'}}>
                <img height='16px' src={getTeamLogo(match.teams[1].teamname)} alt={match.teams[1].teamname} />
                <div id='fullteamname' style={{marginLeft: '5px'}}>{match.teams[1].teamname}</div>
              </div>
            </td>
            <td id='coltorneo'>
              <div className='torneologo'>
                <img id='torneoimg' height='16px' layout='fixed' src={getTournamentIcon(match.torneo)} alt={match.torneo} />
                <div className='torneo'>{match.torneo}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </a></Link>
  )
}