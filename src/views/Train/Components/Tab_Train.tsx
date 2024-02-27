import React, { FC, Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { AppState } from "../../../store";
import { ImageData } from "../../../store/labels/types";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import { NotificationUtil } from "../../../utils/NotificationUtil";
import { submitNewNotification } from "../../../store/notifications/actionCreators";
import {
  INotification,
  NotificationsActionType,
} from "../../../store/notifications/types";
import { ProjectData } from "src/store/general/types";
import { updateModelName} from "../../../store/users/actionCreators";
import { updateCompareModelName } from "../../../store/users/actionCreators";
import { PieChart, Pie, Tooltip, ResponsiveContainer ,Cell ,Legend} from "recharts";

interface IProps {
  imageData: ImageData[];
  modelname: string;
  compare_modelname: string;
  username: string;
  project_name: string;
  submitNewNotificationAction: (
    notification: INotification,
  ) => NotificationsActionType;
  updateModelNameAction: (modelname: string) => void;
  updateCompareModelNameAction: (compare_modelname: string) => void;
  projectData: ProjectData;
  activeLabelType: string;
}

const PopupCreate: React.FC<IProps & { onClose: () => void }> = ({
  onClose,
  imageData,
  submitNewNotificationAction,
  modelname,
  username,
  project_name,
  updateModelNameAction,
  updateCompareModelNameAction,
  projectData,
  activeLabelType,
}) => {
  const [newModel, setNewModel] = useState("default");

  const handleAddProject = async () => {
    try {
      console.log(
        " username",
        username,
        "project_name",
        project_name,
        "model_name",
        newModel,
      );
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/model/?username=${username}&project_name=${project_name}&model_name=${newModel}`,
      );
      updateModelNameAction(newModel);
      onClose();
      setNewModel("default");
      console.log("model name create",modelname)
    } catch (error) {
      console.error("Error adding ListProject:", error);
    }
  };

  return (
    <div className="popup">
      <div>
        <h2>Create Model</h2>
        <div>
          <div>Model name:</div>
          <input
            style={{
              width: "100%",
              padding: "8px",
              margin: "10px auto",
              border: "2px solid #000000",
              borderRadius: "5px",
              textAlign: "center",
            }}
            type="text"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
          />
          <div>
            <button className="button-1" onClick={handleAddProject}>
              Add Model
            </button>
            <button className="button-1" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopupSelect: React.FC<IProps & { onClose: () => void }> = ({
  onClose,
  imageData,
  submitNewNotificationAction,
  modelname,
  username,
  project_name,
  updateModelNameAction,
  updateCompareModelNameAction,
}) => {
  const [ListModel, setListModel] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCompareModel, setSelectedCompareModel] = useState("");

  useEffect(() => {
    fetchListModel();
  }, []);

  const fetchListModel = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/model/?username=${username}&project_name=${project_name}`,
      );
      setListModel(response.data);
    } catch (error) {
      console.error("Error fetching ListModel:", error);
    }
  };

  const handleSelectListModel = (model_name) => {
    try {
      const selected = ListModel.find(
        (Model) => Model.model_name === model_name,
      );
      setSelectedModel(selected);
      console.log("Selected Model:", model_name);
    } catch (error) {
      console.error("Error Selected Model:", error);
    }
  };

  const handleSelectCompareListModel = (compare_model_name) => {
    try {
      const selected = ListModel.find(
        (Model) => Model.model_name === compare_model_name,
      );
      setSelectedCompareModel(selected);
      console.log("Selected Compare Model:", compare_model_name);
    } catch (error) {
      console.error("Error Selected Compare Model:", error);
    }
  };

  const handleDeleteListModel = async (model_name) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/model/?username=${username}&project_name=${project_name}&model_name=${model_name}`,
      );
      const updatedList = ListModel.filter(
        (Model) => Model.model_name !== model_name,
      );
      setListModel(updatedList);
      fetchListModel();
    } catch (error) {
      console.error("Error deleting ListModel:", error);
    }
  };

  const handleOpenClick = () => {
    if (selectedCompareModel) {
      console.log("Selected Compare Model:", selectedCompareModel.model_name);
      updateCompareModelNameAction(selectedCompareModel.model_name);
    }
    if (selectedModel) {
      console.log("Selected Model:", selectedModel.model_name);
      updateModelNameAction(selectedModel.model_name);
      onClose();
    }
  };
  
  return (
    <div className="popup">
      <div>
        <h2>Select Model</h2>
        <table
          style={{
            width: "100%",
            margin: "auto",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "50%",
                  border: "2px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Name
              </th>
              <th
                style={{
                  width: "30%",
                  border: "2px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Action
              </th>
              <th
                style={{
                  width: "20%",
                  border: "2px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Compare
              </th>
            </tr>
          </thead>
          <tbody>
            {ListModel.length > 0 ? (
              ListModel.map((Model, index) => (
                <tr
                  key={Model._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                  }}
                >
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {Model.model_name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      className="button-16"
                      role="button"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f9f9f9",   
                      }}
                      onClick={() => handleSelectListModel(Model.model_name)}
                    >
                      Select
                    </button>
                    <button
                      className="button-16"
                      role="button"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      }}
                      onClick={() => handleDeleteListModel(Model.model_name)}
                    >
                      Delete
                    </button>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      className="button-16"
                      role="button"
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      }}
                      onClick={() => handleSelectCompareListModel(Model.model_name)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Models available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div>
          <button className="button-1" onClick={handleOpenClick}>
            Open {selectedModel.model_name} Model
          </button>
          <button className="button-1" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Tab_Train: FC<IProps> = ({
  imageData,
  submitNewNotificationAction,
  modelname,
  username,
  project_name,
  updateModelNameAction,
  updateCompareModelNameAction,
  activeLabelType,
}) => {
  const navigate = useNavigate();
  const [epoch, setEpoch] = useState<string>("10"); // ตั้งค่าเริ่มต้นเป็น "10"
  const [learningRate, setLearningRate] = useState<string>("0.01"); // ตั้งค่าเริ่มต้นเป็น "0.01"
  const [epochEdited, setEpochEdited] = useState<boolean>(false); // epoch ได้รับการแก้มั้ย
  const [learningRateEdited, setLearningRateEdited] = useState<boolean>(false); //learning rate ได้รับการแก้มั้ย
  const labels = [];
  const [isPopupCreate_Visible, setPopupCreate_Visible] = useState(false);
  const [isPopupSelect_Visible, setPopupSelect_Visible] = useState(false);
  const [DataSplit1,setDataSplit1] = useState<string>("80");
  const [DataSplit2,setDataSplit2] = useState<string>("10");
  const [DataSplit3,setDataSplit3] = useState<string>("10");
  const [DataSplit1Edited, setDataSplit1Edited] = useState<boolean>(false);
  const [DataSplit2Edited, setDataSplit2Edited] = useState<boolean>(false);
  const [DataSplit3Edited, setDataSplit3Edited] = useState<boolean>(false);
  const [HaveResult,setHaveResult] = useState<boolean>(false);
  const [Data,setData] = useState(null);
  const [ConfusionMatrix,setConfusionMatrix] = useState(null);

  const togglePopupCreate = () => {
    setPopupCreate_Visible(!isPopupCreate_Visible);
    setPopupSelect_Visible(false);
  };

  const togglePopupSelect = () => {
    setPopupSelect_Visible(!isPopupSelect_Visible);
    setPopupCreate_Visible(false);
  };

  if (activeLabelType === "IMAGE RECOGNITION") {
    for (let i = 0; i < imageData.length; i++) {
      const id = imageData[i]["labelNameIds"][0];
      const name = LabelsSelector.getLabelNameById(id)["name"];
      labels.push(name);
    }
  } else {
    console.log("object");
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (epoch === "" || learningRate === "") {
        submitNewNotificationAction(
          NotificationUtil.createErrorNotification({
            header: "Training prevented",
            description: "Some paremeter is missing a value",
          }),
        );
        return;
      }
      if (modelname === "default" || modelname === "" ){
        if (modelname === "default"){
          await axios.delete(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/model/?username=${username}&project_name=${project_name}&model_name=${"default"}`
          );
        }
        await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/model/?username=${username}&project_name=${project_name}&model_name=${"default"}`
        );
        updateModelNameAction("default");
      }

      imageData.forEach((fileInfo, index) => {
        const file = fileInfo.fileData;
        formData.append("bytefiles", file);
      });
      if (parseInt(DataSplit1) + parseInt(DataSplit2) + parseInt(DataSplit3) > 100) {
        setDataSplit1("80");
        setDataSplit2("10");
        setDataSplit3("10");
      }
      
      formData.append("epochs", epoch);
      formData.append("lr", learningRate);
      formData.append("username", username);
      formData.append("project_name", project_name);
      formData.append("modelname", modelname || "default");
      formData.append("train_size", (parseFloat(DataSplit1) / 100).toFixed(2));
      formData.append("test_size", (parseFloat(DataSplit2) / 100).toFixed(2));
      formData.append("validate_size", (parseFloat(DataSplit3) / 100).toFixed(2));

      labels.forEach((label, index) => {
        formData.append("labels", label);
      });

      submitNewNotificationAction(
        NotificationUtil.createMessageNotification({
          header: "Train started",
          description: "Model training started",
        }),
      );

      let response;
      if (activeLabelType === "IMAGE RECOGNITION") {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/train/`,
          formData,
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/object/train`,
          formData,
        );
      }

      console.log(response.data);
      submitNewNotificationAction(
        NotificationUtil.createSuccessNotification({
          header: "Training is running",
          description: "Model is training",
        })
      );
      handleGetMeta();
      handleGetConfusionMatrix();
    } catch (error) {
      console.error("Error:", error);
      submitNewNotificationAction(
        NotificationUtil.createErrorNotification({
          header: "Training failed",
          description: "Some paremeter is missing a value",
        }),
      );
    }
  };

  const handleGetMeta = async () => {
    try {
      let response2;
      if (activeLabelType === "IMAGE RECOGNITION") {
        response2 = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/model/metadata?username=${username}&project_name=${project_name}&model_name=${modelname}`
        );
      } else {
        response2 = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/model/metadata?username=${username}&project_name=${project_name}&model_name=${modelname}`
        );
      }
      await setData(response2.data);
      setHaveResult(true);
      console.log("response2.data",response2.data)
    } catch (error) {
      console.error("Error:", error);
      setHaveResult(false);
    }
  };

  const handleGetConfusionMatrix = async () => {
    try {
      let response3;
      if (activeLabelType === "IMAGE RECOGNITION") {
        response3 = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/model/confusion_matrix?username=${username}&project_name=${project_name}&model_name=${modelname}`
        );
      } else {
        response3 = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/model/confusion_matrix?username=${username}&project_name=${project_name}&model_name=${modelname}`
        );
      }

      setConfusionMatrix(`${import.meta.env.VITE_BACKEND_URL}/model/confusion_matrix?username=${username}&project_name=${project_name}&model_name=${modelname}`);
    } catch (error) {
      console.error("Error:", error);
      setHaveResult(false);
    }
  };

  useEffect(() => {
    handleGetMeta();
    handleGetConfusionMatrix();
  }, [modelname]);

  const pieChartData = [
    { name: "Training", value: parseInt(DataSplit1) },
    { name: "Testing", value: parseInt(DataSplit2) },
    { name: "Validation", value: parseInt(DataSplit3) }
  ];

  const COLORS = ['#EAAA7F', '#71C363', '#77690F', '#FF8042'];

  const handleIncrement = () => {
    setDataSplit1((parseInt(DataSplit1) + 2).toString());
    setDataSplit2((parseInt(DataSplit2) - 1).toString());
    setDataSplit3((parseInt(DataSplit3) - 1).toString());
  };

  const handleDecrement = () => {
    setDataSplit1((parseInt(DataSplit1) - 2).toString());
    setDataSplit2((parseInt(DataSplit2) + 1).toString());
    setDataSplit3((parseInt(DataSplit3) + 1).toString());
  };
  
  return (
    <Fragment>
      <div
        className="tabs-component"
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          className="button-6"
          role="button"
          onClick={() => togglePopupCreate()}
        >
          Create Model
        </button>
        {isPopupCreate_Visible && (
          <PopupCreate
            onClose={() => togglePopupCreate()}
            imageData={imageData}
            modelname={modelname}
            project_name={project_name}
            username={username}
            updateModelNameAction={updateModelNameAction}
          />
        )}
        <button
          className="button-6"
          role="button"
          onClick={() => togglePopupSelect()}
        >
          Select Existing Model
        </button>
        {isPopupSelect_Visible && (
          <PopupSelect
            onClose={() => togglePopupSelect()}
            imageData={imageData}
            modelname={modelname}
            project_name={project_name}
            username={username}
            updateModelNameAction={updateModelNameAction}
            updateCompareModelNameAction={updateCompareModelNameAction}
          />
        )}
        <button
          className="button-6"
          role="button"
          onClick={() => navigate("/home")}
        >
          Add & label Images
        </button>
      </div>
      <div className="Parameter" style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: "1 1 30%" }}>
          <h3>Model Tuning [{modelname}]</h3>
          <div>Epoch</div>
          <input
            type="text"
            value={epoch}
            onChange={(e) => {
              setEpoch(e.target.value);
              setEpochEdited(true);
            }}
            className={epochEdited ? "" : "placeholder-text"}
          />
          <div>Learning Rate</div>
          <input
            type="text"
            value={learningRate}
            onChange={(e) => {
              setLearningRate(e.target.value);
              setLearningRateEdited(true);
            }}
            className={learningRateEdited ? "" : "placeholder-text"}
          />
        </div>

        <div style={{ flex: "1 1 30%", display: "flex", flexDirection: "column" ,marginTop: "40px"}}>
          <div>Data Split [ Training / Testing / Validation]</div>
          <div className="DataSplit" style={{ display: 'flex', flexDirection: "row" , justifyContent: "center"}}>
            <button className="button-14" onClick={handleIncrement} style={{ marginTop: "1px" }}>
              +
            </button>
            <input 
              type="text"
              value={DataSplit1}
              onChange={(e) => {
                setDataSplit1(e.target.value);
                setDataSplit1Edited(true);
              }}
              className={DataSplit1Edited ? "" : "placeholder-text"}
            />
            <input
              type="text"
              value={DataSplit2}
              onChange={(e) => {
                setDataSplit2(e.target.value);
                setDataSplit2Edited(true);
              }}
              className={DataSplit2Edited ? "" : "placeholder-text"}
            />
            <input
              type="text"
              value={DataSplit3}
              onChange={(e) => {
                setDataSplit3(e.target.value);
                setDataSplit3Edited(true);
              }}
              className={DataSplit3Edited ? "" : "placeholder-text"}
            />
            <button className="button-14" onClick={handleDecrement} style={{ marginTop: "1px" }} >
              -
            </button>
          </div>
          <button className="button-14" onClick={() => {setHaveResult(false); setData(null); setConfusionMatrix(null); handleSubmit(); }} style={{ marginTop: "125px" }}>
            Train
          </button>
        </div>

        <div style={{ flex: "1 1 30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="Chart" style={{ width: "300px", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  startAngle={0}
                  endAngle={360}
                  innerRadius={35}
                  outerRadius={55}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
                <Legend align="right" verticalAlign="middle" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {HaveResult && ( 
        <div>
          <div className="Parameter" style={{ marginTop: "20px"}}>
            <h3>Result</h3>
            <div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ flex: 1 }}>Average Precision {Data.average_precision !== null && Data.average_precision !== undefined  ? ` ${Data.average_precision.toFixed(2)}` : 'not available'}</div>
                <div style={{ flex: 1 }}>Training images {Data.train_image}</div>
                <div style={{ flex: 1 }}>Total images {Data.total_image}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ flex: 1 }}>Precision {Data.precision !== null && Data.precision !== undefined ? ` ${Data.precision.toFixed(2)}` : 'not available'}</div>
                <div style={{ flex: 1 }}>Testing images {Data.test_image}</div>
                <div style={{ flex: 1 }}></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ flex: 1 }}>Recall {Data.recall !== null && Data.recall !== undefined ? ` ${Data.recall.toFixed(2)}` : 'not available'}</div>
                <div style={{ flex: 1 }}>Validation images {Data.validate_image}</div>
                <div style={{ flex: 1 }}></div>
              </div>
            </div>
          </div>
          <div className="Parameter" style={{ marginTop: "20px"}}>
            <h3>Confusion Matrix</h3>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {ConfusionMatrix && <img src={ConfusionMatrix} alt="Confusion Matrix" style={{ width: "80%", height: "auto" }} />}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageData: state.labels.imagesData,
  username: state.user.username,
  modelname: state.user.modelname,
  compare_modelname: state.user.compare_modelname,
  project_name: state.user.project_name,
  projectData: state.general.projectData,
  activeLabelType: state.labels.activeLabelType,
});

const mapDispatchToProps = {
  submitNewNotificationAction: submitNewNotification,
  updateModelNameAction: updateModelName,
  updateCompareModelNameAction: updateCompareModelName, 
};

const connectPopupCreate = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopupCreate);
const connectPopupSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopupSelect);
const connectTab_Train = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Tab_Train);

export { connectPopupCreate, connectPopupSelect, connectTab_Train };
