import Link from 'next/link'

export default function Header() {
	return (
		<div id='header'>
      <div className='headerContent'>
        <Link href='/'><a><img src='/logo-iossa.png' alt='IOSoccer Sudamérica'></img></a></Link>
      </div>
		</div>
	);
}