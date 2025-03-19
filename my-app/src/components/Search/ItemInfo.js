import React from "react";
import PriceChart from "./PriceChart";

const ItemInfo = ({ selectedItem, priceData, priceChange }) => {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "18px",
        border: "2px solid #f72585",
        borderRadius: "10px",
        background: "#1A1A2E",
        color: "white",
        boxShadow: "0px 0px 15px #f72585",
        animation: "fadeIn 0.5s ease-in-out",
        width: "100%",
        maxWidth: "640px",
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        {selectedItem.bigImageUrl && (
          <img
            src={selectedItem.bigImageUrl}
            alt={selectedItem.name}
            className="fade-in-image"
            onError={(e) => {
              e.target.src = "/fallback-image.png";
            }}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "contain",
              position: "absolute",
              left: "-60px",
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0,
              animation: "fadeInPop 0.6s ease-in-out forwards",
            }}
          />
        )}

        <h3
          style={{
            color: "#FFFFFF",
            fontSize: "23px",
            margin: "0 auto",
            display: "inline-block",
            position: "relative",
          }}
        >
          {selectedItem.name}
        </h3>
      </div>

      <p style={{ fontSize: "17px" }}>
        <strong style={{ color: "#FFA07A" }}>ID:</strong> {selectedItem.item_id}
      </p>
      <p style={{ fontSize: "17px" }}>
        <strong style={{ color: "#FFA07A" }}>Description:</strong> {selectedItem.description}
      </p>
      <p style={{ fontSize: "19px" }}>
        <strong style={{ color: "gold" }}>💰 Current Price:</strong> {priceData?.slice(-1)[0]?.price || "N/A"} GP
      </p>

      <p style={{ fontSize: "17px", color: priceChange.color }}>
        {priceChange.difference >= 0 ? "+" : ""}{priceChange.difference.toFixed(1)} GP
      </p>

      <PriceChart priceData={priceData} />
    </div>
  );
};

export default ItemInfo;
