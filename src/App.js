import './css/styles.scss';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [disableInput, setDisableInput] = useState(false);
  const [results, setResults] = useState({});

  const DRAWS = 10000;

  const handleClick = (e) => {
    const clickedNum = parseInt(e.target.innerText);

    // If the clicked number is already selected, remove it from the array
    if (selectedNumbers.includes(clickedNum)) {
      return setSelectedNumbers(
        selectedNumbers.filter((num) => num !== clickedNum)
      );
    }

    if (selectedNumbers.length === 6) return;

    setSelectedNumbers([...selectedNumbers, clickedNum]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Guard
    if (selectedNumbers.length !== 6) return;

    setDisableInput(true);

    let results = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    for (let i = 0; i < DRAWS; i++) {
      const winningNumbers = new Array(6)
        .fill(0)
        .map(() => Math.floor(Math.random() * 49) + 1);

      const correctNumbers = winningNumbers.filter((num) =>
        selectedNumbers.includes(num)
      );

      results[correctNumbers.length] += 1;
    }

    setResults(results);
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit}>
        <div className="text-wrapper">
          <h1>Übung 67: Lottostatistik [»Kopfnuss«]</h1>

          <p>
            Jetzt wollen wir es wissen. Wie oft hat man denn wirklich 6
            Richtige? Schreiben Sie ein Programm, das an 10.000 Lottoziehungen
            teilnimmt — immer mit den gleichen Zahlen. Geben Sie anschließend
            eine Statistik aus, wie oft 6 Richtige, 5 Richtige, usw. erreicht
            wurden.
          </p>
        </div>

        <div className="lotto-number-container">
          <h2>Pick Your Six Lottery Numbers for the Experiment</h2>
          <div className="num-pad-container">
            {new Array(49).fill(0).map((_, i) => (
              <button
                key={i + 1}
                onClick={(e) => handleClick(e)}
                className="btn"
                type="button"
                style={{
                  backgroundColor: selectedNumbers.includes(i + 1) && '#fde68a',
                  border:
                    selectedNumbers.includes(i + 1) && '1px solid #fbbf24',
                }}
                disabled={disableInput}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="btn-container">
            <button type="submit" className="submit" disabled={disableInput}>
              Submit
            </button>

            <button
              type="button"
              className="reset"
              onClick={() => {
                setSelectedNumbers([]);
                setDisableInput(false);
                setResults({});
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      <ChartView chartData={results} max={DRAWS} />
    </main>
  );
}

export default App;

function ChartView({ chartData, max }) {
  // Convert max to string where the number is separated by commas every 3 digits
  const maxStr = max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const options = {
    type: 'bar',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Lottery Statistics (${maxStr} draws)`,
        color: '#18181b',
        padding: {
          top: 15,
          bottom: 15,
        },
        font: {
          size: 24,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} times (${(
              (context.parsed.y / max) *
              100
            ).toFixed(2)}%)`;
          },
        },
      },
    },
  };

  const labels = [
    '0 Correct',
    '1 Correct',
    '2 Correct',
    '3 Correct',
    '4 Correct',
    '5 Correct',
    '6 Correct',
  ];

  const data = {
    labels,
    datasets: [
      {
        data: Object.values(chartData),
        backgroundColor: [
          'rgba(15, 23, 42, 1)',
          'rgba(30, 41, 59, 1)',
          'rgba(51, 65, 85, 1)',
          'rgba(71, 85, 105, 1)',
          'rgba(100, 116, 139, 1)',
          'rgba(148, 163, 184, 1)',
          'rgba(203, 213, 225, 1)',
        ],
      },
    ],
  };

  return (
    <div className="container">
      <Bar options={options} data={data} />
    </div>
  );
}
