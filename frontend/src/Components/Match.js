import React, { Component } from 'react';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import MatchCard from './MatchCard';
import MatchTeamStats from './MatchTeamStats';
import FullPositions from './FullPositions';
import MatchIndividualStats from './MatchIndividualStats';
import Vod from './Vod';
import Challonge from './Challonge';
import { api } from '../api';

library.add(faSpinner)

export default class Match extends Component {
	state = {
		data: []
	};

	constructor(){
		super();
		this.state = {isLoading: true, isTableLoading: true, challonge: null};
	}

	componentDidMount(){
		axios.get(api + 'match/' + this.props.match.params.id).then(res => {
			this.setState({data: res.data});
			switch (this.state.data.torneo) {
				case "Liga D1 - Temporada 2":
					this.setState({isCopa: false, isLoading: false, table: 'd1t2'});
					break;
				case "Liga D1 - Temporada 2 (Desempate)":
					this.setState({isCopa: false, isLoading: false, table: 'd1t2'});
					break;
				case "Liga D2 - Temporada 1":
					this.setState({isCopa: false, isLoading: false, table: 'd2t1'});
					break;
				case "Liga D1 T3":
					this.setState({isCopa: false, isLoading: false, table: 'd1t3'});
					break;
				case "Liga D2 T3":
					this.setState({isCopa: false, isLoading: false, table: 'd2t3'});
					break;
				case "Copa Master 2019":
					this.setState({isCopa: true, challonge: "Copamasterr", isLoading: false});
					break;
				case "Recopa Master 2019":
					this.setState({isCopa: true, isLoading: false});
					break;
				case "Copa Master T3":
					this.setState({isCopa: true, challonge: "CopaMasster2", isLoading: false});
					break;
				case "Copa Maradei T3 - Grupo A":
					this.setState({isCopa: false, isLoading: false, table: 'maradeit3a'});
					break;
				case "Copa Maradei T3 - Grupo B":
					this.setState({isCopa: false, isLoading: false, table: 'maradeit3b'});
					break;
				case "Copa Maradei T3 - Grupo C":
					this.setState({isCopa: false, isLoading: false, table: 'maradeit3c'});
					break;
				case "Copa Maradei T3 - Grupo D":
					this.setState({isCopa: false, isLoading: false, table: 'maradeit3d'});
					break;
				case "Copa Maradei T3 - Eliminatorias":
					this.setState({isCopa: true, challonge: "Maradei3", isLoading: false});
					break;
				case "Copa America T3":
					this.setState({isCopa: false, isLoading: false, table: 'americat3'});
					break;
				default:
					this.setState({data2: ["e"], isCopa: false, isLoading: false});
					break;
			}
			document.title = this.state.data.teams[0].teamname + ' vs ' + this.state.data.teams[1].teamname + ' | IOSoccer Sudamérica';
		});
	}

  render() {
		return ( this.state.isLoading ? <div className='content' id='loader'><center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800'}}></FontAwesomeIcon></center></div> :
			<div className='matchContainer'>
				<MatchCard data={this.state.data}></MatchCard>
				<div>
					<div className='colCon' style={{margin: '-10px'}}>
						<div style={{flexBasis: this.state.isCopa ? '900px' : '410px', margin: '10px', flexGrow: 9999}}>
							<MatchTeamStats data={this.state.data}></MatchTeamStats>
							{this.state.isCopa && this.state.challonge != null ? <Challonge id={this.state.challonge}></Challonge> : null}
						</div>
						{this.state.isCopa ? null : 
							<div style={{flexGrow: 1}}>
								<div className='content' id='loader' style={{display: this.state.isTableLoading ? 'block' : 'none'}}>
									<center><FontAwesomeIcon icon={faSpinner} spin size='5x' style={{color: '#ff9800', width: '100%'}}></FontAwesomeIcon></center>
								</div>
								<div style={{display: this.state.isTableLoading ? 'none' : 'block', margin: '10px', flexGrow: 1}}>
									<FullPositions table={this.state.table} torneo={this.state.data.torneo} callback={() => {this.setState({isTableLoading: false})}}></FullPositions>
								</div>
							</div>}
					</div>
					<MatchIndividualStats data={this.state.data.teams[0]}></MatchIndividualStats>
					<MatchIndividualStats data={this.state.data.teams[1]}></MatchIndividualStats>
				</div>
				{this.state.data.vod === null ? null : <Vod vod={this.state.data.vod}></Vod>}
			</div>
		);
	}
}
