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
  const [priceChangeAmount, setPriceChangeAmount] = useState("");
  const [priceChangeLabel, setPriceChangeLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [graphReady, setGraphReady] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const prevItemID = useRef(null);
  const priceGraphRef = useRef(null);

  const scrollToGraph = () => {
    priceGraphRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!itemID || itemID === prevItemID.current) return;

    prevItemID.current = itemID;

    setGraphReady(false);
    setChartVisible(false);
    setInfoVisible(false);
    setItemName("");
    setRecentPrice(null);
    setHoveredPrice(null);
    setPriceChangeAmount("");
    setPriceChangeLabel("");

    const fetchData = async () => {
      setIsLoading(true);

      let tempPrice = null;
      let tempChange = "";
      let tempGraphColor = "#00e676";
      let tempChartData = null;

      await fetchPriceData(
        itemID,
        timePeriod,
        tempGraphColor,
        timeIntervalLabels,
        (data) => (tempChartData = data),
        (price) => (tempPrice = price),
        (change) => (tempChange = change),
        (color) => (tempGraphColor = color)
      );

      const name = await fetchItemDetails(itemID);

      setIsLoading(false);
      setGraphReady(true);

      const coloredChartData = {
        ...tempChartData,
        datasets: [
          {
            ...tempChartData.datasets[0],
            borderColor: tempGraphColor,
            backgroundColor: `${tempGraphColor}33`,
          },
        ],
      };

      const label = timeIntervalLabels[timePeriod];
      const amountOnly = tempChange.replace(label, "").trim();

      setChartData(coloredChartData);

      setTimeout(() => {
        setChartVisible(true);
        setInfoVisible(true);
        setItemName(name);
        setRecentPrice(tempPrice);
        setPriceChangeAmount(amountOnly);
        setPriceChangeLabel(label);
      }, 50);
    };

    fetchData();
  }, [itemID, timePeriod]);

  useEffect(() => {
    if (!itemID) return;

    const fetchChartOnly = async () => {
      setIsLoading(true);

      let tempPrice = null;
      let tempChange = "";
      let tempGraphColor = "#00e676";
      let tempChartData = null;

      await fetchPriceData(
        itemID,
        timePeriod,
        tempGraphColor,
        timeIntervalLabels,
        (data) => (tempChartData = data),
        (price) => (tempPrice = price),
        (change) => (tempChange = change),
        (color) => (tempGraphColor = color)
      );

      const coloredChartData = {
        ...tempChartData,
        datasets: [
          {
            ...tempChartData.datasets[0],
            borderColor: tempGraphColor,
            backgroundColor: `${tempGraphColor}33`,
          },
        ],
      };

      const label = timeIntervalLabels[timePeriod];
      const amountOnly = tempChange.replace(label, "").trim();

      setIsLoading(false);
      setChartData(coloredChartData);
      setRecentPrice(tempPrice);
      setPriceChangeAmount(amountOnly);
      setPriceChangeLabel(label);
    };

    fetchChartOnly();
  }, [timePeriod, itemID]);

  return (
    <div className="page-container">
      <SearchItem
        onSelectItem={(id) => {
          setItemID(id);
          scrollToGraph();
        }}
      />

      <div className="container" ref={priceGraphRef}>
        <div className={`itemName fade-info ${infoVisible ? "visible" : ""}`}>
          {infoVisible && itemName}
        </div>

        <div className={`currentPrice fade-info ${infoVisible ? "visible" : ""}`}>
          {infoVisible && recentPrice !== null && `${hoveredPrice ?? recentPrice} GP`}
        </div>

        <div className={`priceChange fade-info ${infoVisible ? "visible" : ""}`}>
          {infoVisible && priceChangeAmount && (
            <>
              <span
                className="dynamic"
                style={{ color: chartData?.datasets?.[0]?.borderColor || "#00e676" }}
              >
                {priceChangeAmount + " "}
              </span>
              <span className="timeInterval">{priceChangeLabel}</span>
            </>
          )}
        </div>

        <div className="graphContainer">
          {isLoading ? (
            <div className="loading-bounce">
              Loading<span className="dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          ) : chartData && chartVisible && graphReady ? (
            <Line
              data={chartData}
              options={getChartOptions(
                chartData?.datasets?.[0]?.borderColor || "#00e676",
                clearChartElements,
                setHoveredPrice
              )}
              className="chart-fade visible"
            />
          ) : !itemID ? (
            <p style={{ textAlign: "center" }}>Enter an Item ID to view the graph.</p>
          ) : null}
        </div>

        <div className="buttonContainer">
          {["1W", "1M", "3M", "6M", "1Y", "5Y", "ALL"].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`button ${timePeriod === period ? "active" : ""}`}
              style={getButtonStyle(
                timePeriod === period,
                chartData?.datasets?.[0]?.borderColor || "#e0e0e0",
                isLoading
              )}
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
