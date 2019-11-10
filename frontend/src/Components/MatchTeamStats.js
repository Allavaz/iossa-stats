import React from 'react';
import { percentage } from '../Utils';
import Teams from '../Teams';

export default function MatchTeamStats(props) {
    return (
        <div className='divDataTable' id='divStatsTable' style={props.style}>
            <table className='dataTable' id='teamstatstable'>
                <thead>
                    <tr>
                        <th><img height='16px' alt={props.data.teams[0].teamname} src={`/clubs/${Teams[props.data.teams[0].teamname].toLowerCase()}.png`}></img></th>
                        <th width='250px'>ESTADÍSTICAS DEL EQUIPO</th>
                        <th><img height='16px' alt={props.data.teams[1].teamname} src={`/clubs/${Teams[props.data.teams[1].teamname].toLowerCase()}.png`}></img></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.data.teams[0].statistics.shots}</td>
                        <td>Tiros</td>
                        <td>{props.data.teams[1].statistics.shots}</td>
                    </tr>
                    <tr>
                        <td>{props.data.teams[0].statistics.shotsontarget}</td>
                        <td>Tiros al arco</td>
                        <td>{props.data.teams[1].statistics.shotsontarget}</td>
                    </tr>
                    <tr>
                        <td>{props.data.teams[0].statistics.possession}%</td>
                        <td>Posesión</td>
                        <td>{props.data.teams[1].statistics.possession}%</td>
                    </tr>
                    <tr>
                        <td>{props.data.teams[0].statistics.passes}</td>
                        <td>Pases</td>
                        <td>{props.data.teams[1].statistics.passes}</td>
                    </tr>
                    <tr>
                        <td>{percentage(props.data.teams[0].statistics.passescompleted, props.data.teams[0].statistics.passes)}%</td>
                        <td>Precisión de los pases</td>
                        <td>{percentage(props.data.teams[1].statistics.passescompleted, props.data.teams[1].statistics.passes)}%</td>
                    </tr>
                    <tr>
                        <td>{props.data.teams[0].statistics.fouls}</td>
                        <td>Faltas</td>
                        <td>{props.data.teams[1].statistics.fouls}</td>
                    </tr>
                    <tr>
                        <td>{props.data.teams[0].statistics.yellowcards}</td>
                        <td>Tarjetas amarillas</td>
                        <td>{props.data.teams[1].statistics.yellowcards}</td>
                    </tr>
                    <tr>
                        <td>{props.data.teams[0].statistics.redcards}</td>
                        <td>Tarjetas rojas</td>
                        <td>{props.data.teams[1].statistics.redcards}</td>
                    </tr>
                    <tr>
                        <td>{props.data.teams[0].statistics.offsides}</td>
                        <td>Offsides</td>
                        <td>{props.data.teams[1].statistics.offsides}</td>
                    </tr>
                    <tr>
                        <td>{props.data.teams[0].statistics.corners}</td>
                        <td>Córners</td>
                        <td>{props.data.teams[1].statistics.corners}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
