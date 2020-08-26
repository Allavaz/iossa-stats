import React, { Component } from "react";
import axios from "axios";
import { api } from "../api";
import Teams from "../Teams";

export default class MiniPositionsUnificada extends Component {
	state = {
		data: []
	};

	d1color = "#fa9d41";
	d2color = "#1cc2ff";

	componentDidMount() {
		axios.get(api + "positions/" + this.props.torneo).then(res => {
			this.setState({data: res.data});
			this.props.callback();
		});
	}

	render() {
		return ( this.state.data === [] ? null :
			<div>
				<h3>{this.props.header.toUpperCase()}</h3>
				<div className="divDataTable">
					<table className="dataTable">
						<thead>
							<tr>
								<th>#</th>
								<th>Equipo</th>
								<th>PJ</th>
								<th>Pts</th>
							</tr>
						</thead>
						<tbody>
							{this.state.data.map((item, index) => (
							<tr key={item._id}>
								<td width="15px">{index + 1}</td>
								<td>
									<div className="teamlogo" style={{marginLeft: '5px'}}>
										<div style={{position: 'absolute', height: '27px', width: '4px', marginLeft: '-10px', backgroundColor: index < 5 ? this.d1color : this.d2color}}></div>
										<img style={{marginLeft: "0px"}} height="16px" src={`/clubs/${Teams[item._id].toLowerCase()}.png`} alt={item._id}></img> 
									<div id="fullteamname">{item._id}</div>
								</div></td>
								<td width="15px">{item.PJ}</td>
								<td width="15px">{item.Pts}</td>
							</tr>
							))}
							<tr>
								<td colSpan="4">
									<div className="teamlogo" style={{marginLeft: '5px'}}>
										<div style={{position: 'absolute', height: '27px', width: '4px', marginLeft: '-10px', backgroundColor: this.d1color}}></div>
										Clasifica a Liga D1
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan="4">
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