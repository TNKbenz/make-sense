import React, { useState, useEffect } from "react";
import ImageDropzone from './ImageDropzone';
import { useNavigate } from 'react-router-dom';
import './Predict.css';
import { AppState } from "src/store";
import { connect } from "react-redux";
import axios from "axios";
import { updateModelName } from "../../store/users/actionCreators";



interface PredictProps {
  username: string
  project_name: string
  modelname: string 
  updateModelNameAction: (modelname: string) => void; 
}


const PopupSelect: React.FC<PredictProps & { onClose: () => void }> = ({
  onClose,
  username,
  project_name,
  updateModelNameAction
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
        }/model/?username=${username}&project_name=${project_name}`
      );
      setListModel(response.data);
    } catch (error) {
      console.error("Error fetching ListModel:", error);
    }
  };

  const handleSelectListModel = (model_name) => {
    try {
      const selected = ListModel.find((Model) => Model.model_name === model_name);
      if (selected) {
        setSelectedModel(selected);
        console.log("Selected Project:", model_name);
      } else {
        console.error("Model not found:", model_name);
      }
    } catch (error) {
      console.error("Error selecting model:", error);
    }
  };

  const handleDeleteListModel = async (model_name) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/model/?username=${username}&project_name=${project_name}&model_name=${
          model_name
        }`
      );
      const updatedList = ListModel.filter(Model => Model.model_name !== model_name);
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


const Predict: React.FC<PredictProps > = ({ username, project_name, modelname,updateModelNameAction }) => {
  const navigate = useNavigate();
  const [isPopupSelect_Visible, setPopupSelect_Visible] = useState(false);

  const togglePopupSelect = () => {
    setPopupSelect_Visible(!isPopupSelect_Visible);
  };

  const handleSelectModelClick = () => {
    togglePopupSelect();
    // navigate('/home');
    // window.location.reload();
  };

  const handleUpload = (imageUrl: string) => {
    console.log('อัพโหลดไฟล์สำเร็จ รูปภาพอยู่ที่:', imageUrl);
  };

  return (
    <div className="Predict">
      <div className="ButtonContainer">
        <button className="TrainButton" onClick={() => navigate('/')}>Home</button>
        <button className="TrainButton" onClick={() => navigate('/train')} >Train</button>
      </div>
      <div className='Predict'><h2>Welcome to Predict Page </h2></div>
      <button onClick={handleSelectModelClick}>Select Existing Model</button>
      <h2>Current Model {modelname}</h2>
      <div className="ImageDropzoneContainerWrapper">
        <div className="ImageDropzoneContainer">
          <ImageDropzone onUploadSuccess={handleUpload} />
        </div>
          {isPopupSelect_Visible && (
            <PopupSelect
              onClose={() => togglePopupSelect()}
              modelname={modelname}
              project_name={project_name}
              username={username}
              updateModelNameAction={updateModelNameAction}
            />
          )}
      </div>
    </div>
  );
};
const mapDispatchToProps = {
  updateModelNameAction: updateModelName,
};

const mapStateToProps = (state: AppState) => ({
  username: state.user.username,
  project_name: state.user.project_name,
  modelname: state.user.modelname,
});

export default connect(mapStateToProps, mapDispatchToProps)(Predict);