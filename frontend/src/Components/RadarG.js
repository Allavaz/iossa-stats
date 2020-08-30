import Attributes from '../Attributes';
import React from 'react';
import { Radar } from 'react-chartjs-2';

export default function RadarG(props) {
    const att = Attributes(props.data);
    
    let data = {
        labels: ['Poder Ofensivo', 'Aporte Defensivo', 'Cap. Creativa'],
        datasets: [
            {
                backgroundColor: '#ffc163aa',
                borderColor: '#ff9800aa',
                data: [att.PF, att.AD, att.CC]
            }
        ]
    }

    let options = {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false
        },
        elements: {
            point: {
                radius: 0
            },
            line: {
                borderWidth: 2
            }
        },
        scale: {
            ticks: {
                display: false,
                maxTicksLimit: 5
            },
            gridLines: {
                color: getComputedStyle(document.documentElement).getPropertyValue('--footer-color')
            },
            pointLabels: {
                fontColor: getComputedStyle(document.documentElement).getPropertyValue('--header-color')
            }
        }
    }

    return (
        <div style={{width: '270px'}}>
            <Radar data={data} options={options} />
            <p style={{fontSize: '0.65em', textAlign: 'center', color: 'var(--header-color)', marginTop: '-5px'}}><i>Gráfico basado en los últimos 15 partidos.</i></p>
        </div>
    );
}