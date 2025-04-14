export const timeIntervalLabels = {
  "1W": "Past week",
  "1M": "Past month",
  "3M": "Past 3 months",
  "6M": "Past 6 months",
  "1Y": "Past year",
  "5Y": "Past 5 years",
  ALL: "Max time",
};

export const fetchPriceData = async (
  itemID,
  timePeriod,
  graphColor,
  timeIntervalLabels,
  setChartData,
  setRecentPrice,
  setPriceChangeText,
  setGraphColor
) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/items/prices/${itemID}?time=${timePeriod}`
    );
    const data = await response.json();

    if (!data?.length) return;

    const labels = data.map((entry) => entry[1]);
    const prices = data.map((entry) => entry[2]);
    const priceChange = (prices[prices.length - 1] - prices[0]).toFixed(2);
    const percentChange = ((priceChange / prices[0]) * 100).toFixed(2);
    const isPositive = priceChange >= 0;

    setRecentPrice(prices[prices.length - 1]);
    setGraphColor(isPositive ? "#00e676" : "#ff1744");
    setPriceChangeText(`${priceChange > 0 ? "+" : ""}${priceChange} GP (${percentChange}%) ${timeIntervalLabels[timePeriod]}`);
    setChartData({
      labels,
      datasets: [
        {
          label: `Item ${itemID} Prices`,
          data: prices,
          borderColor: graphColor,
          backgroundColor: `${graphColor}33`,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchItemDetails = async (itemID) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/items/name/${itemID}`);
    const data = await response.json();
    return data?.[0]?.[0] || "";
  } catch (error) {
    console.error("Error fetching item name:", error);
    return "";
  }
};
export const clearChartElements = (chart) => {
  chart.setActiveElements([]);
};

export const getButtonStyle = (isActive, graphColor, isLoading) => ({
  color: isActive
    ? isLoading
      ? "#ffffff"
      : graphColor
    : "#e0e0e0",
  fontWeight: isActive ? "bold" : "normal",
  backgroundColor: isActive
    ? isLoading
      ? "transparent"
      : `${graphColor}22`
    : "transparent",
  transition: "color 0.3s ease, background-color 0.3s ease"
});

export const getChartOptions = (graphColor, clearChartElements, setHoveredPrice) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      intersect: false,
      mode: "index",
      callbacks: { label: (context) => `${context.raw} GP` },
    },
  },
  onHover: (event, elements, chart) => {
    const points = chart.getElementsAtEventForMode(
      event.native,
      "index",
      { intersect: false },
      true
    );
    if (points.length) {
      const { datasetIndex, index } = points[0];
      setHoveredPrice(chart.data.datasets[datasetIndex].data[index]);
    } else {
      setHoveredPrice(null);
      clearChartElements(chart);
    }
  },
  scales: {
    x: { ticks: { display: false }, grid: { display: false } },
    y: { ticks: { display: false }, grid: { display: false } },
  },
});
