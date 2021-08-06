import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <div id='footer-wrapper'>
			<div id='footer-text'>
			<hr></hr>
      <center>
        <table className='footerTable'>
          <tbody>
            <tr>
              <td><a href='https://discord.me/iossudamerica' target='_blank' rel='noopener noreferrer'><FontAwesomeIcon icon={faDiscord}></FontAwesomeIcon></a></td>
              <td><a href='https://instagram.com/iosoccersa' target='_blank' rel='noopener noreferrer'><FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon></a></td>
              <td><a href='https://www.youtube.com/channel/UCvr34La6BdN5wg4XHOR5nzg' target='_blank' rel='noopener noreferrer'><FontAwesomeIcon icon={faYoutube}></FontAwesomeIcon></a></td>
              <td><a href='https://www.twitch.tv/ios_sa' target='_blank' rel='noopener noreferrer'><FontAwesomeIcon icon={faTwitch}></FontAwesomeIcon></a></td>
            </tr>
          </tbody>
        </table>
        <p>Hecho con ♥ por Allavaz.</p>
      </center>
			</div>
    </div>
  );
}
