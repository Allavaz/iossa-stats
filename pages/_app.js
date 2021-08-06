import Layout from '../components/layout'
import '../styles/globals.css'
import { useEffect } from 'react';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
	
		if (currentTheme) {
			document.documentElement.setAttribute('data-theme', currentTheme);
		} else {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.setAttribute('data-theme', 'dark');
			} else {
				document.documentElement.setAttribute('data-theme', 'light');
			}
		}
	}, [])

  return (
		<>
			<NextNProgress color={'#ff9800'} height={2} showOnShallow={false} />
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
  )
}

export default MyApp
