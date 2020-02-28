import React, { Component } from 'react'
import MiniPositions from './MiniPositions';
import Matches from './Matches';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default class Home extends Component {
	state = {
		loadingItems: 4
	};

	componentDidMount(){
		document.title = "IOSoccer Sudamérica";
	}

	reduceLoadingItems = () => {
		this.setState({loadingItems: this.state.loadingItems - 1});
	}

	render() {
		return ( 
			<div>
				<div className='content' id='loader' style={{display: this.state.loadingItems > 0 ? 'block' : 'none'}}>
					<center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center>
				</div>
				<div className='content' style={{display: this.state.loadingItems === 0 ? 'block' : 'none'}}>
					<div className='colCon' style={{margin: '-10px'}}>
						<Matches callback={this.reduceLoadingItems}></Matches>
						<div style={{margin: '10px', flexGrow: 1}}>
							<MiniPositions torneo='maradeit5a' header='Copa Maradei T5 - Grupo A' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='maradeit5b' header='Copa Maradei T5 - Grupo B' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='maradeit5c' header='Copa Maradei T5 - Grupo C' callback={this.reduceLoadingItems}></MiniPositions>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
