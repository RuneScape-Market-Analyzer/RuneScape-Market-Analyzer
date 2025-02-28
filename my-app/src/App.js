import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
} from 'chart.js';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', border: '1px solid red' }}>
          <h3>Something went wrong with the charts.</h3>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const formatTimestamp = (timestamp) => {
  try {
    return format(new Date(timestamp), 'MMM d, yyyy');
  } catch {
    return timestamp;
  }
};

// Profit Calculator Component
function ProfitCalculator({ currentPrice }) {
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [profit, setProfit] = useState(null);

  const calculateProfit = (e) => {
    e.preventDefault();
    if (!sellPrice || isNaN(sellPrice) || sellPrice <= 0) {
      setProfit(null);
      return;
    }

    const sellPriceNum = parseFloat(sellPrice);
    const profitPerItem = sellPriceNum - currentPrice;
    const totalProfit = profitPerItem * quantity;
    
    setProfit({
      perItem: profitPerItem,
      total: totalProfit
    });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginTop: '20px' }}>
      <h3>Profit Calculator</h3>
      <div style={{ marginBottom: '15px' }}>
        <label>Current Price: {currentPrice.toLocaleString()} gp</label>
      </div>
      <form onSubmit={calculateProfit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>Sell Price:</label>
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="Enter sell price"
            min="0"
            step="0.01"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block' }}>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Calculate
        </button>
      </form>
      {profit !== null && (
        <div style={{ marginTop: '15px' }}>
          <p>Profit per item: {profit.perItem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp</p>
          <p>Total profit: {profit.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp</p>
          {profit.total < 0 && <p style={{ color: 'red' }}>Warning: This is a loss!</p>}
        </div>
      )}
    </div>
  );
}

function App() {
  const [itemIDs, setItemIDs] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Loading...',
      data: [],
      backgroundColor: 'rgba(118, 120, 237, 0.8)',
      borderColor: 'rgba(61, 52, 139, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(118, 120, 237, 1)',
    }],
  });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const chartAnimation = {
    duration: 1000,
    easing: 'easeOutQuart',
    delay: 300,
  };

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
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return `${value.toLocaleString()} gp`;
          }
        }
      }
    },
    scales: {
      x: { 
        grid: { color: 'rgba(61, 52, 139, 0.3)' },
        ticks: { autoSkip: true, maxRotation: 45 }
      },
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(61, 52, 139, 0.2)' },
        ticks: { 
          callback: (value) => {
            if (typeof value !== 'number') return '';
            return `${value.toLocaleString()} gp`;
          }
        }
      },
    },
    animation: chartAnimation,
  };

  const lineChartOptions = {
    ...barChartOptions,
    plugins: {
      ...barChartOptions.plugins,
      title: { display: false }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  useEffect(() => {
    const fetchItemIDs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://127.0.0.1:5000/items/ids');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format');

        setItemIDs(data);
        if (data.length > 0) {
          setSelectedItem(data[0]);
          await fetchPriceData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching item IDs:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemIDs();

    return () => {
      const chartInstances = ChartJS.instances;
      Object.keys(chartInstances).forEach(key => {
        chartInstances[key].destroy();
      });
    };
  }, []);

  const currentPrice = chartData.datasets[0].data.length > 0 
    ? chartData.datasets[0].data[chartData.datasets[0].data.length - 1]
    : 0;

  const fetchPriceData = async (itemID) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/items/prices/${itemID}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid price data format');

      const validData = data.filter(entry => 
        Array.isArray(entry) && entry.length >= 3 && !isNaN(entry[2])
      );

      setChartData({
        labels: validData.map(d => formatTimestamp(d[1])),
        datasets: [{
          label: `Price History for Item ${itemID}`,
          data: validData.map(d => Number(d[2])),
          backgroundColor: 'rgba(118, 120, 237, 0.8)',
          borderColor: 'rgba(61, 52, 139, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(118, 120, 237, 1)',
          pointRadius: 3,
          pointHoverRadius: 6,
        }],
      });

    } catch (error) {
      console.error("Error fetching price data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = itemIDs.filter(id => 
    id.toString().toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: '800px', margin: 'auto', textAlign: 'center' }}>
      <h2>RuneScape Market Trends</h2>
      
      {isLoading && (
        <div style={{ padding: '20px', color: '#666' }}>
          <div className="loading-spinner"></div>
          <p>Loading market data...</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', padding: '20px' }}>
          <h3>Error: {error}</h3>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <ErrorBoundary>
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ marginBottom: '5px', fontSize: '16px', fontWeight: 'bold' }}>Select an Item:</label>
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

          {chartData.datasets[0].data.length > 0 ? (
            <>
              <div style={{ width: '100%', height: '500px' }}>
                <Bar 
                  key={`bar-${selectedItem}`}
                  data={chartData}
                  options={barChartOptions}
                />
              </div>
              <div style={{ width: '100%', height: '500px' }}>
                <Line 
                  key={`line-${selectedItem}`}
                  data={chartData}
                  options={lineChartOptions}
                />
              </div>
              {/* Adding the Profit Calculator here */}
              <ProfitCalculator currentPrice={currentPrice} />
            </>
          ) : (
            <p>No price data available for selected item</p>
          )}
        </ErrorBoundary>
      )}
    </div>
  );
}

export default App;