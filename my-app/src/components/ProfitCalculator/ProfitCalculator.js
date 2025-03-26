import React, { useState, useEffect } from "react";
import "./ProfitCalculator.css";

function ProfitCalculator({ selectedItemId }) {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [profit, setProfit] = useState(null);

  useEffect(() => {
    if (!selectedItemId) return;

    setSellPrice("");
    setQuantity(1);
    setProfit(null);
    setCurrentPrice(null);

    const fetchLatestPrice = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/items/prices/${selectedItemId}?time=1W`);
        const data = await response.json();
        const latestPrice = data?.[data.length - 1]?.[2];

        if (latestPrice) {
          setCurrentPrice(latestPrice);
        }
      } catch (err) {
        console.error("Failed to fetch price:", err);
      }
    };

    fetchLatestPrice();
  }, [selectedItemId]);

  const calculateProfit = (e) => {
    e.preventDefault();
    if (!sellPrice || isNaN(sellPrice) || sellPrice <= 0 || !currentPrice) {
      setProfit(null);
      return;
    }

    const sellPriceNum = parseFloat(sellPrice);
    const profitPerItem = sellPriceNum - currentPrice;
    const totalProfit = profitPerItem * quantity;

    setProfit({
      perItem: profitPerItem,
      total: totalProfit,
    });
  };

  const getProfitClass = (value) => {
    if (value > 0) return "profit-positive";
    if (value < 0) return "profit-negative";
    return "profit-neutral";
  };

  if (!currentPrice) return null;

  return (
    <div className="profit-calculator">
      <h3>Profit Calculator</h3>
      <p className="current-price">Current Price: {currentPrice.toLocaleString()} gp</p>
      <form onSubmit={calculateProfit}>
        <label>Sell Price:</label>
        <input
          type="number"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          placeholder="Enter sell price"
          min="0"
          step="0.01"
        />

        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
        />

        <button type="submit">Calculate</button>
      </form>

      {profit !== null && (
        <div className="results">
          <p className={getProfitClass(profit.perItem)}>
            Profit per item: {profit.perItem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp
          </p>
          <p className={getProfitClass(profit.total)}>
            Total profit: {profit.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfitCalculator;
