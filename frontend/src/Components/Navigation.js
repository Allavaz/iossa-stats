import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

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

	render() {
		return (
			<div id='nav-div' onScroll={this.hideLogo}>
				<div className='headerContent'>
					<div className='nav-contents'>
						<Link to='/' id='nav-logo' onClick={this.hideHamburguer} style={{width: this.state.isLogoShown || this.state.isMobile ? '50px' : '0', transition: this.state.isMobile ? 'all 0s' : 'all .2s ease-in'}}><img alt='IOSoccer Sudamérica' height='40px' src='/logo-solo.png'></img></Link>
						<Link to='/individuales' onClick={this.hideHamburguer} id='nav-item' style={{borderLeft: '1px solid lightgrey'}}><center>Estadísticas</center></Link>
						<Link to='/resultados' onClick={this.hideHamburguer} id='nav-item'><center>Resultados</center></Link>
						<div className='hamburguer' id='nav-item' onClick={this.hamburguerOn}><center><FontAwesomeIcon icon={faBars}></FontAwesomeIcon></center></div>
						<div className='linebreak' style={{display: this.state.hamburguer ? 'block' : 'none'}}></div>
						<Link to='/posiciones' onClick={this.hideHamburguer} id='nav-item' style={{display: this.state.hamburguer || window.innerWidth >= mobileWidth ? 'block' : 'none'}}><center>Posiciones</center></Link>
						<Link to='/top10' onClick={this.hideHamburguer} id='nav-item' style={{display: this.state.hamburguer || window.innerWidth >= mobileWidth ? 'block' : 'none'}}><center>Rankings</center></Link>
						<a href='https://forum.iosoccer-sa.bid/' id='nav-item' style={{display: this.state.hamburguer || window.innerWidth >= mobileWidth ? 'block' : 'none'}} target='_blank' rel='noopener noreferrer'><center>Foro</center></a>
					</div>
				</div>
			</div>
		);
	}
}

export default Navigation;
