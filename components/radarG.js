import Attributes from "../utils/Attributes";
import { Radar } from 'react-chartjs-2';
import { useState, useEffect } from "react";

export default function RadarG({ statsLast15 }) {
  const att = Attributes(statsLast15);
  
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
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false
      }
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        borderWidth: 2,
      }
    },
    scales: {
      r: {
        ticks: {
          display: false,
          maxTicksLimit: 5
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--footer-color')
        },
        pointLabels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--header-color')
        }
      }
    }
  }

  return (
    <div style={{width: '270px', marginTop: '-55px'}}>
      <Radar data={data} options={options} />
      <p style={{fontSize: '0.65em', textAlign: 'center', color: 'var(--header-color)', marginTop: '-65px'}}><i>Gráfico basado en los últimos 15 partidos.</i></p>
    </div>
  );
}