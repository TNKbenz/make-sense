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
// import { PopupCompare } from "./PopupCompare";

interface IProps {
  modelname: string;
  username: string;
  project_name: string;
  modeltype: string;
  compare_modelname: string;
}

const ModelPerformanceChart = ({
  data,
  validationCurveData,
  precisionCurveData,
  recallCurveData,
  modeltype,
  modelname,
  compare_modelname,
  MetaData,
  MetaData2,
  isPopupVisible,
  togglePopup,
  username,
  project_name,
  updateModelNameAction,
}) => {
  console.log("activeLabelType", modeltype);
  return (
    <div className="model-performance-chart">
      <div style={{ display: "flex" }}>
        <h2>Model Preformance </h2>
        <h2 style={{ color: "#76D7D5", marginLeft: "20px" }}>Model 1 [ {modelname} ] </h2>
        <h2 style={{ color: "#EF2C12", marginLeft: "20px" }}> VS </h2>
        <h2 style={{ color: "#D476D7", marginLeft: "20px" }}>Model 2 [ {compare_modelname} ]</h2>
        {/* {isPopupVisible && <PopupCompare onClose={togglePopup}/>} */}
        <button
          className="button-14"
          style={{ marginTop: "20px", marginLeft: "20px" }}
          onClick={togglePopup}
        >
          Select Compare Model
        </button>
      </div>
      <div>
        <div className="Parameter" style={{ marginTop: "20px", marginBottom: "20px" }}>
          <h3>Result</h3>
          <div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ flex: 1 }}>
                Average Precision{" "}
                {MetaData && MetaData.average_precision !== null && MetaData.average_precision !== undefined
                  ? ` ${MetaData.average_precision.toFixed(2)}`
                  : "not available"}
              </div>
              <div style={{ flex: 1 }}></div>
              <div style={{ flex: 1 }}>
                Average Precision{" "}
                {MetaData2 && MetaData2.average_precision !== null && MetaData2.average_precision !== undefined
                  ? ` ${MetaData2.average_precision.toFixed(2)}`
                  : "not available"}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ flex: 1 }}>
                Precision{" "}
                {MetaData && MetaData.precision !== null && MetaData.precision !== undefined
                  ? ` ${MetaData.precision.toFixed(2)}`
                  : "not available"}
              </div>
              <div style={{ flex: 1 }}></div>
              <div style={{ flex: 1 }}>
                Precision{" "}
                {MetaData2 && MetaData2.precision !== null && MetaData2.precision !== undefined
                  ? ` ${MetaData2.precision.toFixed(2)}`
                  : "not available"}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div style={{ flex: 1 }}>
                Recall{" "}
                {MetaData && MetaData.recall !== null && MetaData.recall !== undefined
                  ? ` ${MetaData.recall.toFixed(2)}`
                  : "not available"}
              </div>
              <div style={{ flex: 1 }}></div>
              <div style={{ flex: 1 }}>
                Recall{" "}
                {MetaData2 && MetaData2.recall !== null && MetaData2.recall !== undefined
                  ? ` ${MetaData2.recall.toFixed(2)}`
                  : "not available"}
              </div>
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
                <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#8884d8" />
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
                <Line type="monotone" dataKey="accuracy" name="Fitness" stroke="#8884d8" />
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

      {modeltype === "IMAGE_RECOGNITION" && (
        <div className="Validation-Curve-graph">
          <h3>Validation Accuracy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={validationCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="epoch"
                label={{
                  value: "Epoch",
                  position: "insideBottom",
                  offset: 0,
                }}
                domain={[1, "auto"]}
              />
              <YAxis
                label={{ value: "Accuracy", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="validation accuracy"
                stroke="#030C56"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {modeltype === "IMAGE_RECOGNITION" && (
        <div className="Validation-Curve-graph">
          <h3>Validation Loss</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={validationCurveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="epoch"
                label={{
                  value: "Epoch",
                  position: "insideBottom",
                  offset: 0,
                }}
                domain={[1, "auto"]}
              />
              <YAxis
                label={{ value: "Loss", angle: -90, position: "insideLeft", offset: 0 }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                name="validation loss"
                stroke="#560305"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="Precision-Curve-graph">
        <h3>Precision</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={precisionCurveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="epoch"
              label={{ value: "Epoch", position: "insideBottom", offset: 0 }}
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
              stroke="#2FEEDC"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="Recall-Curve-graph">
        <h3>Recall</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={recallCurveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="epoch"
              label={{ value: "Epoch", position: "insideBottom", offset: 0 }}
            />
            <YAxis
              label={{ value: "Recall", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="recall"
              name="Recall"
              stroke="green"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Tab_Compare: React.FC<IProps> = ({
  modelname,
  username,
  project_name,
  modeltype,
  compare_modelname,
}) => {
  const dataUrl = `${import.meta.env.VITE_BACKEND_URL}/result/`;
  const dataUrl2 = `${import.meta.env.VITE_BACKEND_URL}/model/metadata?username=${username}&project_name=${project_name}&model_name=${modelname}`;
  const dataUrl3 = `${import.meta.env.VITE_BACKEND_URL}/model/metadata?username=${username}&project_name=${project_name}&model_name=${compare_modelname}`;
  const [data, setData] = useState([]);
  const [validationCurveData, setValidationCurveData] = useState([]);
  const [precisionCurveData, setPrecisionCurveData] = useState([]);
  const [RecallCurveData, setRecallCurveData] = useState([]);
  const [MetaData, setMetaData] = useState(null);
  const [MetaData2, setMetaData2] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
    const data = {
      username: username,
      project_name: project_name,
      modelname: modelname,
      modeltype: modeltype,
      compare_modelname: compare_modelname,
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

        const transformedPrecisionCurveData = response.data.precision.map(
          (precision, index) => ({
            precision,
            epoch: index + 1,
          })
        );

        const transformedRecallCurveData = response.data.recall.map(
          (recall, index) => ({
            recall,
            epoch: index + 1,
          })
        );

        setData(transformedData);
        setPrecisionCurveData(transformedPrecisionCurveData);
        setRecallCurveData(transformedRecallCurveData);
        if (modeltype === "IMAGE_RECOGNITION") {
          const transformedValidationCurveData = response.data.val_loss.map(
            (loss, index) => ({
              accuracy: response.data.val_accuracy[index],
              epoch: index + 1,
              cost: loss,
            })
          );
          setValidationCurveData(transformedValidationCurveData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .get(dataUrl2)
      .then((response) => {
        setMetaData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching MetaData:", error);
      });
      axios
      .get(dataUrl3)
      .then((response) => {
        setMetaData2(response.data);
      })
      .catch((error) => {
        console.error("Error fetching MetaData:", error);
      });
  }, []);

  return (
    <div className="App">
      <ModelPerformanceChart
        data={data}
        validationCurveData={validationCurveData}
        precisionCurveData={precisionCurveData}
        recallCurveData={RecallCurveData}
        compare_modelname={compare_modelname}
        modeltype={modeltype}
        modelname={modelname}
        MetaData={MetaData}
        MetaData2={MetaData2}
        isPopupVisible={isPopupVisible}
        togglePopup={togglePopup}
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
    compare_modelname: state.user.compare_modelname,
  };
};

export default connect(mapStateToProps)(Tab_Compare);
