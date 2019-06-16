import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { playersColumns } from '../Columns'
import Selector from './Selector';
import { filterMethod } from '../Utils';
import { api } from '../../api';

library.add(faSpinner);

const ReactTableFixedColumns = withFixedColumns(ReactTable);

export default class Players extends Component {

    state = {
        data: []
    };

    constructor(){
		super();
		this.state = {
            isLoading: true, 
            playersLoading: false, 
            category: 'TOTALES', 
            temporada: 't3'
        };
	}
    
    componentDidMount() {
        axios.get(api + 'players/' + this.state.temporada).then(res => {
            this.setState({data: res.data, isLoading: false});
        });
        document.title = 'Estadísticas | IOSoccer Sudamérica';
    }

    selectTorneo = (arg) => {
        this.setState({playersLoading: true});
        axios.get(api + 'players/' + arg).then(res => {
            if (arg.startsWith('all') || arg.startsWith('t')) {
                this.setState({category: 'TOTALES'});
            } else if (arg.startsWith('d1')) {
                this.setState({category: 'LIGA D1'});
            } else if (arg.startsWith('d2')) {
                this.setState({category: 'LIGA D2'});
            } else if (arg.startsWith('master')) {
                this.setState({category: 'COPA MASTER'});
            } else if (arg.startsWith('maradei')) {
                this.setState({category: 'COPA MARADEI'});
            }
            this.setState({data: res.data, playersLoading: false});
        });
    }

    selectTemporada = () => {
        var selector = document.getElementById('selector');
        this.setState({temporada: selector.options[selector.selectedIndex].value});
        switch (selector.options[selector.selectedIndex].value) {
            case 'total':
                this.selectTorneo('all');
                break;
            case 't3':
                this.selectTorneo('t3');
                break;
            case 't2':
                this.selectTorneo('t2');
                break;
            default:
                this.selectTorneo('all');
                break;
        }
    }

    render() {
        return ( this.state.isLoading ? <div className='content' id='loader'><center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center></div> :
            <div className='content'>
                <Selector prop1={this.selectTorneo} prop2={this.selectTemporada} prop3={this.state.temporada}></Selector>
                <div style={{opacity: this.state.playersLoading ? 0.5 : 1}}>
                    <h3>ESTADISTICAS INDIVIDUALES {this.state.category}</h3>
                    <ReactTableFixedColumns
                        className='-striped -highlight'
                        data={this.state.data} 
                        columns={playersColumns} 
                        resizable={false}
                        previousText={'Anterior'}
                        nextText={'Siguiente'}
                        noDataText={'No hay jugadores'}
                        pageText={'Página'}
                        ofText={'de'}
                        rowsText={'filas'}
                        defaultFilterMethod={filterMethod}
                        showPageSizeOptions={false}
                        defaultPageSize={13}
                    />
                </div>
            </div>
        );
    }
}
