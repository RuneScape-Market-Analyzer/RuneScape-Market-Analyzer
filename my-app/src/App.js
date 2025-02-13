import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Background Square (decorative - serves no actual function)
const backgroundSquarePlugin = {
  id: 'backgroundSquare',
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const { left, right, top, bottom } = chartArea;

    ctx.save();
    ctx.fillStyle = 'rgba(118, 120, 237, 0.2)';
    ctx.fillRect(left + 10, top + 10, right - left - 20, bottom - top - 20);
    ctx.restore();
  },
};

// Bar Chart Setup
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
    title: {
      display: true,
      text: 'Item Price Trends',
      font: { size: 20 },
      color: 'rgba(33, 33, 33, 1)',
    },
  },
  scales: {
    x: { grid: { color: 'rgba(61, 52, 139, 0.3)' } },
    y: { beginAtZero: true, grid: { color: 'rgba(61, 52, 139, 0.2)' } },
  },
};

// Line Chart SetUp
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: false },
  },
  scales: {
    x: { grid: { color: 'rgba(61, 52, 139, 0.3)' } },
    y: { beginAtZero: true, grid: { color: 'rgba(61, 52, 139, 0.2)' } },
  },
};

// Manging states for Item IDs, Selected Item, and Chart Data
function App() {
  const [itemIDs, setItemIDs] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: `Price for Item ${selectedItem || '...'}`,
      data: [],
      backgroundColor: 'rgba(118, 120, 237, 0.8)',
      borderColor: 'rgba(61, 52, 139, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(118, 120, 237, 1)',
    }],
  });  

  // Get item IDs
  useEffect(() => {
    const fetchItemIDs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/items/ids');
        const data = await response.json();
        console.log("Fetched Item IDs:", data);

        if (Array.isArray(data) && data.length > 0) {
          setItemIDs(data);
          setSelectedItem(data[0]);
          fetchPriceData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching item IDs:", error);
      }
    };

    fetchItemIDs();
  }, []);

  // Get price data for selected item
  const fetchPriceData = async (itemID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/items/prices/${itemID}`);
      const data = await response.json();
      console.log("Fetched Price Data:", data);

      if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0]) || data[0].length < 3) {
        throw new Error("Invalid data format received from backend");
      }

      const timestamps = data.map(entry => entry[1]);
      const prices = data.map(entry => entry[2]);

      setChartData({
        labels: timestamps,
        datasets: [{
          label: `Price for Item ${itemID}`,
          data: prices,
          backgroundColor: 'rgba(118, 120, 237, 0.8)',
          borderColor: 'rgba(61, 52, 139, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(118, 120, 237, 1)',
        }],
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch price data. Check backend and item ID.");
    }
  };

  const [search, setSearch] = useState('');

  const filteredItems = itemIDs.filter(id => id.toString().includes(search));

  return (
    <div style={{ width: '800px', margin: 'auto', textAlign: 'center' }}>
      <h2>RuneScape Market Trends</h2>
      
      {/* Search and Item Menu */}
      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>Select an Item:</label>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '185px',
            padding: '8px',
            marginBottom: '5px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />

        {/* Scroll Item Menu */}
        <select 
          value={selectedItem} 
          onChange={(e) => {
            setSelectedItem(e.target.value);
            fetchPriceData(e.target.value);
          }}
          style={{
            padding: '9px',
            fontSize: '16px',
            width: '200px',
            maxHeight: '73px',
            overflowY: 'auto',
          }}
          size={3}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map(id => (
              <option key={id} value={id}>
                {id}
              </option>
            ))
          ) : (
            <option>No matching items</option>
          )}
        </select>
      </div>

      {/* Bar Chart */}
      <div style={{ width: '100%', height: '500px' }}>
        <Bar 
          data={{
            ...chartData,
            datasets: [{
              ...chartData.datasets[0],
              barThickness: 6,
            }]
          }} 
          options={{
            ...barChartOptions, 
            maintainAspectRatio: true,
          }} 
          plugins={[backgroundSquarePlugin]} 
        />
      </div>

      {/* Line Chart */}
      <div style={{ width: '100%', height: '500px' }}>
        <Line 
          data={chartData} 
          options={{
            ...lineChartOptions, 
            maintainAspectRatio: true,
          }} 
          plugins={[backgroundSquarePlugin]} 
        />
      </div>
    </div>
  );
}

export default App;