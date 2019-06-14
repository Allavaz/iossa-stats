import React, { Component } from 'react'
import './App.css'
import Players from './components/Players'
import Header from './components/Header'
import Navigation from './components/Navigation'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NotFound from './Pages/NotFound'
import Positions from './components/Positions';
import Home from './components/Home';
import Match from './components/Match';
import Footer from './components/Footer'
import Top10 from './components/Top10';
import Results from './components/Results';

class App extends Component {

  render() {
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
