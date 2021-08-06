import { Line } from 'react-chartjs-2';

export default function GoalsShots({ playerMatches, id }) {
  let labels = []
  let goals = []
  let shots = []
  
  for (let i=0; i<playerMatches.length; i++) {
    let year = playerMatches[i].fecha.slice(2, 4);
    let month = playerMatches[i].fecha.slice(5, 7);
    let day = playerMatches[i].fecha.slice(8, 10);
    labels.push(`${day}/${month}/${year}`);
    for (let j=0; j<playerMatches[i].players.length; j++) {
      if (playerMatches[i].players[j].info.steam_id === id) {
        goals.push(playerMatches[i].players[j].statistics.goals);
        shots.push(playerMatches[i].players[j].statistics.shotsontarget);
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