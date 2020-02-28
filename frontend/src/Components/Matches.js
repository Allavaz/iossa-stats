import React, { Component } from 'react';
import axios from 'axios';
import MatchRow from './MatchRow';
import { Link } from 'react-router-dom';
import { fecha } from '../Utils';
import { api } from '../api';

export default class Matches extends Component {

    state = {
        data: [],
        isLoading: true
    };

    componentDidMount(){
		axios.get(api + 'matches/20').then(res => {
            this.setState({data: res.data, isLoading: false});
            this.props.callback();
		});
    }
    
    render() {
        return ( this.state.isLoading ? null :
            <div className='matchesContainer' style={{flexBasis: '604px', flexGrow: 9999, margin: '10px'}}>
                {this.state.data.map((item, id, array) => (
                    <div key={id}>
                        <h3 style={{display: id === 0 || fecha(array[id].fecha) !== fecha(array[id-1].fecha) ? 'block' : 'none'}}>RESULTADOS DEL {fecha(item.fecha)}</h3>
                        <div className='divDataTable' id='divMatchesTable' key={id}>
                            <MatchRow data={item}></MatchRow>
                        </div>
                    </div>
                ))}
                <br></br>
                <center><button className='boton'><Link to="/resultados">Ver más...</Link></button></center>
            </div>
        );
    }
}
