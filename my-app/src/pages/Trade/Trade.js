import React from "react";
import PriceGraph from "./PriceGraph";
import "../../index.css";

function Trade() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1 className="global-title">Trade Page</h1>
      <PriceGraph />
    </div>
  );
}

export default Trade;