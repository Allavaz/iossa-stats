import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
	return (
		<div id='header'>
		<div className='headerContent'>
			<Link to='/'><img src='/logo-iossa.png' alt='IOSoccer Sudamérica'></img></Link>
		</div>
		</div>
	);
}
