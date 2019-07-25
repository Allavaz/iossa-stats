import React from 'react';

export default function Footer() {
  return (
    <div id='footer-wrapper'>
			<div id='footer-text'>
			<hr></hr>
      <center>
        <table className='footerTable'>
          <tbody>
            <tr>
              <td><a href='https://discord.me/iossudamerica' target='_blank' rel='noopener noreferrer'><img height='32px' alt='IOSoccer Sudamérica Discord' src='/Discord-Logo-Gray.png'></img></a></td>
              <td><a href='https://instagram.com/iosoccersa' target='_blank' rel='noopener noreferrer'><img height='32px' alt='IOSoccer Sudamérica Instagram' src='/glyph-logo-gray.png'></img></a></td>
              <td><a href='https://www.youtube.com/channel/UCvr34La6BdN5wg4XHOR5nzg' target='_blank' rel='noopener noreferrer'><img height='32px' alt='IOSoccer Sudamérica Youtube' src='/yt_icon_mono_light.png'></img></a></td>
              <td><a href='https://www.twitch.tv/ios_sa' target='_blank' rel='noopener noreferrer'><img height='32px' alt='IOSoccer Sudamérica Twitch' src='/Glitch_Black_RGB.png'></img></a></td>
            </tr>
          </tbody>
        </table>
        <p>Hecho con ♥ por Allavaz.</p>
      </center>
			</div>
    </div>
  );
}
