import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import FullPositions from './FullPositions';
import FullPositionsUnificada from './FullPositionsUnificada';
import { tablas } from '../Tablas'

export default class Positions extends Component {
    
    constructor() {
        super();
        this.state = {
            temporada: tablas.t6,
            loadingItems: tablas.t6.length,
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
                <select id='selector' defaultValue='t6' onChange={this.selectTemporada}>
                    <option value='t6'>Temporada 6</option>
                    <option value='t5'>Temporada 5</option>
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
                    <div className="colCon">
                        {this.state.temporada.map(item => item.name === "Superliga D1 T6" ? 
                        <div className='flexTableDiv'><FullPositionsUnificada className='divDataTable' table={item.table} torneo={item.name} callback={this.reduceLoadingItems} style={{flexGrow: 1, flexBasis: '200px'}}></FullPositionsUnificada></div> : 
                        <div className='flexTableDiv'><FullPositions className='divDataTable' table={item.table} torneo={item.name} callback={this.reduceLoadingItems} style={{flexGrow: 1, flexBasis: '200px'}}></FullPositions></div>)}
                    </div>
                </div>
            </div>
        );
    }
}
