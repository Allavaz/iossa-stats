import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitch,
  faInstagram,
  faYoutube,
  faDiscord,
  faTiktok
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const socials = [
    {
      link: "https://discord.me/iossudamerica",
      icon: faDiscord
    },
    {
      link: "https://instagram.com/iosoccersa",
      icon: faInstagram
    },
    {
      link: "https://www.youtube.com/channel/UCvr34La6BdN5wg4XHOR5nzg",
      icon: faYoutube
    },
    {
      link: "https://www.twitch.tv/IOSSuda",
      icon: faTwitch
    },
    {
      link: "https://www.tiktok.com/@iosoccer_sudamerica",
      icon: faTiktok
    }
  ];

  return (
    <div id="footer-wrapper">
      <div id="footer-text">
        <hr></hr>
        <center>
          <table className="footerTable">
            <tbody>
              <tr>
                {socials.map((item, index) => (
                  <td key={index}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p>Hecho con ♥ por Allavaz.</p>
        </center>
      </div>
    </div>
  );
}
