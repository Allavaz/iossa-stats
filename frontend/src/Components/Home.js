import React, { Component } from 'react'
import MiniPositions from './MiniPositions';
import Matches from './Matches';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner)

export default class Home extends Component {
	state = {
		loadingItems: 3
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
							<MiniPositions torneo='d1t4' header='liga d1 t4' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='d2t4' header='liga d2 t4' callback={this.reduceLoadingItems}></MiniPositions>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
