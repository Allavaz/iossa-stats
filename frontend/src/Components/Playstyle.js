import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function Playstyle(props) {
    let data = {
        labels: ['Goles', 'Atajadas', 'Asistencias'],
        datasets: [
            {
                data: [props.data.goals, props.data.saves, props.data.assists],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                    ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                    ]
            }
        ]
    }

    return (
        <div className='whitespace' style={{maxWidth: '400px', padding: 0, paddingTop: '20px', paddingBottom: '10px', height: '230px', flexGrow: 1, marginBottom: 0, marginLeft: 0, marginRight: 0}}>
            <Doughnut data={data} />
            <p style={{fontSize: '0.65em', textAlign: 'center', color: 'rgb(90,90,90)', marginTop: '10px'}}><i>Gráfico basado en estadísticas históricas.</i></p>
        </div>
    );
}