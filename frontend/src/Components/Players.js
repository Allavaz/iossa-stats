import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { playersColumns } from '../Columns';
import Selector from './Selector';
import { filterMethod } from '../Utils';
import { api } from '../api';
import Torneos from '../Torneos.json';
import temporadaActual from '../TemporadaActual';

const ReactTableFixedColumns = withFixedColumns(ReactTable);

const tempActual = temporadaActual();

export default class Players extends Component {
  state = {
    data: []
  };

  constructor() {
		super();
		this.state = {
      isLoading: true, 
      playersLoading: false, 
      category: "", 
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
    axios.get(api + "players/" + arg).then((res) => {
      this.changeCategory(arg);
      this.getTemporada(arg);
      this.setState({ data: res.data, isLoading: false });
    });
    document.title = "Estadísticas | IOSoccer Sudamérica";
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      let loc = this.props.history.location.pathname;
      if (loc.startsWith('/individuales')) {
        let arg;
        if (loc === '/individuales') {
          arg = tempActual;
        } else {
          arg = loc.replace('/individuales/', '');
        }
        this.setState({ playersLoading: true });
        axios.get(api + "players/" + arg).then((res) => {
          this.changeCategory(arg);
          this.getTemporada(arg);
          this.setState({ data: res.data, playersLoading: false });
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
    this.setState({ playersLoading: true });
    axios.get(api + "players/" + arg).then((res) => {
      this.changeCategory(arg);
      this.setState({ data: res.data, playersLoading: false });
    });
    this.props.history.push(`/individuales/${arg}`)
  };

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
            getTdProps={(state, rowInfo, column, instance) => ({
              onClick: e => {
                if (column.Header === 'Jugador') {
                  this.props.history.push('/jugador/' + rowInfo.original._id);
                }
              },
              style: {
                cursor: column.Header === 'Jugador' ? 'pointer' : 'initial'
              }
            })}
          />
        </div>
      </div>
    );
  }
}
