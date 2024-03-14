import React, { useState, useEffect } from "react";
import axios from "axios";
import { AppState } from "../../../store";
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
import PopupCompare from "./PopupCompare"; 

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
}) => {
  console.log("activeLabelType", modeltype);
  return (
    <div className="model-performance-chart">
      <div style={{ display: "flex" }}>
        <h2>Model Preformance </h2>
        <h2 style={{ color: "#76D7D5", marginLeft: "20px" }}>Model 1 [ {modelname} ] </h2>
        <h2 style={{ color: "#EF2C12", marginLeft: "20px" }}> VS </h2>
        <h2 style={{ color: "#D476D7", marginLeft: "20px" }}>Model 2 [ {compare_modelname} ]</h2>
        {isPopupVisible && <PopupCompare onClose={togglePopup}/>}
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
                  domain={[0, 100]}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => value.toFixed(2)}/>
                <Legend />
                <Line type="monotone" dataKey="accuracy1" name="Accuracy (Model1)" stroke="#8884d8" />
                <Line type="monotone" dataKey="accuracy2" name="Accuracy (Model2)" stroke="#ff7300" />
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
                <Tooltip formatter={(value) => value.toFixed(2)}/>
                <Legend />
                <Line type="monotone" dataKey="accuracy1" name="Fitness (Model1)" stroke="#8884d8" />
                <Line type="monotone" dataKey="accuracy2" name="Fitness (Model2)" stroke="#ff7300" />
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
                domain={[1, "auto"]}
              />
              <YAxis
                label={{ value: "Accuracy", angle: -90, position: "insideLeft" }}
                domain={[0, 100]}
              />
              <Tooltip formatter={(value) => value.toFixed(2)}/>
              <Legend />
              <Line
                type="monotone"
                dataKey="accuracy1"
                name="validation accuracy (Model1)"
                stroke="#8884d8"
              />
              <Line
                type="monotone"
                dataKey="accuracy2"
                name="validation accuracy (Model2)"
                stroke="#ff7300"
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
            <Tooltip formatter={(value) => value.toFixed(2)}/>
            <Legend />
            <Line type="monotone" dataKey="cost1" name="Cost (Model 1)" stroke="#560305" />
            <Line type="monotone" dataKey="cost2" name="Cost (Model 2)" stroke="#0CAD21" />
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
                domain={[1, "auto"]}
              />
              <YAxis
                label={{ value: "Loss", angle: -90, position: "insideLeft", offset: 0 }}
              />
              <Tooltip formatter={(value) => value.toFixed(2)}/>
              <Legend />
              <Line
                type="monotone"
                dataKey="cost1"
                name="validation loss (Model1)"
                stroke="#560305"
              />
              <Line
                type="monotone"
                dataKey="cost2"
                name="validation loss (Model2)"
                stroke="#0CAD21"
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
              domain={[0, 1]}
            />
            <Tooltip formatter={(value) => value.toFixed(2)}/>
            <Legend />
            <Line
              type="monotone"
              dataKey="precision1"
              name="Precision (Model1)"
              stroke="#2FEEDC"
            />
            <Line
              type="monotone"
              dataKey="precision2"
              name="Precision (Model2)"
              stroke="#DF16C4"
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
              domain={[0, 1]}
            />
            <Tooltip formatter={(value) => value.toFixed(2)}/>
            <Legend />
            <Line
              type="monotone"
              dataKey="recall1"
              name="Recall (Model1)"
              stroke="green"
            />
            <Line
              type="monotone"
              dataKey="recall2"
              name="Recall (Model2)"
              stroke="#864B0B"
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
    };
    const data2 = {
      username: username,
      project_name: project_name,
      modelname: compare_modelname,
      modeltype: modeltype,
    };

    Promise.all([
      axios.post(dataUrl, data),
      axios.post(dataUrl, data2),
      axios.get(dataUrl2),
      axios.get(dataUrl3),
    ]).then(([response1, response2,response3,response4]) => {
      const transformedData1 = response1.data.loss.map((loss, index) => ({
        epoch: index + 1,
        accuracy: response1.data.accuracy[index],
        cost: loss,
      }));
  
      const transformedPrecisionCurveData1 = response1.data.precision.map(
        (precision, index) => ({
          precision,
          epoch: index + 1,
        })
      );
  
      const transformedRecallCurveData1 = response1.data.recall.map(
        (recall, index) => ({
          recall,
          epoch: index + 1,
        })
      );
  
      const transformedData2 = response2.data.loss.map((loss, index) => ({
        epoch: index + 1,
        accuracy: response2.data.accuracy[index],
        cost: loss,
      }));
  
      const transformedPrecisionCurveData2 = response2.data.precision.map(
        (precision, index) => ({
          precision,
          epoch: index + 1,
        })
      );
  
      const transformedRecallCurveData2 = response2.data.recall.map(
        (recall, index) => ({
          recall,
          epoch: index + 1,
        })
      );

      if (modeltype === "IMAGE_RECOGNITION") {
        const transformedValidationCurveData = response1.data.val_loss.map(
          (loss, index) => ({
            accuracy: response1.data.val_accuracy[index],
            epoch: index + 1,
            cost: loss,
          })
        );
        const transformedValidationCurveData2 = response2.data.val_loss.map(
          (loss, index) => ({
            accuracy: response2.data.val_accuracy[index],
            epoch: index + 1,
            cost: loss,
          })
        );

        const mergedValidationCurveData = [];
        const numEpochs_ValidationCurve = Math.max(transformedValidationCurveData.length, transformedValidationCurveData2.length);
        for (let i = 0; i < numEpochs_ValidationCurve; i++) {
          const epoch = i + 1;
          const cost1 = transformedValidationCurveData[i] ? transformedValidationCurveData[i].cost : null;
          const cost2 = transformedValidationCurveData2[i] ? transformedValidationCurveData2[i].cost : null;
          const accuracy1 = transformedValidationCurveData[i] ? transformedValidationCurveData[i].accuracy : null;
          const accuracy2 = transformedValidationCurveData2[i] ? transformedValidationCurveData2[i].accuracy : null;

          mergedValidationCurveData.push({
            epoch: epoch,
            cost1: cost1,
            cost2: cost2,
            accuracy1: accuracy1,
            accuracy2: accuracy2,
          });
        }
        
        setValidationCurveData(mergedValidationCurveData);
      }

      const metaData1 = response3.data; 
      const metaData2 = response4.data; 

      setMetaData(metaData1);
      setMetaData2(metaData2);

      const mergedData = [];
      const numEpochs = Math.max(transformedData1.length, transformedData2.length);
      for (let i = 0; i < numEpochs; i++) {
        const epoch = i + 1;
        const cost1 = transformedData1[i] ? transformedData1[i].cost : null;
        const cost2 = transformedData2[i] ? transformedData2[i].cost : null;
        const accuracy1 = transformedData1[i] ? transformedData1[i].accuracy : null;
        const accuracy2 = transformedData2[i] ? transformedData2[i].accuracy : null;

        mergedData.push({
          epoch: epoch,
          cost1: cost1,
          cost2: cost2,
          accuracy1: accuracy1,
          accuracy2: accuracy2,
        });
      }

      const mergedPrecisionCurveData = [];
      const numEpochs_PrecisionCurveData = Math.max(transformedPrecisionCurveData1.length, transformedPrecisionCurveData2.length);
      for (let i = 0; i < numEpochs_PrecisionCurveData; i++) {
        const epoch = i + 1;
        const precision1 = transformedPrecisionCurveData1[i] ? transformedPrecisionCurveData1[i].precision : null;
        const precision2 = transformedPrecisionCurveData2[i] ? transformedPrecisionCurveData2[i].precision : null;

        mergedPrecisionCurveData.push({
          epoch: epoch,
          precision1: precision1,
          precision2: precision2,
        });
      }

      const mergedRecallCurveData = [];
      const numEpochs_RecallCurveData = Math.max(transformedRecallCurveData1.length, transformedRecallCurveData2.length);
      for (let i = 0; i < numEpochs_RecallCurveData; i++) {
        const epoch = i + 1;
        const recall1 = transformedRecallCurveData1[i] ? transformedRecallCurveData1[i].recall : null;
        const recall2 = transformedRecallCurveData2[i] ? transformedRecallCurveData2[i].recall : null;

        mergedRecallCurveData.push({
          epoch: epoch,
          recall1: recall1,
          recall2: recall2,
        });
      }
 
      setData(mergedData);
      setPrecisionCurveData(mergedPrecisionCurveData);
      setRecallCurveData(mergedRecallCurveData);
      
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });

  }, [compare_modelname]);

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

const mapStateToProps = (state: AppState) => {
  return {
    username: state.user.username,
    project_name: state.user.project_name,
    modelname: state.user.modelname,
    modeltype: state.user.modeltype,
    compare_modelname: state.user.compare_modelname,
  };
};

export default connect(mapStateToProps)(Tab_Compare);
