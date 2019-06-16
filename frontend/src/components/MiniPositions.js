import React, { Component } from 'react';
import axios from 'axios';
import { api } from '../api';

export default class MiniPositions extends Component {
    state = {
        data: []
    };

    componentDidMount() {
        axios.get(api + 'positions/' + this.props.torneo).then(res => {
            this.setState({data: res.data});
            this.props.callback();
        });
    }

    render() {
        return ( this.state.data === [] ? null :
            <div>
            <h3>{this.props.header.toUpperCase()}</h3>
            <div className='divDataTable'>
                <table className='dataTable'>
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
                        <td width='15px'>{index + 1}</td>
                        <td><div className='teamlogo'><img style={{marginLeft: '0px'}} height='16px' src={item.teaminfo.logo} alt={item._id}></img> <div id='fullteamname'>{item._id}</div></div></td>
                        <td width='15px'>{item.PJ}</td>
                        <td width='15px'>{item.Pts}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            </div>
        );
    }
}
