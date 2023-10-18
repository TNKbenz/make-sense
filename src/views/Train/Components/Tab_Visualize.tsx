import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ModelPerformanceChart = ({ data }) => {
  return (
    <div className="model-performance-chart">
      <h2>Model Performance</h2>

      <div className="accuracy-graph">
        <h3>Accuracy</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="epoch"
              label={{ value: "Epoch", position: "insideBottom", offset: 0 }}
            />
            <YAxis
              label={{ value: "Accuracy", angle: -90, position: "insideLeft" }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="accuracy"
              name="Accuracy"
              stroke="#8884d8"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="cost-graph">
        <h3>Cost (Loss)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="epoch"
              label={{ value: "Epoch", position: "insideBottom", offset: 0 }}
            />
            <YAxis
              label={{ value: "Cost", angle: -90, position: "insideLeft" }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cost" name="Cost" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Tab_Visualize = () => {
  // Example data for accuracy and cost over epochs
  const mockData = [
    { epoch: 1, accuracy: 0.58, cost: 1.5 },
    { epoch: 2, accuracy: 0.62, cost: 1.4 },
    { epoch: 3, accuracy: 0.67, cost: 1.3 },
    { epoch: 4, accuracy: 0.71, cost: 1.2 },
    { epoch: 5, accuracy: 0.75, cost: 1.1 },
    { epoch: 6, accuracy: 0.79, cost: 1.0 },
    { epoch: 7, accuracy: 0.83, cost: 0.9 },
    { epoch: 8, accuracy: 0.87, cost: 0.8 },
    { epoch: 9, accuracy: 0.91, cost: 0.7 },
    { epoch: 10, accuracy: 0.94, cost: 0.6 },
    { epoch: 11, accuracy: 0.95, cost: 0.5 },
    { epoch: 12, accuracy: 0.96, cost: 0.4 },
    { epoch: 13, accuracy: 0.97, cost: 0.3 },
    { epoch: 14, accuracy: 0.98, cost: 0.2 },
    { epoch: 15, accuracy: 0.98, cost: 0.1 },
    { epoch: 16, accuracy: 0.98, cost: 0.09 },
    { epoch: 17, accuracy: 0.99, cost: 0.08 },
    { epoch: 18, accuracy: 0.99, cost: 0.07 },
    { epoch: 19, accuracy: 0.99, cost: 0.06 },
    { epoch: 20, accuracy: 0.99, cost: 0.05 },
    { epoch: 21, accuracy: 0.99, cost: 0.04 },
    { epoch: 22, accuracy: 0.99, cost: 0.03 },
    { epoch: 23, accuracy: 0.99, cost: 0.02 },
    { epoch: 24, accuracy: 0.99, cost: 0.01 },
    // Continue adding more epochs and data as needed
  ];

  return (
    <div className="App">
      <ModelPerformanceChart data={mockData} />
    </div>
  );
};

export default Tab_Visualize;
