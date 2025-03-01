import React, { useState } from "react";

function ProfitCalculator({ currentPrice }) {
  const [sellPrice, setSellPrice] = useState("");
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
      total: totalProfit,
    });
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "5px", marginTop: "20px" }}>
      <h3>Profit Calculator</h3>
      <div style={{ marginBottom: "15px" }}>
        <label>Current Price: {currentPrice.toLocaleString()} gp</label>
      </div>
      <form onSubmit={calculateProfit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Sell Price:</label>
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="Enter sell price"
            min="0"
            step="0.01"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#4CAF50", color: "white", border: "none" }}>
          Calculate
        </button>
      </form>
      {profit !== null && (
        <div style={{ marginTop: "15px" }}>
          <p>Profit per item: {profit.perItem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp</p>
          <p>Total profit: {profit.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp</p>
          {profit.total < 0 && <p style={{ color: "red" }}>Warning: This is a loss!</p>}
        </div>
      )}
    </div>
  );
}

export default ProfitCalculator;