import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/logo-solo.png'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

const mobileWidth = 550;

export default function Navigation() {
  const [night, setNight] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [logoShown, setLogoShown] = useState(false);
  const [hamburger, setHamburger] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', hideLogo);
    if (window.innerWidth < mobileWidth) {
			setMobile(true);
		}
    if (localStorage.getItem('theme')) {
			setNight(localStorage.getItem('theme') === 'dark');
		} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setNight(true);
		}
    window.addEventListener('resize', changeMobile);
    window.addEventListener('click', hamburgerCloseWhenClickingAway)
  }, [])

  function hideLogo(e) {
    if(e.path[1].scrollY >= 100 && !mobile) {
			setLogoShown(true);
		} else {
			setLogoShown(false);
		}
  }

  function changeMobile(e) {
    if (window.innerWidth < mobileWidth) {
			setMobile(true);
		} else {
			setMobile(false);
		}
  }

  function hamburgerCloseWhenClickingAway(e) {
    if (e.clientY > 110) {
      setHamburger(false);
    }
  }

  function toggleNight() {
		if (document.documentElement.getAttribute('data-theme') !== 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
			localStorage.setItem('theme', 'dark');
			setNight(true);
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
			localStorage.setItem('theme', 'light');
			setNight(false);
		}
	}

  return (
    <div id='nav-div' onScroll={hideLogo}>
      <div className='headerContent'>
        <div className='nav-contents'>
          <Link href='/'><a id='nav-logo' onClick={e => setHamburger(false)} style={{width: logoShown || mobile ? '50px' : '0', transition: mobile ? 'all 0s' : 'all .2s ease-in'}}><div style={{padding: '5px'}}><Image alt='IOSoccer Sudamérica' src={logo} height='40px' width='40px' layout='fixed'></Image></div></a></Link>
          <Link href='/individuales'><a id='nav-item' onClick={e => setHamburger(false)} style={{borderLeft: '1px solid var(--button-border)'}}><center>Estadísticas</center></a></Link>
          <Link href='/resultados'><a id='nav-item' onClick={e => setHamburger(false)}><center>Resultados</center></a></Link>
          <div className='hamburger' id='nav-item' onClick={e => setHamburger(!hamburger)}><center><FontAwesomeIcon icon={faBars}></FontAwesomeIcon></center></div>
          <div className='linebreak' style={{display: hamburger ? 'block' : 'none'}}></div>
          <Link href='/posiciones'><a id='nav-item' onClick={e => setHamburger(false)} style={{display: hamburger || !mobile ? 'block' : 'none'}}><center>Posiciones</center></a></Link>
          <Link href='/top10'><a id='nav-item' onClick={e => setHamburger(false)} style={{display: hamburger || !mobile ? 'block' : 'none'}}><center>Rankings</center></a></Link>
          <a href='https://forum.iosoccer-sa.bid/' id='nav-item' onClick={e => setHamburger(false)} style={{display: hamburger || !mobile ? 'block' : 'none'}} target='_blank' rel='noopener noreferrer'><center>Foro</center></a>
          <div id='nav-item' onClick={e => toggleNight()} style={{display: hamburger || !mobile ? 'block' : 'none'}}><center><FontAwesomeIcon icon={night ? faSun : faMoon}></FontAwesomeIcon></center></div>
        </div>
      </div>
    </div>
  );
}