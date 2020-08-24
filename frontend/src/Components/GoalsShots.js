import React from 'react';
import { Line } from 'react-chartjs-2';

export default function GoalsShots(props) {
    let labels = []
    let goals = []
    let shots = []
    
    for (let i=0; i<props.data.length; i++) {
        let year = props.data[i].fecha.slice(2, 4);
        let month = props.data[i].fecha.slice(5, 7);
        let day = props.data[i].fecha.slice(8, 10);
        labels.push(`${day}/${month}/${year}`);
        for (let j=0; j<props.data[i].players.length; j++) {
            if (props.data[i].players[j].info.steam_id === props.id) {
                goals.push(props.data[i].players[j].statistics.goals);
                shots.push(props.data[i].players[j].statistics.shotsontarget);
            }
        }
    }

    labels.reverse();
    goals.reverse();
    shots.reverse();
    
    let data = {
        labels: labels,
        datasets: [
            {
                label: 'Goles',
                data: goals,
                fill: false,
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
            },
            {
                label: 'Tiros al arco',
                data: shots,
                fill: false,
                backgroundColor:'#36A2EB',
                borderColor:'#36A2EB',
            }
        ]
    }

    return(
        <div className='whitespace' style={{maxWidth: '460px', flexGrow: 1, marginLeft: 0, marginRight: 0, height: '215px'}}>
            <Line data={data} />
        </div>
    )
}