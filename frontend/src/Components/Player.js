import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PlayerCard from './PlayerCard';
import { api } from '../api';
import Playstyle from './Playstyle';
import GoalsShots from './GoalsShots';
import PlayerStats from '../PlayerStats';
import SavesConceded from './SavesConceded';
import PlayerMatches from './PlayerMatches';

export default class Player extends Component {
    state = {
        data: [],
        steaminfo: [],
        all: {},
        last15: {},
        last10: {}
	};

	constructor(){
		super();
		this.state = {isLoading: true};
    }

    
    componentDidMount() {
        axios.get(api + 'getplayermatches/' + this.props.match.params.id).then(res => {
            this.setState({
                data: res.data, 
                all: PlayerStats(res.data, this.props.match.params.id),
                last15: PlayerStats(res.data.slice(0,15), this.props.match.params.id),
                last10: PlayerStats(res.data.slice(0,10), this.props.match.params.id),
            });
            document.title = `${this.state.all.name} | IOSoccer Sudamérica`;
            axios.get(api + 'getsteaminfo/' + this.props.match.params.id).then(res => {
                this.setState({steaminfo: res.data, isLoading: false})
            })
        });
    }
    
    render() {
        return this.state.isLoading ? <div className='content' id='loader'><center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center></div> :
        <div className='matchContainer' style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            <PlayerCard data={this.state.all} data2={this.state.last15} steaminfo={this.state.steaminfo} />
            <div style={{display: 'flex', flexWrap: 'wrap', flexGrow: 1, alignContent: 'stretch', justifyContent: 'space-between'}}>
                <Playstyle data={this.state.all} />
                {
                    this.state.last10.saves > this.state.last10.shotsontarget ?
                    <SavesConceded data={this.state.data.slice(0,10)} id={this.props.match.params.id} /> :
                    <GoalsShots data={this.state.data.slice(0,10)} id={this.props.match.params.id} />
                }
            </div>
            <PlayerMatches data={this.state.data.slice(0,5)} />
        </div>
    }

}