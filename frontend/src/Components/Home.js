import React, { Component } from 'react'
import MiniPositions from './MiniPositions';
import Matches from './Matches';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const minitables = [
//	{torneo: 'ddht6', header: 'Division de Honor T6'},
//	{torneo: 'lmt6', header: 'Liga Master T6'},
//	{torneo: 'maradeit6a', header: 'Copa Maradei T6 - Grupo A'},
//	{torneo: 'maradeit6b', header: 'Copa Maradei T6 - Grupo B'},
//	{torneo: 'maradeit6c', header: 'Copa Maradei T6 - Grupo C'},
	{torneo: 'd1t6', header: 'Liga D1 T6'}
]

export default class Home extends Component {
	state = {
		loadingItems: minitables.length + 1
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
							{minitables.map((i) => (
								<MiniPositions torneo={i.torneo} header={i.header} callback={this.reduceLoadingItems}></MiniPositions>	
							))}
						</div>
					</div>
				</div>
			</div>
		)
	}
}
