import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import FullPositions from './FullPositions';
import { tablas } from '../Tablas'

library.add(faSpinner);

export default class Positions extends Component {
    
    constructor() {
        super();
        this.state = {
            temporada: tablas.t3,
            loadingItems: tablas.t3.length,
        };
    }

    componentDidMount() {
        document.title = 'Posiciones | IOSoccer Sudamérica';
    }

    reduceLoadingItems = () => {
        this.setState({loadingItems: this.state.loadingItems - 1});
    }
    
    selectTemporada = () => {
        var selector = document.getElementById('selector');
        var value = selector.options[selector.selectedIndex].value;
        this.setState({loadingItems: tablas[value].length})
        this.setState({temporada: tablas[value]});
    }

    render() {
        console.log(this.state.temporada)
        return ( 
            <div className='content'>
                <select id='selector' defaultValue='t3' onChange={this.selectTemporada}>
                    <option value='t3'>Temporada 3</option>
                    <option value='t2'>Temporada 2</option>
                </select>            
                <div className='content' id='loader' style={{display: this.state.loadingItems > 0 ? 'block' : 'none'}}>
                    <center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center>
                </div>
                <div style={{display: this.state.loadingItems === 0 ? 'block' : 'none'}}>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                        {this.state.temporada.map(item => <FullPositions table={item.table} torneo={item.name} callback={this.reduceLoadingItems}></FullPositions>)}
                    </div>
                </div>
            </div>
        );
    }
}
