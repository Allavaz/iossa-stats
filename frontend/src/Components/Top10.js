import React, { Component } from 'react';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Selector from './Selector';
import { api } from '../api';

library.add(faSpinner);

export default class Top10 extends Component {

    state = {
        data: [],
        data2: [],
        data3: []
    };

    constructor(){
		super();
		this.state = {isLoading: true, top10Loading: false, category: 'TOTALES', temporada: 't3'};
	}
    
    componentDidMount() {
        axios.get(api + 'top10goals/' + this.state.temporada).then(res => {
            this.setState({data: res.data});
            axios.get(api + 'top10assists/' + this.state.temporada).then(res => {
                axios.get(api + 'top10rusticos/' + this.state.temporada).then(res => {
                    this.setState({data3: res.data, isLoading: false});
                })
                this.setState({data2: res.data});
            });
        });
        document.title = 'Top 10 | IOSoccer Sudamérica';
    }

    selectTorneo = (arg) => {
        this.setState({top10Loading: true});
        axios.get(api + 'top10goals/' + arg).then(res => {
            this.setState({data: res.data});
            axios.get(api + 'top10assists/' + arg).then(res => {
                axios.get(api + 'top10rusticos/' + arg).then(res => {
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
                    } else if (arg.startsWith('copaamerica')) {
                        this.setState({category: 'COPA AMERICA'});
                    } else if (arg.startsWith('copadelsur')) {
                        this.setState({category: 'COPA DEL SUR'});
                    }
                    this.setState({data3: res.data, top10Loading: false});
                })
                this.setState({data2: res.data});
            });
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
                <div className='top10Container' style={{opacity: this.state.top10Loading ? 0.5 : 1}}>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                        <div>
                            <center><h3>TOP 10 GOLEADORES {this.state.category}</h3>
                            <div className='divDataTable'>
                                <table className='dataTable' id='statstable'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Jugador</th>
                                            <th>Partidos</th>
                                            <th>Goles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data.map((item, index) => (
                                            <tr key={item._id}>
                                                <td width='25px'>{index+1}</td>
                                                <td><div className='teamlogo' style={{paddingRight: '5px', justifyContent: 'center'}}><img height='16px' src={item.teaminfo[0].logo} alt={item._id}></img> {item.name}</div></td>
                                                <td width='75px'>{item.matches}</td>
                                                <td width='70px'>{item.goals}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div></center>
                        </div>
                        <div>
                            <center><h3>TOP 10 ASISTIDORES {this.state.category}</h3>
                            <div className='divDataTable'>
                                <table className='dataTable' id='statstable'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Jugador</th>
                                            <th>Partidos</th>
                                            <th>Asistencias</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data2.map((item, index) => (
                                            <tr key={item._id}>
                                                <td width='25px'>{index+1}</td>
                                                <td><div className='teamlogo' style={{paddingRight: '5px', justifyContent: 'center'}}><img height='16px' src={item.teaminfo[0].logo} alt={item._id}></img> {item.name}</div></td>
                                                <td width='75px'>{item.matches}</td>
                                                <td width='90px'>{item.assists}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div></center>
                        </div>
                        <div>
                            <center><h3>TOP 10 RÚSTICOS {this.state.category}</h3>
                            <div className='divDataTable'>
                                <table className='dataTable' id='statstable'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Jugador</th>
                                            <th>Partidos</th>
                                            <th>Faltas</th>
                                            <th>Amarillas</th>
                                            <th>Rojas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data3.map((item, index) => (
                                            <tr key={item._id}>
                                                <td width='25px'>{index+1}</td>
                                                <td><div className='teamlogo' style={{paddingRight: '5px', justifyContent: 'center'}}><img height='16px' src={item.teaminfo[0].logo} alt={item._id}></img> {item.name}</div></td>
                                                <td width='75px'>{item.matches}</td>
                                                <td width='75px'>{item.fouls}</td>
                                                <td width='75px'>{item.yellowcards}</td>
                                                <td width='75px'>{item.redcards}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div></center>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
