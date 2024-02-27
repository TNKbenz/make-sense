import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { ImageData } from "../../../store/labels/types";
import { submitNewNotification } from "../../../store/notifications/actionCreators";
import { INotification, NotificationsActionType } from "../../../store/notifications/types";
import { ProjectData } from "src/store/general/types";
import { updateModelName } from "../../../store/users/actionCreators";

interface IProps {
  imageData: ImageData[];
  modelname: string;
  username: string;
  project_name: string;
  submitNewNotificationAction: (notification: INotification) => NotificationsActionType;
  updateModelNameAction: (modelname: string) => void;
  projectData: ProjectData;
  activeLabelType: string;
}

const PopupCompare: React.FC<IProps & { onClose: () => void }> = ({ 
  onClose, 
  modelname, 
  username, 
  project_name, 
  updateModelNameAction 
}) => {
  const [listModel, setListModel] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);

  useEffect(() => {
    fetchListModel();
  }, [username, project_name]);

  const fetchListModel = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/model/?username=${username}&project_name=${project_name}`
      );
      setListModel(response.data);
    } catch (error) {
      console.error("Error fetching ListModel:", error);
    }
  };

  const handleSelectListModel = (model_name: string) => {
    try {
      const selected = listModel.find((Model) => Model.model_name === model_name);
      setSelectedModel(selected);
      console.log("Selected Model:", model_name);
    } catch (error) {
      console.error("Error selecting model:", error);
    }
  };

  const handleDeleteListModel = async (model_name: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/model/?username=${username}&project_name=${project_name}&model_name=${model_name}`
      );
      const updatedList = listModel.filter((Model) => Model.model_name !== model_name);
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
      onClose();
    }
  };

  return (
    <div className="popupCompare">
      <div>
        <h2 style={{ display: 'flex', justifyContent: 'center' }}>Select Model</h2>
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
            {listModel.length > 0 ? (
              listModel.map((Model, index) => (
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
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      }}
                      onClick={() => handleSelectListModel(Model.model_name)}
                    >
                      Select
                    </button>
                    <button
                      className="button-16"
                      role="button"
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
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
                <td colSpan={2} >No Models available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div>
          <button className="button-1" onClick={handleOpenClick} disabled={!selectedModel}>
            Open {selectedModel?.model_name} Model
          </button>
          <button className="button-1" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageData: state.labels.imagesData,
  username: state.user.username,
  modelname: state.user.modelname,
  project_name: state.user.project_name,
  projectData: state.general.projectData,
  activeLabelType: state.labels.activeLabelType,
});

export default connect(mapStateToProps)(PopupCompare); 