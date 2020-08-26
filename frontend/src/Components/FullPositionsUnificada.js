import React, { Component } from "react";
import axios from "axios";
import { plus } from "../Utils";
import { api } from "../api";
import Teams from "../Teams";

export default class FullPositionsUnificada extends Component {
	state = {
		data: [],
	};

	d1color = "#fa9d41";
	d2color = "#1cc2ff";

	componentDidMount() {
		axios.get(api + "positions/" + this.props.table).then(res => {
			this.setState({data: res.data});
			this.props.callback();
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.table !== this.props.table) {
			axios.get(api + "positions/" + this.props.table).then(res => {
				this.setState({data: res.data});
				this.props.callback();
			});
		}
	}

	render() {
		return (
			<div style={this.props.style}>
				<h3>POSICIONES {this.props.torneo.toUpperCase()}</h3>
				<div className="divDataTable">
					<table className="dataTable">
						<thead>
							<tr>
								<th width="15px">#</th>
								<th>Equipo</th>
								<th>PJ</th>
								<th>Pts</th>
								<th>GF</th>
								<th>GC</th>
								<th>PG</th>
								<th>PE</th>
								<th>PP</th>
								<th>DF</th>
							</tr>
						</thead>
						<tbody>
							{this.state.data.map((item, index) => (
							<tr key={item._id}>
								<td>{index + 1}</td>
								<td>
									<div className="teamlogo" style={{marginLeft: '5px'}}>
										<div style={{position: 'absolute', height: '27px', width: '4px', marginLeft: '-10px', backgroundColor: index < 5 ? this.d1color : this.d2color}}></div>
										<img style={{marginLeft: "0px"}} height="16px" src={`/clubs/${Teams[item._id].toLowerCase()}.png`} alt={item._id}></img> 
									<div id="fullteamname">{item._id}</div>
								</div></td>
								<td>{item.PJ}</td>
								<td>{item.Pts}</td>
								<td>{item.GF}</td>
								<td>{item.GC}</td>
								<td>{item.PG}</td>
								<td>{item.PE}</td>
								<td>{item.PP}</td>
								<td>{plus(item.DF)}</td>
							</tr>
							))}
							<tr>
								<td colSpan="10">
									<div className="teamlogo" style={{marginLeft: '5px'}}>
										<div style={{position: 'absolute', height: '27px', width: '4px', marginLeft: '-10px', backgroundColor: this.d1color}}></div>
										Clasifica a Liga D1
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan="10">
									<div className="teamlogo" style={{marginLeft: '5px'}}>
										<div style={{position: 'absolute', height: '27px', width: '4px', marginLeft: '-10px', backgroundColor: this.d2color}}></div>
										Clasifica a Liga D2
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
		</div>
		);
	}
}
