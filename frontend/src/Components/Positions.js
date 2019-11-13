import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import FullPositions from './FullPositions';
import { tablas } from '../Tablas'

export default class Positions extends Component {
    
    constructor() {
        super();
        this.state = {
            temporada: tablas.t4,
            loadingItems: tablas.t4.length,
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
        return ( 
            <div className='content'>
                <select id='selector' defaultValue='t4' onChange={this.selectTemporada}>
                    <option value='t4'>Temporada 4</option>
                    <option value='t3'>Temporada 3</option>
                    <option value='t2'>Temporada 2</option>
                    <option value='t1'>Temporada 1</option>
                    <option value='t0'>Temporada 0</option>
                </select>            
                <div className='content' id='loader' style={{display: this.state.loadingItems > 0 ? 'block' : 'none'}}>
                    <center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center>
                </div>
                <div style={{display: this.state.loadingItems === 0 ? 'block' : 'none'}}>
                    <div style={{display: 'flex', flexWrap: 'wrap', margin: '-10px'}}>
                        {this.state.temporada.map(item => <FullPositions table={item.table} torneo={item.name} callback={this.reduceLoadingItems} style={{margin: '10px', flexGrow: 1, flexBasis: '200px'}}></FullPositions>)}
                    </div>
                </div>
            </div>
        );
    }
}
