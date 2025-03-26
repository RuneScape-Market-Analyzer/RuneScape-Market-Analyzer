import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js";
import "chart.js/auto";
import "./PriceGraph.css";
import {
  timeIntervalLabels,
  fetchPriceData,
  fetchItemDetails,
  clearChartElements,
  getButtonStyle,
  getChartOptions,
} from "./PriceGraphUtils";
import SearchItem from "./SearchItem";
import ProfitCalculator from "../../components/ProfitCalculator/ProfitCalculator";

Chart.register({
  id: "crosshairLine",
  afterDatasetsDraw: (chart) => {
    const { ctx } = chart;
    const yAxis = chart.scales.y;

    if (chart.tooltip?._active?.length) {
      const { x } = chart.tooltip._active[0].element;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, yAxis.top);
      ctx.lineTo(x, yAxis.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.stroke();
      ctx.restore();
    }
  },
});

const PriceGraph = () => {
  const [itemID, setItemID] = useState("");
  const [timePeriod, setTimePeriod] = useState("1Y");
  const [chartData, setChartData] = useState(null);
  const [itemName, setItemName] = useState("");
  const [recentPrice, setRecentPrice] = useState(null);
  const [priceChangeText, setPriceChangeText] = useState("");
  const [graphColor, setGraphColor] = useState("#00e676");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [graphReady, setGraphReady] = useState(false);

  const priceGraphRef = useRef(null);

  const scrollToGraph = () => {
    priceGraphRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!itemID) return;

    setGraphReady(false);

    const fetchData = async () => {
      setIsLoading(true);
      await fetchPriceData(
        itemID,
        timePeriod,
        graphColor,
        timeIntervalLabels,
        setChartData,
        setRecentPrice,
        setPriceChangeText,
        setGraphColor
      );
      setIsLoading(false);
      setGraphReady(true);
    };

    fetchData();
    fetchItemDetails(itemID, setItemName);
  }, [itemID, timePeriod, graphColor]);

  return (
    <div className="page-container">
      <SearchItem
        onSelectItem={(id) => {
          setItemID(id);
          scrollToGraph();
        }}
      />

      <div className="container" ref={priceGraphRef}>
        {itemName && <div className="itemName">{itemName}</div>}

        {/* Price details */}
        {recentPrice !== null && (
          <div className="currentPrice">
            {`${hoveredPrice ?? recentPrice} GP`}
          </div>
        )}

        {/* Price change details */}
        {!isLoading && priceChangeText && (
          <div className="priceChange">
            <span className="dynamic" style={{ color: graphColor }}>
              {priceChangeText.split(timeIntervalLabels[timePeriod])[0]}
            </span>
            <span className="timeInterval">{timeIntervalLabels[timePeriod]}</span>
          </div>
        )}

        {/* Graph */}
        <div className="graphContainer">
          {isLoading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : chartData ? (
            <Line
              data={chartData}
              options={getChartOptions(graphColor, clearChartElements, setHoveredPrice)}
            />
          ) : (
            <p style={{ textAlign: "center" }}>Enter an Item ID to view the graph.</p>
          )}
        </div>

        {/* Time period buttons */}
        <div className="buttonContainer">
          {["1W", "1M", "3M", "6M", "1Y", "5Y", "ALL"].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`button ${timePeriod === period ? "active" : ""}`}
              style={getButtonStyle(timePeriod === period, graphColor)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {itemID && graphReady && (
        <div style={{ width: "80%", margin: "24px auto 0" }}>
          <ProfitCalculator selectedItemId={itemID} />
        </div>
      )}
    </div>
  );
};

export default PriceGraph;
