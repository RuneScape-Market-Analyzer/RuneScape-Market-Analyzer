import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  PointElement
} from 'chart.js';
import './HotItems.css';

ChartJS.register(LineElement, LinearScale, CategoryScale, Tooltip, Legend, Title, PointElement);

function HotItems() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [volumeTrends, setVolumeTrends] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('http://localhost:5000/items/prices/top-value');
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const trendData = await Promise.all(
          items.map(async ([id]) => {
            const res = await fetch(`http://localhost:5000/items/volume-history/${id}?time=1W`);
            const json = await res.json();
            if (!Array.isArray(json)) return [];
            return json.map(([date, volume]) => ({ date, volume }));
          })
        );
        setVolumeTrends(trendData);
      } catch (error) {
        console.error('Error fetching volume trends:', error);
      }
    };
    if (items.length > 0) {
      loadTrends();
    }
  }, [items]);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setIndex(prev => (prev + 1) % items.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [items, isHovered]);

  if (!items.length || !volumeTrends.length) {
    return (
      <div className="hot-items-container" style={{ maxWidth: '1400px' }}>
        <div className="hot-loading-card">
          <div className="loading-bounce">
            Loading<span className="dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = items[index];
  const currentTrend = volumeTrends[index] || [];

  const rawVolumes = currentTrend.map(d => d.volume);
  const percentChange = (rawVolumes.length > 1 && rawVolumes[0] !== 0)
    ? (((rawVolumes[rawVolumes.length - 1] - rawVolumes[0]) / rawVolumes[0]) * 100).toFixed(1)
    : 0;

  const chartData = {
    labels: currentTrend.map(d => d.date),
    datasets: [
      {
        label: '',
        data: rawVolumes,
        fill: true,
        pointBackgroundColor: 'white',
        borderColor: '#9c5cff',
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const {ctx: context, chartArea} = chart;

          if (!chartArea) return null;

          const gradient = context.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(156, 92, 255, 0.4)');
          gradient.addColorStop(0.5, 'rgba(156, 92, 255, 0.15)');
          gradient.addColorStop(1, 'rgba(156, 92, 255, 0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Trade Volume Over 7 Days',
        color: '#fff',
        font: { size: 18 }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        displayColors: false,
        backgroundColor: '#1e1b20',
        borderColor: '#9c5cff',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#ccc',
        callbacks: {
          label: (context) => `Volume: ${context.raw.toLocaleString()}`
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: '#9c5cff',
        borderColor: '#9c5cff',
        borderWidth: 2
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#ccc'
        },
        ticks: { display: false },
        grid: { display: false }
      },
      y: {
        title: {
          display: true,
          text: 'Volume',
          color: '#ccc'
        },
        ticks: { display: false },
        grid: { display: false }
      }
    }
  };

  const next = () => setIndex((index + 1) % items.length);
  const prev = () => setIndex((index - 1 + items.length) % items.length);

  return (
    <div className="hot-items-container" style={{ maxWidth: '1400px' }}>
      <p className="hot-desc">
        <strong>These are the top 5 most valuable items based on total trade value</strong> (price × volume).
        <br />
        <small style={{ color: '#aaa' }}>
          Order based on current total trade value.
        </small>
      </p>
      <div
        className="hot-card hot-fade-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        <div className="hot-rank" title="Based on current trade value" style={{ top: '12px', right: '12px' }}>#{index + 1}</div>
        <div className="hot-nav left" onClick={prev}><div className="triangle triangle-left"></div></div>
        <div className="hot-content">
          <div className="hot-chart">
            {currentTrend.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p style={{ color: 'gray', textAlign: 'center' }}>No volume data available</p>
            )}
          </div>

          <div className="hot-item-info">
            <img
              src={`https://secure.runescape.com/m=itemdb_rs/obj_sprite.gif?id=${currentItem?.[0]}`}
              alt={currentItem?.[1]}
              className="hot-item-icon"
            />
            <h3>{currentItem?.[1]}</h3>
            <div className="hot-stats">
              <div className="hot-stat">Price: <span>{currentItem?.[2].toLocaleString()} gp</span></div>
              <div className="hot-stat">Volume: <span>{currentItem?.[3].toLocaleString()}</span></div>
              <div
                className={`hot-badge ${percentChange > 0 ? 'gain' : percentChange < 0 ? 'decline' : 'neutral'}`}
                title="Shows the change in trade volume from start to end of the past 7 days"
              >
                {percentChange > 0 ? '+' : ''}{percentChange}% volume change
              </div>
            </div>
          </div>
        </div>
        <div className="hot-nav right" onClick={next}><div className="triangle triangle-right"></div></div>
      </div>
      <div className="hot-dots">
        {items.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default HotItems;
