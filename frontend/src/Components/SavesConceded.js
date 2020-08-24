import React from 'react';
import { Line } from 'react-chartjs-2';

export default function SavesConceded(props) {
    let labels = [];
    let saves = [];
    let conceded = [];

    for (let i=0; i<props.data.length; i++) {
        let year = props.data[i].fecha.slice(2, 4);
        let month = props.data[i].fecha.slice(5, 7);
        let day = props.data[i].fecha.slice(8, 10);
        labels.push(`${day}/${month}/${year}`);
        for (let j=0; j<props.data[i].players.length; j++) {
            if (props.data[i].players[j].info.steam_id === props.id) {
                saves.push(props.data[i].players[j].statistics.saves);
                conceded.push(props.data[i].players[j].statistics.goalsconceded);
            }
        }
    }

    labels.reverse();
    saves.reverse();
    conceded.reverse();

    let data = {
        labels: labels,
        datasets: [
            {
                label: 'Atajadas',
                data: saves,
                fill: false,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
            },
            {
                label: 'Goles Recibidos',
                data: conceded,
                fill: false,
                backgroundColor:'#FF6384',
                borderColor:'#FF6384',
            }
        ]
    }

    return(
        <div className='whitespace' style={{maxWidth: '460px', flexGrow: 1, marginLeft: 0, marginRight: 0, height: '215px'}}>
            <Line data={data} />
        </div>
    )
}