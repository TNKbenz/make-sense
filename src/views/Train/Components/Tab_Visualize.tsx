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
  notice_update: string;
}

const ModelPerformanceChart = ({
  data,
  validationCurveData,
  precisionCurveData,
  recallCurveData,
  ConfusionMatrix,
  modeltype,
  notice_update,
  setRefreshButton 
  }) => {
  const [RefreshButton, setLocalRefreshButton] = useState(false);
  console.log("activeLabelType",modeltype)
  console.log("notice",notice_update)
  useEffect(() => {
    setLocalRefreshButton(setRefreshButton);
  }, [RefreshButton, setRefreshButton]);
  return (
    <div className="model-performance-chart">
      <div style={{ display: "flex" }}>
        <h2>Model Performance</h2>
        <button className="button-14" onClick={() => {setLocalRefreshButton(true)}} style={{  marginLeft: "auto",marginTop: "20px" }}>
          Refresh
        </button>
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
              domain={[1, 'auto']} // กำหนดให้แกน x เริ่มต้นที่ 1
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
              domain={[1, 'auto']}
            />
            <YAxis
              label={{ value: "Loss", angle: -90, position: "insideLeft" ,offset: 0}}
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

    <div className="Confusion-Matrix" style={{ marginTop: "15px"}}>
      <h3>Confusion Matrix</h3>
      <div className="Confusion-Matrix" style={{ display: "grid", placeItems: "center" }}>
        {ConfusionMatrix && <img src={ConfusionMatrix} alt="Confusion Matrix" style={{ width: "80%", height: "auto" ,}} />}
      </div>
    </div>
  </div>
  );
};

const Tab_Visualize: React.FC<IProps> = ({
  modelname,
  username,
  project_name,
  modeltype,
  notice_update,
}) => {
  const dataUrl = `${import.meta.env.VITE_BACKEND_URL}/result/`;
  const [data, setData] = useState([]);
  const [validationCurveData, setValidationCurveData] = useState([]);
  const [precisionCurveData, setPrecisionCurveData] = useState([]);
  const [RecallCurveData, setRecallCurveData] = useState([]);
  const [ConfusionMatrix,setConfusionMatrix] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const data = {
      username: username,
      project_name: project_name,
      modelname: modelname,
      modeltype: modeltype,
      notice_update:notice_update,
    };
    axios
      .post(dataUrl, data)
      .then((response) => {
        const transformedData = response.data.loss.map((loss, index) => ({
          epoch: index + 1,
          accuracy: response.data.accuracy[index], 
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

        try {
          setConfusionMatrix(`${import.meta.env.VITE_BACKEND_URL}/model/confusion_matrix?username=${username}&project_name=${project_name}&model_name=${modelname}`);
        } catch (error) {
          console.error("Error:", error);
        }

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
      })     
      .finally(() => {
        setRefreshing(false);
      });
  }, [,notice_update,refreshing]);

  return (
    <div className="App">
      <ModelPerformanceChart
        data={data}
        validationCurveData={validationCurveData}
        precisionCurveData={precisionCurveData}
        recallCurveData={RecallCurveData}
        ConfusionMatrix={ConfusionMatrix}
        modeltype={modeltype}
        notice_update={notice_update}
        setRefreshButton={setRefreshing}
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
    notice_update: state.user.notice_update,
  };
};

export default connect(mapStateToProps)(Tab_Visualize);
