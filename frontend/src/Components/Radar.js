import Attributes from '../Attributes';
import React from 'react';

import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'

export default function Radar(props) {
    const captions = {
        pf: 'Poder Ofensivo',
        ad: 'Aporte Defensivo',
        cc: 'Capacidad Creativa'
    }

    const att = Attributes(props.data[0]);

    let data = [
        {
            data: {
                pf: att.PF*att.coeff,
                ad: att.AD*att.coeff,
                cc: att.CC*att.coeff
            },
            meta: {
                color: '#ff9800'
            }
        }
    ]

    console.log(att);

    return (
        <RadarChart
            captions={captions}
            data={data}
            size={200}
            options={{
                dots: true, 
                scales: 1,
            }}
        />
    );
}