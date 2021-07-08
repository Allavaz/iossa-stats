import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Selector from './Selector';
import { api } from '../api';
import { Link } from 'react-router-dom';
import { getTeamLogo } from '../Utils';
import Torneos from '../Torneos.json';
import temporadaActual from '../TemporadaActual';

const tempActual = temporadaActual();

export default class Top10 extends Component {
  state = {
    data: [],
    data2: [],
    data3: []
  };

  constructor(){
		super();
		this.state = {
      isLoading: true, 
      top10Loading: false, 
      category: '', 
      temporada: tempActual
    };
	}
    
  componentDidMount() {
    let arg;
    if (this.props.match.params.id) {
      arg = this.props.match.params.id;
    } else {
      arg = tempActual;
    }
    axios.get(api + 'top10goals/' + arg).then(res => {
      this.setState({data: res.data});
      axios.get(api + 'top10assists/' + arg).then(res => {
        this.setState({data2: res.data});
        axios.get(api + 'top10rusticos/' + arg).then(res => {
          this.changeCategory(arg);
          this.getTemporada(arg);
          this.setState({data3: res.data, isLoading: false});
        })
      });
    });
    document.title = 'Top 10 | IOSoccer Sudamérica';
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      let loc = this.props.history.location.pathname;
      if (loc.startsWith('/top10')) {
        let arg;
        if (loc === '/top10') {
          arg = tempActual;
        } else {
          arg = loc.replace('/top10/', '');
        }
        this.setState({ top10Loading: true });
        axios.get(api + 'top10goals/' + arg).then(res => {
          this.setState({data: res.data});
          axios.get(api + 'top10assists/' + arg).then(res => {
            this.setState({data2: res.data});
            axios.get(api + 'top10rusticos/' + arg).then(res => {
              this.changeCategory(arg);
              this.getTemporada(arg);
              this.setState({data3: res.data, top10Loading: false});
            })
          });
        });
      }
    }
  }

  changeCategory = (arg) => {
    if (arg === 'all') {
      this.setState({ category: "TOTALES" });
    } else if (arg.startsWith("t")) {
      this.setState({ category: "TEMPORADA " + arg.replace('t', '') });
    } else if (arg === 'selecciones') {
      this.setState({ category: "SELECCIONES" });
    } else {
      for (let i in Torneos) {
        for (let j in Torneos[i].torneos) {
          if (arg === Torneos[i].torneos[j].query) {
            this.setState({ category: Torneos[i].torneos[j].torneo.toUpperCase() });
          }
        }
      }
    }
  }

  selectTorneo = (arg) => {
    this.setState({top10Loading: true});
    axios.get(api + 'top10goals/' + arg).then(res => {
      this.setState({data: res.data});
      axios.get(api + 'top10assists/' + arg).then(res => {
        this.setState({data2: res.data});
          axios.get(api + 'top10rusticos/' + arg).then(res => {  
            this.changeCategory(arg);
            this.getTemporada(arg);
            this.setState({data3: res.data, top10Loading: false});
            this.props.history.push(`/top10/${arg}`)
          })
      });
    });
  }

  selectTemporada = () => {
    let selector = document.getElementById("selector");
    let selected = selector.options[selector.selectedIndex].value
    this.setState({
      temporada: selected
    });
    this.selectTorneo(selected);
  };

  getTemporada = (arg) => {
    if (arg.startsWith('t') || arg === 'all' || arg === 'selecciones') {
      this.setState({ temporada: arg });
    } else {
      for (let i in Torneos) {
        for (let j in Torneos[i].torneos) {
          if (arg === Torneos[i].torneos[j].query) {
            this.setState({ temporada: Torneos[i].temporada });
          }
        }
      }
    }
    if (document.getElementById("selector")) {
      let selector = document.getElementById("selector");
      for (let i in selector.options) {
        if (selector.options[i].value === arg) {
          selector.selectedIndex = i;
        }
      }
    }
  }

  render() {
      return ( this.state.isLoading ? <div className='content' id='loader'><center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center></div> :
          <div className='content'>
              <Selector prop1={this.selectTorneo} prop2={this.selectTemporada} prop3={this.state.temporada}></Selector>
              <div className='top10Container' style={{opacity: this.state.top10Loading ? 0.5 : 1}}>
                  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                      <div className='rankingChildDiv'>
                          <center><h3>TOP 10 GOLEADORES {this.state.category}</h3>
                          <div className='divDataTable' id='divstatstable'>
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
                                              <td><Link to={`/jugador/${item._id}`}><div className='teamlogo' style={{paddingRight: '5px', justifyContent: 'center'}}><img height='16px' src={getTeamLogo(item.team)} alt={item.team}></img> {item.name}</div></Link></td>
                                              <td width='75px'>{item.matches}</td>
                                              <td width='70px'>{item.goals}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div></center>
                      </div>
                      <div className='rankingChildDiv'>
                          <center><h3>TOP 10 ASISTIDORES {this.state.category}</h3>
                          <div className='divDataTable' id='divstatstable'>
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
                                              <td><Link to={`/jugador/${item._id}`}><div className='teamlogo' style={{paddingRight: '5px', justifyContent: 'center'}}><img height='16px' src={getTeamLogo(item.team)} alt={item.team}></img> {item.name}</div></Link></td>
                                              <td width='75px'>{item.matches}</td>
                                              <td width='90px'>{item.assists}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div></center>
                      </div>
                      <div className='rankingChildDiv'>
                          <center><h3>TOP 10 RÚSTICOS {this.state.category}</h3>
                          <div className='divDataTable' id='divstatstable'>
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
                                              <td><Link to={`/jugador/${item._id}`}><div className='teamlogo' style={{paddingRight: '5px', justifyContent: 'center'}}><img height='16px' src={getTeamLogo(item.team)} alt={item.team}></img> {item.name}</div></Link></td>
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
