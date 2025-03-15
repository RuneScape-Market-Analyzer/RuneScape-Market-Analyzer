import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import PriceGraph from "../../components/PriceGraph/PriceGraph.js";

function Test() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Graph Test Page! Coming soon!</h1>
            <PriceGraph />
        </div>
    );
}

export default Test;
