import { Line } from 'react-chartjs-2';

export default function SavesConceded({ playerMatches, id }) {
  let labels = [];
  let saves = [];
  let conceded = [];

  for (let i=0; i<playerMatches.length; i++) {
    let year = playerMatches[i].fecha.slice(2, 4);
    let month = playerMatches[i].fecha.slice(5, 7);
    let day = playerMatches[i].fecha.slice(8, 10);
    labels.push(`${day}/${month}/${year}`);
    for (let j=0; j<playerMatches[i].players.length; j++) {
      if (playerMatches[i].players[j].info.steam_id === id) {
        saves.push(playerMatches[i].players[j].statistics.saves);
        conceded.push(playerMatches[i].players[j].statistics.goalsconceded);
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
        backgroundColor:' #FF6384',
        borderColor: '#FF6384',
      }
    ]
  }

  let options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--header-color')
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--footer-color')
        },
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--header-color')
        }
      },
      y: {
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--footer-color')
        },
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--header-color')
        }
      }
    }
  }

  return (
    <div className='whitespace' style={{maxWidth: '460px', flexGrow: 1, marginLeft: 0, marginRight: 0, height: '245px'}} suppressHydrationWarning={true}>
      <Line data={data} options={options} />
    </div>
  )
}