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
                    ],
                borderColor: [
                    getComputedStyle(document.documentElement).getPropertyValue('--card-background'),
                    getComputedStyle(document.documentElement).getPropertyValue('--card-background'),
                    getComputedStyle(document.documentElement).getPropertyValue('--card-background')
                ]
            }
        ]
    }

    let options = {
        legend: {
            labels: {
                fontColor: getComputedStyle(document.documentElement).getPropertyValue('--header-color')
            }
        }
    }

    return (
        <div className='whitespace' style={{maxWidth: '400px', padding: 0, paddingTop: '20px', paddingBottom: '10px', height: '230px', flexGrow: 1, marginBottom: 0, marginLeft: 0, marginRight: 0}}>
            <Doughnut data={data} options={options} />
            <p style={{fontSize: '0.65em', textAlign: 'center', color: 'var(--header-color)', marginTop: '10px'}}><i>Gráfico basado en estadísticas históricas.</i></p>
        </div>
    );
}