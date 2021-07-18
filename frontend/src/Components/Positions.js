import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import FullPositions from './FullPositions';
import FullPositionsUnificada from './FullPositionsUnificada';
import Torneos from '../Torneos.json';
import temporadaActual from '../TemporadaActual';

const tempActual = temporadaActual();

function getTablas(temp) {
  let tablas = [];
  for (let i in Torneos) {
    if (Torneos[i].temporada === temp) {
      for (let j in Torneos[i].torneos) {
        if (Torneos[i].torneos[j].tabla && 
          (tablas.findIndex(e => e.table === Torneos[i].torneos[j].tabla)) === -1) {
          tablas.push({
            table: Torneos[i].torneos[j].tabla,
            name: Torneos[i].torneos[j].torneo
          })
        }
      }
    }
  }
  return tablas;
}

export default class Positions extends Component {
  constructor() {
    super();
    this.state = {
      temporada: [],
      loadingItems: 0,
    };
  }

  componentDidMount() {
    let arg;
    if (this.props.match.params.id) {
      arg = this.props.match.params.id;
    } else {
      arg = tempActual;
    }
    let tablas = getTablas(arg);
    this.setState({ 
      temporada: tablas,
      loadingItems: tablas.length
    });
    if (document.getElementById("selector")) {
      let selector = document.getElementById("selector");
      for (let i in selector.options) {
        if (selector.options[i].value === arg) {
          selector.selectedIndex = i;
        }
      }
    }
    document.title = 'Posiciones | IOSoccer Sudamérica';
  }

  reduceLoadingItems = () => {
    this.setState({loadingItems: this.state.loadingItems - 1});
  }
  
  selectTemporada = () => {
    let selector = document.getElementById('selector');
    let value = selector.options[selector.selectedIndex].value;
    let tablas = getTablas(value);
    this.setState({ 
      temporada: tablas,
      loadingItems: tablas.length
    });
    this.props.history.push(`/posiciones/${value}`)
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      let loc = this.props.history.location.pathname;
      if (loc.startsWith('/posiciones')) {
        let arg;
        if (loc === '/posiciones') {
          arg = tempActual;
        } else {
          arg = loc.replace('/posiciones/', '');
        }
        let tablas = getTablas(arg);
        this.setState({ 
          temporada: tablas,
          loadingItems: tablas.length
        });
        if (document.getElementById("selector")) {
          let selector = document.getElementById("selector");
          for (let i in selector.options) {
            if (selector.options[i].value === arg) {
              selector.selectedIndex = i;
            }
          }
        }
      }
    }
  }

  render() {
    return ( 
      <div className='content'>
        <select id='selector' defaultValue={tempActual} onChange={this.selectTemporada}>
          {Torneos.map((item) => (
            item.temporada === 'all' ? null :
            <option value={item.temporada}>{item.titulo}</option>  
          ))}
        </select>            
        <div className='content' id='loader' style={{display: this.state.loadingItems > 0 ? 'block' : 'none'}}>
          <center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center>
        </div>
        <div style={{display: this.state.loadingItems === 0 ? 'block' : 'none'}}>
          <div className="colCon">
            {this.state.temporada.map(item => item.name.startsWith("Superliga") ? 
            <div className='flexTableDiv'><FullPositionsUnificada className='divDataTable' table={item.table} torneo={item.name} callback={this.reduceLoadingItems} style={{flexGrow: 1, flexBasis: '200px'}}></FullPositionsUnificada></div> : 
            <div className='flexTableDiv'><FullPositions className='divDataTable' table={item.table} torneo={item.name} callback={this.reduceLoadingItems} style={{flexGrow: 1, flexBasis: '200px'}}></FullPositions></div>)}
          </div>
        </div>
      </div>
    );
  }
}
