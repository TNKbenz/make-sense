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
import { updateModelName } from "../../../store/users/actionCreators";

interface IProps {
  imageData: ImageData[];
  modelname: string;
  username: string;
  project_name: string;
  submitNewNotificationAction: (
    notification: INotification
  ) => NotificationsActionType;
  updateModelNameAction: (modelname: string) => void;
  projectData: ProjectData;
}

const PopupCreate: React.FC<IProps & { onClose: () => void }> = ({
  onClose,
  imageData,
  submitNewNotificationAction,
  modelname,
  username,
  project_name,
  updateModelNameAction,
  projectData,
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
        newModel
      );
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/model?username=${username}&project_name=${project_name}&model_name=${newModel}`
      );
      updateModelNameAction(newModel);
      setNewModel("default");
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
}) => {
  const [ListModel, setListModel] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    fetchListModel();
  }, []);

  const fetchListModel = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/model?username=${username}&project_name=${project_name}`
      );
      setListModel(response.data);
    } catch (error) {
      console.error("Error fetching ListModel:", error);
    }
  };

  const handleSelectListModel = (model_name) => {
    try {
      const selected = ListModel.find(
        (Model) => Model.model_name === model_name
      );
      setSelectedModel(selected);
      console.log("Selected Project:", model_name);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleDeleteListModel = async (model_name) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/model?username=${username}&project_name=${project_name}&model_name=${model_name}`
      );
      const updatedList = ListModel.filter(
        (Model) => Model.model_name !== model_name
      );
      setListModel(updatedList);
      fetchListModel();
    } catch (error) {
      console.error("Error deleting ListModel:", error);
    }
  };

  const handleOpenClick = () => {
    if (selectedModel) {
      console.log("Selected Model:", selectedModel.model_name);
      updateModelNameAction(selectedModel.model_name);
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
                  width: "60%",
                  border: "2px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Name
              </th>
              <th
                style={{
                  width: "40%",
                  border: "2px solid #ddd",
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Action
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
}) => {
  const navigate = useNavigate();
  const [epoch, setEpoch] = useState<string>("");
  const [learningRate, setLearningRate] = useState<string>("");
  const labels = [];
  const [isPopupCreate_Visible, setPopupCreate_Visible] = useState(false);
  const [isPopupSelect_Visible, setPopupSelect_Visible] = useState(false);

  const togglePopupCreate = () => {
    setPopupCreate_Visible(!isPopupCreate_Visible);
    setPopupSelect_Visible(false);
  };

  const togglePopupSelect = () => {
    setPopupSelect_Visible(!isPopupSelect_Visible);
    setPopupCreate_Visible(false);
  };

  for (let i = 0; i < imageData.length; i++) {
    const id = imageData[i]["labelNameIds"][0];
    const name = LabelsSelector.getLabelNameById(id)["name"];
    labels.push(name);
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (epoch === "" || learningRate === "") {
        submitNewNotificationAction(
          NotificationUtil.createErrorNotification({
            header: "Training prevented",
            description: "Some paremeter is missing a value",
          })
        );
        return;
      }

      imageData.forEach((fileInfo, index) => {
        const file = fileInfo.fileData;
        formData.append("bytefiles", file);
      });
      formData.append("epochs", epoch);
      formData.append("lr", learningRate);
      formData.append("username", username);
      formData.append("project_name", project_name || "p1");
      formData.append("modelname", modelname || "mt1");

      labels.forEach((label, index) => {
        formData.append("labels", label);
      });

      submitNewNotificationAction(
        NotificationUtil.createMessageNotification({
          header: "Train started",
          description: "Model training started",
        })
      );

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/train/`,
        formData
      );
      console.log(response.data);
      submitNewNotificationAction(
        NotificationUtil.createSuccessNotification({
          header: "Training success",
          description: "Model trained successfully",
        })
      );
    } catch (error) {
      console.error("Error:", error);
      submitNewNotificationAction(
        NotificationUtil.createErrorNotification({
          header: "Training failed",
          description: "Some paremeter is missing a value",
        })
      );
    }
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
          className="button-14"
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
          className="button-14"
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
          />
        )}
        <button
          className="button-14"
          role="button"
          onClick={() => navigate("/home")}
        >
          Add & label Images
        </button>
      </div>
      <div className="Parameter">
        <h3>Model tuning</h3>
        <div>Epoch</div>
        <input
          type="text"
          value={epoch}
          onChange={(e) => setEpoch(e.target.value)}
        />
        <div>Learning Rate</div>
        <input
          type="text"
          value={learningRate}
          onChange={(e) => setLearningRate(e.target.value)}
        />
        <button className="button-14" onClick={handleSubmit}>
          Train
        </button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageData: state.labels.imagesData,
  username: state.user.username,
  modelname: state.user.modelname,
  project_name: state.user.project_name,
  projectData: state.general.projectData,
});

const mapDispatchToProps = {
  submitNewNotificationAction: submitNewNotification,
  updateModelNameAction: updateModelName,
};

const connectPopupCreate = connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupCreate);
const connectPopupSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupSelect);
const connectTab_Train = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tab_Train);

export { connectPopupCreate, connectPopupSelect, connectTab_Train };
