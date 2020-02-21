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

    let data = [
        {
            data: {
                pf: Attributes(props.data[0]).PF,
                ad: Attributes(props.data[0]).AD,
                cc: Attributes(props.data[0]).CC
            },
            meta: {
                color: '#ff9800'
            }
        }
    ]

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