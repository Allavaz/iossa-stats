import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

let mobileWidth = 550

export class Navigation extends Component {
	constructor() {
		super();
		this.state = {isLogoShown: false, hamburguer: false};
	}

	componentDidMount() {
		window.addEventListener('scroll', this.hideLogo);
		if (window.innerWidth < mobileWidth) {
			this.setState({isMobile: true});
		}
		window.addEventListener('resize', this.setMobile);
		window.addEventListener('click', this.hamburgerCloseWhenClickingAway)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.hideLogo)
		window.removeEventListener('resize', this.setMobile)
	}

	setMobile = (e) => {
		if (window.innerWidth < mobileWidth) {
			this.setState({isMobile: true});
		} else {
			this.setState({isMobile: false});
		}
	}

	hamburgerCloseWhenClickingAway = (e) => {
		if (e.clientY > 110) {
			this.hideHamburguer()
		}
	}

	hideLogo = (e) => {
		if(e.path[1].scrollY >= 100 && !this.state.isMobile) {
			this.setState({isLogoShown: true});
		} else {
			this.setState({isLogoShown: false});
		}
	}

	hamburguerOn = () => {
		this.setState({hamburguer: !this.state.hamburguer});
	}

	hideHamburguer = () => {
		this.setState({hamburguer: false})
	}

	toggleNight = () => {
		if (document.documentElement.getAttribute('data-theme') !== 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
			localStorage.setItem('theme', 'light');
		}
	}

	render() {
		return (
			<div id='nav-div' onScroll={this.hideLogo}>
				<div className='headerContent'>
					<div className='nav-contents'>
						<Link to='/' id='nav-logo' onClick={this.hideHamburguer} style={{width: this.state.isLogoShown || this.state.isMobile ? '50px' : '0', transition: this.state.isMobile ? 'all 0s' : 'all .2s ease-in'}}><img alt='IOSoccer Sudamérica' height='40px' src='/logo-solo.png'></img></Link>
						<Link to='/individuales' onClick={this.hideHamburguer} id='nav-item' style={{borderLeft: '1px solid var(--button-border)'}}><center>Estadísticas</center></Link>
						<Link to='/resultados' onClick={this.hideHamburguer} id='nav-item'><center>Resultados</center></Link>
						<div className='hamburguer' id='nav-item' onClick={this.hamburguerOn}><center><FontAwesomeIcon icon={faBars}></FontAwesomeIcon></center></div>
						<div className='linebreak' style={{display: this.state.hamburguer ? 'block' : 'none'}}></div>
						<Link to='/posiciones' onClick={this.hideHamburguer} id='nav-item' style={{display: this.state.hamburguer || window.innerWidth >= mobileWidth ? 'block' : 'none'}}><center>Posiciones</center></Link>
						<Link to='/top10' onClick={this.hideHamburguer} id='nav-item' style={{display: this.state.hamburguer || window.innerWidth >= mobileWidth ? 'block' : 'none'}}><center>Rankings</center></Link>
						<a href='https://forum.iosoccer-sa.bid/' id='nav-item' style={{display: this.state.hamburguer || window.innerWidth >= mobileWidth ? 'block' : 'none'}} target='_blank' rel='noopener noreferrer'><center>Foro</center></a>
						<a href='https://docs.google.com/spreadsheets/d/1UeoiSeCCmpLbFOig73xwOF_NSp5GtfCiu5S8BnJvf8k/edit?usp=sharing' id='nav-item' style={{display: this.state.hamburguer || window.innerWidth >= mobileWidth ? 'block' : 'none'}} target='_blank' rel='noopener noreferrer'><center>Fixture</center></a>
						<div id='nav-item' onClick={this.toggleNight} style={{display: this.state.hamburguer || window.innerWidth >= mobileWidth ? 'block' : 'none'}}><center><FontAwesomeIcon icon={faLightbulb}></FontAwesomeIcon></center></div>
					</div>
				</div>
			</div>
		);
	}
}

export default Navigation;
