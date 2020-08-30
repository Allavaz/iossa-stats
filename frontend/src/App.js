import React, { Component } from 'react';
import './App.css';
import Players from './Components/Players';
import Header from './Components/Header';
import Navigation from './Components/Navigation';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NotFound from './Pages/NotFound'
import Positions from './Components/Positions';
import Home from './Components/Home';
import Match from './Components/Match';
import Footer from './Components/Footer'
import Top10 from './Components/Top10';
import Results from './Components/Results';
import Upload from './Components/Upload';
import Endpoint from './endpoint';
import Player from './Components/Player';

class App extends Component {

  render() {
	const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

	if (currentTheme) {
		document.documentElement.setAttribute('data-theme', currentTheme);
	}
	return (
		<Router>
			<div>
				<div>
					<Navigation/>
					<Header/>
				</div>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/individuales' component={Players} />
					<Route exact path='/top10' component={Top10} />
					<Route exact path='/posiciones' component={Positions} />
					<Route exact path='/partido/:id' component={Match} />
					<Route exact path='/resultados' component={Results} />
					<Route exact path='/jugador/:id' component={Player} />
					<Route exact path={Endpoint} component={Upload} />
					<Route component={NotFound} />
				</Switch>
				<div>
					<Footer/>
				</div>
			</div>
		</Router>
	);
  }
}

export default App;
