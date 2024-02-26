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
import { connect } from "react-redux";

interface IProps {
  modelname: string;
  username: string;
  project_name: string;
  modeltype: string;
}

const ModelPerformanceChart = ({
  data,
  validationCurveData,
  precisionRecallCurveData,
  modeltype,
  modelname,

  }) => {
  const [Data,setData] = useState(null);
  const [Data2,setData2] = useState(null);
  console.log("activeLabelType",modeltype)
  return (
    <div className="model-performance-chart">
        <div style={{ display: "flex"}}>
            <h2>Model Preformance </h2>
            <h2 style={{ color: '#76D7D5' ,marginLeft: "20px"}}>sda{modelname}</h2>
            <h2 style={{ color: '#EF2C12' ,marginLeft: "20px"}}> VS </h2>
            <h2 style={{ color: '#D476D7' ,marginLeft: "20px"}}>dsd{modelname}</h2>
            <button className="button-14" style={{ marginTop: "20px", marginLeft: "20px"}} onClick={() => {}}>
                Select Compare Model
            </button>
        </div>
        <div>
            <div className="Parameter" style={{ marginTop: "20px" , marginBottom: "20px"}}>
                <h3>Result</h3>
                <div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div style={{ flex: 1 }}>Average Precision {Data}%</div>
                        <div style={{ flex: 1 }}>||</div>
                        <div style={{ flex: 1 }}>Average Precision {Data2}%</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div style={{ flex: 1 }}>Precision {Data}%</div>
                        <div style={{ flex: 1 }}>||</div>
                        <div style={{ flex: 1 }}>Precision {Data2}%</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <div style={{ flex: 1 }}>Recall {Data}%</div>
                        <div style={{ flex: 1 }}>||</div>
                        <div style={{ flex: 1 }}>Recall {Data2}%</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="accuracy-graph">
        {modeltype === "IMAGE_RECOGNITION" ? (
            <React.Fragment>
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
            </React.Fragment>
        ) : (
            <React.Fragment>
            <h3>Fitness</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                <XAxis
                    dataKey="epoch"
                    label={{ value: "Epoch", position: "insideBottom", offset: 0 }}
                />
                <YAxis
                    label={{ value: "Fitness", angle: -90, position: "insideLeft" }}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Fitness"
                    stroke="#8884d8"
                />
                </LineChart>
            </ResponsiveContainer>
            </React.Fragment>
        )}
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

        <div className="Validation-Curve-graph">
            <h3>Training and Validation Loss</h3>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={validationCurveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="parameter"
                type="number"
                label={{
                    value: "Epochs",
                    position: "insideBottom",
                    offset: 0,
                }}
                />
                <YAxis
                label={{ value: "Loss", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Line
                type="monotone"
                dataKey="crossValidationScore"
                name="Cross Validation Score"
                stroke="blue"
                />
                <Line
                type="monotone"
                dataKey="trainingScore"
                name="Training Score"
                stroke="red"
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
        
        <div className="Precision-Curve-graph">
            <h3>Precision</h3>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={precisionRecallCurveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="recall"
                type="number"
                label={{ value: "Recall", position: "insideBottom", offset: 0 }}
                />
                <YAxis
                label={{ value: "Precision", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Line
                type="monotone"
                dataKey="precision"
                name="Precision"
                stroke="green"
                />
            </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="Precision-Recall-Curve-graph">
            <h3>Precision Recall</h3>
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={precisionRecallCurveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                dataKey="recall"
                type="number"
                label={{ value: "Recall", position: "insideBottom", offset: 0 }}
                />
                <YAxis
                label={{ value: "Precision", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Line
                type="monotone"
                dataKey="precision"
                name="Precision"
                stroke="green"
                />
            </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="Confusion-Matrix">
            <h3>Confusion Matrix</h3>
        </div>
    </div>
  );
};


// Example data for accuracy and cost over epochs
const Tab_Compare: React.FC<IProps> = ({
  modelname,
  username,
  project_name,
  modeltype,
}) => {
  const dataUrl = `${import.meta.env.VITE_BACKEND_URL}/result/`;
  const [data, setData] = useState([]);
  const [validationCurveData, setValidationCurveData] = useState([]);
  const [precisionRecallCurveData, setPrecisionRecallCurveData] = useState([]);

  useEffect(() => {
    const data = {
      username: username,
      project_name: project_name,
      modelname: modelname,
      modeltype: modeltype,
    };
    axios
      .post(dataUrl, data)
      .then((response) => {
        // Update the component's state with the received data
        const transformedData = response.data.loss.map((loss, index) => ({
          epoch: index + 1,
          accuracy: response.data.accuracy[index], // converting accuracy to a decimal between 0 and 1
          cost: loss,
        }));

        // Additional transformations for validationCurveData and precisionRecallCurveData
        const transformedValidationCurveData = response.data.validationCurve_Params.map(
          (param, index) => ({
            parameter: param,
            crossValidationScore: response.data.validationCurve_Cross_Validation_Score[index],
            trainingScore: response.data.validationCurve_Training_Score[index],
          })
        );

        const transformedPrecisionRecallCurveData =
        response.data.precisionRecallCurve_Precision.map((precision, index) => ({
            precision,
            recall: response.data.precisionRecallCurve_Recall[index],
          }));

        setData(transformedData);
        setValidationCurveData(transformedValidationCurveData);
        setPrecisionRecallCurveData(transformedPrecisionRecallCurveData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // mock data
        const validationCurve_Params = [1, 2, 3, 4, 5, 6, 7, 8];
        const validationCurve_Cross_Validation_Score = [
          0.85, 0.88, 0.92, 0.91, 0.89, 0.94, 0.96, 0.98,
        ];
        const validationCurve_Training_Score = [
          0.99, 0.98, 0.92, 0.95, 0.89, 0.98, 0.92, 0.95, 0.89,
        ];
        const precisionRecallCurve_Precision = [
          0.75, 0.82, 0.89, 0.91, 0.95, 0.75, 0.82, 0.89, 0.91, 0.95,
        ];
        const precisionRecallCurve_Recall = [
          0.1, 0.2, 0.4, 0.6, 0.65, 0.68, 0.75, 0.82, 0.88, 0.92,
        ];
        const transformedValidationCurveData = validationCurve_Params.map(
          (param, index) => ({
            parameter: param,
            crossValidationScore: validationCurve_Cross_Validation_Score[index],
            trainingScore: validationCurve_Training_Score[index],
          })
        );

        const transformedPrecisionRecallCurveData =
          precisionRecallCurve_Precision.map((precision, index) => ({
            precision,
            recall: precisionRecallCurve_Recall[index],
          }));

        setValidationCurveData(transformedValidationCurveData);
        setPrecisionRecallCurveData(transformedPrecisionRecallCurveData);
        
      });
  }, []);

  return (
    <div className="App">
      <ModelPerformanceChart
        data={data}
        validationCurveData={validationCurveData}
        precisionRecallCurveData={precisionRecallCurveData}
        modeltype={modeltype}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    project_name: state.user.project_name,
    modelname: state.user.modelname,
    modeltype: state.user.modeltype,
  };
};

export default connect(mapStateToProps)(Tab_Compare);
