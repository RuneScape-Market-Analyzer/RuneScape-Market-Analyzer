import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { format } from "date-fns";
import ProfitCalculator from "./ProfitCalculator";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatTimestamp = (timestamp) => {
  try {
    return format(new Date(timestamp), "yyyy-MM-dd");
  } catch {
    return timestamp;
  }
};

function App() {
  const [itemIDs, setItemIDs] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    const fetchItemIDs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/items/ids");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");

        setItemIDs(data);
        if (data.length > 0) {
          setSelectedItem(data[0]);
          await fetchPriceData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching item IDs:", error);
      }
    };

    fetchItemIDs();
  }, []);

  const fetchPriceData = async (itemID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/items/prices/${itemID}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid price data format");

      const validData = data.filter(
        (entry) => Array.isArray(entry) && entry.length >= 3 && !isNaN(entry[2])
      );

      setChartData({
        labels: validData.map((d) => formatTimestamp(d[1])),
        datasets: [
          {
            label: `Price History for Item ${itemID}`,
            data: validData.map((d) => Number(d[2])),
            backgroundColor: "rgba(118, 120, 237, 0.8)",
            borderColor: "rgba(61, 52, 139, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(118, 120, 237, 1)",
            pointRadius: 0,
            pointHoverRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  const filterDataByYear = (year) => {
    if (!chartData.labels.length || year === "all") return chartData;

    const filteredLabels = [];
    const filteredData = [];

    chartData.labels.forEach((label, index) => {
      if (label.startsWith(year)) {
        filteredLabels.push(label);
        filteredData.push(chartData.datasets[0].data[index]);
      }
    });

    return {
      labels: filteredLabels,
      datasets: [
        {
          ...chartData.datasets[0],
          data: filteredData,
        },
      ],
    };
  };

  const filteredItems = itemIDs.filter((id) =>
    id.toString().toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: "800px", margin: "auto", textAlign: "center" }}>
      <h2>RuneScape Market Trends</h2>

      {/* Search and Filters */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <div>
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "150px", padding: "5px", marginLeft: "5px" }}
          />
        </div>

        <div>
          <label>Select Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: "5px", marginLeft: "5px" }}>
            <option value="all">All Time</option>
            {[...new Set(chartData.labels.map((label) => label.split("-")[0]))].sort().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Scrollable Item Selection */}
      <div style={{ marginTop: "15px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>Select Item:</label>
        <select value={selectedItem} onChange={(e) => { setSelectedItem(e.target.value); fetchPriceData(e.target.value); }} size={3} style={{ width: "200px", padding: "5px" }}>
          {filteredItems.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      {/* Charts */}
      {chartData.datasets.length > 0 && (
        <>
          <Bar data={filterDataByYear(selectedYear)} />
          <Line data={filterDataByYear(selectedYear)} />
        </>
      )}

      {/* Profit Calculator */}
      <ProfitCalculator currentPrice={chartData.datasets[0]?.data?.slice(-1)[0] || 0} />
    </div>
  );
}

export default App;
