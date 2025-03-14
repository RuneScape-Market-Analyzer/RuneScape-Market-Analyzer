import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { format } from "date-fns";

const PriceChart = ({ priceData }) => {
  if (!priceData || priceData.length === 0) return null;

  return (
    <Line
      data={{
        labels: priceData.map((d) => format(new Date(d.date), "MMM dd")),
        datasets: [
          {
            label: "Price History (1 Week)",
            data: priceData.map((d) => d.price),
            borderColor: "#E81760",
            backgroundColor: "rgba(118, 120, 237, 0.1)",
            pointBackgroundColor: "#E81760",
            pointBorderColor: "#rgba(118, 120, 237, 0.1)",
            pointBorderWidth: 2,
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 6,
            fill: true,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: { color: "#FFFFFF" },
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: { color: "#FFFFFF" },
          },
        },
      }}
    />
  );
};

export default PriceChart;
