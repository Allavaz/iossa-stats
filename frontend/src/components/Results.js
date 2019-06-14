import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Selector from './Selector'
import { resultColumns } from '../Columns';

library.add(faSpinner);

const ReactTableFixedColumns = withFixedColumns(ReactTable);

export default class Results extends Component {
    state = {
        data: []
    };

    constructor() {
        super();
        this.state = {isLoading: true, category: '', temporada: 'total'};
    }

    filterMethod = (filter, row) => {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true;
    }

    componentDidMount() {
        axios.get('https://stats.iosoccer-sa.bid/api/matches/t3').then(res => {
			this.setState({data: res.data, isLoading: false});
		});
		document.title = "Resultados | IOSoccer Sudamérica";
    }

    selectTorneo = (arg) => {
		this.setState({matchesLoading: true});
		axios.get('https://stats.iosoccer-sa.bid/api/matches/' + arg).then(res => {
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
			this.setState({data: res.data, matchesLoading: false});
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
        const TheadComponent = props => null;

        return ( this.state.isLoading ? <div className='content' id='loader'><center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center></div> : 
            <div className='content'>
                <Selector prop1={this.selectTorneo} prop2={this.selectTemporada} prop3={this.state.temporada}></Selector>
                <div style={{opacity: this.state.matchesLoading ? 0.5 : 1}}>
                    <h3>RESULTADOS {this.state.category}</h3>
                    <ReactTableFixedColumns
                        className='-striped -highlight'
                        data={this.state.data}
                        TheadComponent={TheadComponent}
                        columns={resultColumns} 
                        resizable={false}
                        previousText={'Anterior'}
                        nextText={'Siguiente'}
                        noDataText={'No hay partidos'}
                        pageText={'Página'}
                        ofText={'de'}
                        rowsText={'filas'}
                        defaultFilterMethod={this.filterMethod}
                        showPageSizeOptions={false}
                        defaultPageSize={20}
                        getTrProps={(state, rowInfo, column, instance) => ({
                            onClick: e => {
                                this.props.history.push('/partido/' + rowInfo.original._id)
                            },
                            style: {
                                cursor: 'pointer'
                            }
                        })}
                    />
                </div>
            </div>
        );
    }
}
