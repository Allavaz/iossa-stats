import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Selector from './Selector'
import { resultColumns } from '../Columns';
import { api } from '../api';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

export default class Results extends Component {
    state = {
        data: []
    };

    constructor() {
        super();
        this.state = {
            isLoading: true, 
            category: '', 
            temporada: 't5', 
            search: ''
        };
    }

    componentDidMount() {
        axios.get(api + 'matches/' + this.state.temporada).then(res => {
			this.setState({data: res.data, isLoading: false});
		});
		document.title = "Resultados | IOSoccer Sudamérica";
    }

    selectTorneo = (arg) => {
		this.setState({matchesLoading: true});
		axios.get(api + 'matches/' + arg).then(res => {
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
            } else if (arg.startsWith('supercopamaster')) {
                this.setState({category: 'SUPERCOPA MASTER'});
            } else if (arg.startsWith('recopamaster')) {
                this.setState({category: 'RECOPA MASTER'});
            } else if (arg.startsWith('recopamaradei')) {
                this.setState({category: 'RECOPA MARADEI'});
            } else if (arg.startsWith('copaamerica')) {
                this.setState({category: 'COPA AMERICA'});
            } else if (arg.startsWith('copadelsur')) {
                this.setState({category: 'COPA DEL SUR'});
            } else if (arg.startsWith('cg')) {
                this.setState({category: 'COPA GUBERO'});
            } else if (arg.startsWith('lm')) {
                this.setState({category: 'LIGA MASTER'});
            } else if (arg.startsWith('ddh')) {
                this.setState({category: 'DIVISION DE HONOR'});
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
            case 't5':
                this.selectTorneo('t5');
                break;
            case 't4':
                this.selectTorneo('t4');
                break;
            case 't3':
                this.selectTorneo('t3');
                break;
            case 't2':
                this.selectTorneo('t2');
                break;
            case 't1':
                this.selectTorneo('t1');
                break;
            case 't0':
                this.selectTorneo('t0');
                break;
            default:
                this.selectTorneo('all');
                break;
        }
    }

    render() {
        const TheadComponent = props => null;

        let data = this.state.data;

        if (this.state.search) {
            data = data.filter(row => {
                return (
                    row.teams[0].teamname.toLowerCase().includes(this.state.search.toLowerCase()) || 
                    row.teams[1].teamname.toLowerCase().includes(this.state.search.toLowerCase()) || 
                    row.torneo.toLowerCase().includes(this.state.search.toLowerCase())
                )
            })
        }

        return ( this.state.isLoading ? <div className='content' id='loader'><center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center></div> : 
            <div className='content'>
                <Selector prop1={this.selectTorneo} prop2={this.selectTemporada} prop3={this.state.temporada}></Selector>
                <div style={{opacity: this.state.matchesLoading ? 0.5 : 1}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <h3 style={{display: 'inline', marginRight: '10px'}}>RESULTADOS {this.state.category}</h3>
                        <input 
                            value={this.state.search}
                            onChange={e => this.setState({search: e.target.value})}
                            placeholder='Buscar equipo/torneo…'
                            style={{
                                border: '1px solid rgba(0,0,0,.1)',
                                fontSize: '11pt',
                                padding: '5px',
                                height:'20px'
                            }}
                        />
                    </div>
                    <ReactTableFixedColumns
                        className='-striped -highlight'
                        data={data}
                        TheadComponent={TheadComponent}
                        columns={resultColumns} 
                        resizable={false}
                        previousText={'Anterior'}
                        nextText={'Siguiente'}
                        noDataText={'No hay partidos'}
                        pageText={'Página'}
                        ofText={'de'}
                        rowsText={'filas'}
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
