import React, { useState, useEffect } from "react";
import axios from "axios";
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

// Example data for accuracy and cost over epochs
const Tab_Visualize = () => {
  const dataUrl = `${import.meta.env.VITE_BACKEND_URL}/result/`;
  const [data, setData] = useState([]);

  useEffect(() => {
    // Make the API request inside the useEffect hook
    const dataToSend = {
      username: 'test1',
      project_name: 'project-test1',
      modelname: 'mt1'
    };
    axios
      .post(dataUrl, dataToSend)
      .then((response) => {
        // Update the component's state with the received data
        const transformedData = response.data.loss.map((loss, index) => ({
          epoch: index + 1,
          accuracy: response.data.accuracy[index], // converting accuracy to a decimal between 0 and 1
          cost: loss,
        }));

        console.log(transformedData);
        setData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty dependency array [] ensures this effect runs once when the component mounts

  return (
    <div className="App">
      {/* Pass the data to the ModelPerformanceChart component */}
      <ModelPerformanceChart data={data} />
    </div>
  );
};

export default Tab_Visualize;
