import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Gold Exchange',
      data: [500, 700, 800, 600, 900],
      backgroundColor: 'rgba(219, 54, 70, 0.8)',
      borderColor: 'rgba(193, 40, 55, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(219, 54, 70, 1)',
    },
  ],
};

const backgroundSquarePlugin = {
  id: 'backgroundSquare',
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const { left, right, top, bottom } = chartArea;

    ctx.save();
    ctx.fillStyle = 'rgba(102, 23, 62, 0.13)';
    ctx.fillRect(left + 10, top + 10, right - left - 20, bottom - top - 20);
    ctx.restore();
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' },
    title: {
      display: true,
      text: 'RuneScape Gold Price Trends',
      font: { size: 20 },
      color: 'rgba(33, 33, 33, 1)',
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(21, 10, 63, 0.3)' }
    },

    y: {
      beginAtZero: true,
      max: 1000,
      grid: { color: 'rgba(21, 10, 63, 0.2)' },
    },
  },
};

const lineOptions = {
  responsive: true,
  plugins: { legend: { display: true, position: 'top' } },
  scales: {
    x: {
      grid: { color: 'rgba(21, 10, 63, 0.3)' }
    },

    y: {
      beginAtZero: true,
      max: 1000,
      grid: { color: 'rgba(21, 10, 63, 0.2)' },
    },
  },
};

function App() {
  return (
    <div style={{ width: '600px', margin: 'auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>RuneScape Market Trends</h2>
        <Bar data={data} options={barOptions} plugins={[backgroundSquarePlugin]} />
      </div>

      <div>
        <Line data={data} options={lineOptions} plugins={[backgroundSquarePlugin]} />
      </div>
    </div>
  );
}

export default App;