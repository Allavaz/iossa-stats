import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { DateTime } from "luxon";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function EfficiencyLine({ playerMatches, id, type }) {
  let labels = [];
  let pinkDots = [];
  let blueDots = [];

  for (let i = 0; i < playerMatches.length; i++) {
    let date = DateTime.fromISO(playerMatches[i].fecha);
    labels.push(date.toFormat("dd/MM"));
    for (let j = 0; j < playerMatches[i].players.length; j++) {
      if (playerMatches[i].players[j].info.steam_id === id) {
        if (type === "goals") {
          pinkDots.push(playerMatches[i].players[j].statistics.goals);
          blueDots.push(playerMatches[i].players[j].statistics.shotsontarget);
        } else if (type === "saves") {
          pinkDots.push(playerMatches[i].players[j].statistics.saves);
          blueDots.push(playerMatches[i].players[j].statistics.goalsconceded);
        }
      }
    }
  }

  labels.reverse();
  pinkDots.reverse();
  blueDots.reverse();

  let data = {
    labels: labels,
    datasets: [
      {
        label: type === "goals" ? "Goles" : "Atajadas",
        data: pinkDots,
        fill: false,
        backgroundColor: "#FF6384",
        borderColor: "#FF6384"
      },
      {
        label: type === "goals" ? "Tiros al arco" : "Goles Recibidos",
        data: blueDots,
        fill: false,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB"
      }
    ]
  };

  let options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--header-color"
          )
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--footer-color"
          )
        },
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--header-color"
          )
        }
      },
      y: {
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--footer-color"
          )
        },
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            "--header-color"
          )
        }
      }
    }
  };

  return (
    <div
      className="whitespace"
      style={{
        maxWidth: "460px",
        flexGrow: 1,
        marginLeft: 0,
        marginRight: 0,
        marginTop: "15px",
        height: "270px",
        paddingBottom: "10px"
      }}
      suppressHydrationWarning={true}
    >
      <Line data={data} options={options} />
    </div>
  );
}
