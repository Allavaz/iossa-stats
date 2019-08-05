import React, { Component } from 'react'
import MiniPositions from './MiniPositions';
import Matches from './Matches';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

library.add(faSpinner)

export default class Home extends Component {
	state = {
		loadingItems: 8
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
						<div style={{margin: '10px'}}>
							<MiniPositions torneo='americat3' header='Copa America T3' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='d1t3' header='liga d1 t3' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='d2t3' header='liga d2 t3' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='maradeit3a' header='copa maradei - grupo a' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='maradeit3b' header='copa maradei - grupo b' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='maradeit3c' header='copa maradei - grupo c' callback={this.reduceLoadingItems}></MiniPositions>
							<MiniPositions torneo='maradeit3d' header='copa maradei - grupo d' callback={this.reduceLoadingItems}></MiniPositions>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
