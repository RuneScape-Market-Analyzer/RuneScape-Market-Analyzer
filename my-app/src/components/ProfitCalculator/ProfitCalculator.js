import React, { useState, useEffect } from "react";
import "./ProfitCalculator.css";

function ProfitCalculator({ selectedItemId }) {
  // State to store the current market price of the item
  const [currentPrice, setCurrentPrice] = useState(null);

  // State to store the custom sell price set by the user
  const [customSellPrice, setCustomSellPrice] = useState("");

  // State to store the quantity selected by the user (default is 1)
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // State to store the predicted data fetched from the server
  const [predictedData, setPredictedData] = useState(null);

  // Fetch current price and prediction data when the selected item changes
  useEffect(() => {
    if (!selectedItemId) return;

    setSelectedQuantity(1); // Reset quantity to default
    setPredictedData(null); // Reset predicted data

    // Fetch the latest market price for the item
    const fetchLatestPrice = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/items/prices/${selectedItemId}?time=1W`
        );
        const data = await response.json();
        const latestPrice = data?.[data.length - 1]?.[2];
        if (latestPrice) {
          setCurrentPrice(latestPrice);
          setCustomSellPrice(latestPrice); // Set default custom sell price to current market price
        }
      } catch (err) {
        console.error("Failed to fetch price:", err);
      }
    };

    // Fetch predicted data for the selected item
    const fetchPredictedData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/items/prices/predict/${selectedItemId}`
        );
        const data = await response.json();
        setPredictedData(data);
      } catch (err) {
        console.error("Failed to fetch predicted data:", err);
      }
    };

    fetchLatestPrice(); // Call function to fetch current market price
    fetchPredictedData(); // Call function to fetch prediction data
  }, [selectedItemId]);

  // Calculate total profit based on predicted price
  const predictedProfit =
    predictedData && currentPrice
      ? (predictedData.predicted_price - currentPrice) * selectedQuantity
      : null;

  // Calculate total profit based on custom sell price
  const customProfit =
    customSellPrice && currentPrice
      ? (customSellPrice - currentPrice) * selectedQuantity
      : null;

  // Calculate profit per item based on custom sell price
  const customProfitPerItem =
    customSellPrice && currentPrice
      ? customSellPrice - currentPrice
      : null;

  // Handle quantity selection by updating state
  const handleQuantityClick = (quantity) => {
    setSelectedQuantity(quantity);
  };

  // Handle slider value change for custom sell price
  const handleSliderChange = (value) => {
    setCustomSellPrice(value);
  };

  // Determine CSS class for profit-based coloring (positive, negative, neutral)
  const getProfitClass = (value) => {
    if (value > 0) return "profit-positive";
    if (value < 0) return "profit-negative";
    return "";
  };

  // Determine CSS class for custom sell price coloring
  const getSellPriceColor = () => {
    if (customSellPrice > currentPrice) return "profit-positive";
    if (customSellPrice < currentPrice) return "profit-negative";
    return "";
  };

  return (
    <div className="profit-calculator">
      {/* Header section */}
      <h3 className="dashboard-header">Machine Learning Driven Profit Calculator</h3>
      <p className="current-price">Current Market Price: {currentPrice?.toLocaleString()} gp</p>

      {/* Quantity selector with preset buttons */}
      <div className="quantity-selector">
        <h4>Choose Your Quantity</h4>
        {[1, 5, 10, 50, 100].map((quantity) => (
          <button
            key={quantity}
            onClick={() => handleQuantityClick(quantity)}
            className={`quantity-button ${
              selectedQuantity === quantity ? "quantity-selected" : ""
            }`}
          >
            {quantity}
          </button>
        ))}
      </div>

      <div className="profit-columns">
        {/* ML Predicted Profit Calculator */}
        <div className="profit-column">
          <h4 className="section-header">ML Predicted Profit Calculator</h4>
          {predictedData ? (
            <table className="prediction-table">
              <tbody>
                <tr>
                  <td>Estimated Future Price</td>
                  <td className={getProfitClass(predictedData.predicted_price - currentPrice)}>
                    {predictedData.predicted_price?.toLocaleString()} gp
                  </td>
                </tr>
                <tr>
                  <td>Projected Price Movement</td>
                  <td className={getProfitClass(predictedData.predicted_change)}>
                    {predictedData.predicted_change?.toLocaleString()} gp
                  </td>
                </tr>
                <tr>
                  <td>Projected Change (%)</td>
                  <td className={getProfitClass(predictedData.predicted_change_percent)}>
                    {predictedData.predicted_change_percent?.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td>Your Estimated Profit (Total)</td>
                  <td className={getProfitClass(predictedProfit)}>
                    {predictedProfit !== null
                      ? predictedProfit.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "N/A"}{" "}
                    gp
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Loading predicted data...</p>
          )}
        </div>

        {/* Custom Profit Calculator */}
        <div className="profit-column">
          <h4 className="section-header">Custom Profit Calculator</h4>
          {/* Custom sell price label */}
          <div className="sell-price-label">
            <p>Set Your Custom Sell Price</p>
            <p className={getSellPriceColor()}>{customSellPrice?.toLocaleString()} gp</p>
          </div>
          {/* Slider for custom sell price */}
          <input
            type="range"
            min={Math.max(0, currentPrice - 1000)}
            max={currentPrice + 1000}
            value={customSellPrice}
            step="10"
            onChange={(e) => handleSliderChange(e.target.value)}
            className="custom-sell-slider"
          />
          <div className="custom-profit-section">
            {/* Profit per item */}
            <p>Your Estimated Profit (Per Item)</p>
            <p className={getProfitClass(customProfitPerItem)}>
              {customProfitPerItem !== null
                ? customProfitPerItem.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "N/A"}{" "}
              gp
            </p>
            {/* Total profit */}
            <p>Your Estimated Profit (Total)</p>
            <p className={getProfitClass(customProfit)}>
              {customProfit !== null
                ? customProfit.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "N/A"}{" "}
              gp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitCalculator;
