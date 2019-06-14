import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import FullPositions from './FullPositions';

library.add(faSpinner);

export default class Positions extends Component {

    state = {
        loadingItems: 6
    };

    componentDidMount() {
        document.title = 'Posiciones | IOSoccer Sudamérica';
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
                    <div className='colCon'>
                        <FullPositions table='d1t3' torneo='Liga D1 T3' callback={this.reduceLoadingItems}></FullPositions>
                        <FullPositions table='d2t3' torneo='Liga D2 T3' callback={this.reduceLoadingItems}></FullPositions>
                        <FullPositions table='maradeit3a' torneo='Copa Maradei T3 - Grupo A' callback={this.reduceLoadingItems}></FullPositions>
                        <FullPositions table='maradeit3b' torneo='Copa Maradei T3 - Grupo B' callback={this.reduceLoadingItems}></FullPositions>
                        <FullPositions table='maradeit3c' torneo='Copa Maradei T3 - Grupo C' callback={this.reduceLoadingItems}></FullPositions>
                        <FullPositions table='maradeit3d' torneo='Copa Maradei T3 - Grupo D' callback={this.reduceLoadingItems}></FullPositions>
                    </div>
                </div>
            </div>
        );
    }
}
