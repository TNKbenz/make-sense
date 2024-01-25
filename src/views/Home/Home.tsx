import React, { useState, useEffect ,PropsWithChildren} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.scss";
import { updateProjectName } from "../../store/users/actionCreators";
import { updateModelName } from "../../store/users/actionCreators";
import { AppState } from "../../store";
import { connect } from "react-redux";
import { updateProjectData } from '../../store/general/actionCreators';
import { ProjectData } from 'src/store/general/types';
import { ImageDataUtil } from '../../utils/ImageDataUtil';
import {addImageData, updateActiveImageIndex,updateLabelNames,updateImageData} from '../../store/labels/actionCreators';
import {useDropzone,DropzoneOptions} from 'react-dropzone';
import {ImageData,LabelName} from '../../store/labels/types';
import {ProjectType} from '../../data/enums/ProjectType';
import { sortBy } from 'lodash';


interface IProps {
  username: string;
  updateProjectNameAction: (project_name: string) => void;
  updateProjectDataAction : (projectData: ProjectData ) => void;
  updateImageDataAction : (imageData: ImageData[]) => void;
  updateActiveImageIndexAction: (activeImageIndex: number) => any;
  updateModelNameAction: (modelname: string) => void;
  addImageDataAction: (imageData: ImageData[]) => any;
  updateLabelNamesAction: (labels: LabelName[]) => void;
}

const Home: React.FC<IProps> = ({ updateProjectNameAction, updateProjectDataAction , updateImageDataAction, username ,addImageDataAction ,updateModelNameAction , updateActiveImageIndexAction ,updateLabelNamesAction }) => {
  const navigate = useNavigate();
  const [showMainPopup, setShowMainPopup] = useState(true);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showListProjectPopup, setShowListProjectPopup] = useState(false);
  const [ListProject, setListProject] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedOption, setSelectedOption] = useState('IMAGE_RECOGNITION');
  const [imageData, setImageData] = useState([]);
  const [showDropZonePopup, setShowDropZonePopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    fetchListProject();
  }, []);

  const fetchListProject = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/project/all/?username=${username}`
      );

      setListProject(response.data);
    } catch (error) {
      console.error("Error fetching ListProject:", error);
    }
  };

  const handleAddProject = async () => {
    try {
      console.log(
        " username",
        username,
        "newProject",
        newProject,
        " selectedOption",
        selectedOption
      );
      if (newProject.trim() === "" || newProject.includes(" ")) {
        setShowErrorPopup(true)
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 5000);
        return;
      }
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/project/create`, {
        project_name: newProject,
        project_type: selectedOption,
        username: username,
        project_path: "",
      });
      fetchListProject();
      updateProjectNameAction(newProject)
      updateModelNameAction(selectedOption)
      updateProjectDataAction({
        type: null,
        name: newProject,
      });
      updateImageDataAction([])
      updateLabelNamesAction([])
      navigate("/home");
      setNewProject("");
    } catch (error) {
      console.error("Error adding ListProject:", error);
    }
  };

  const handleDeleteListProject = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/project/delete/?username=${username}&project_name=${
          selectedProject.project_name
        }`
      );
      fetchListProject();
    } catch (error) {
      console.error("Error deleting ListProject:", error);
    }
  };

  const handleGetImages = async (projectId) => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/???/?username=${username}/?projectId=${projectId}`)
      setImageData(response.data.imageData)
    } catch(error) {
      console.error('Error getting Images:', error);
    }
  }

  const handleCreateProjectClick = () => {
    setShowMainPopup(false);
    setShowCreatePopup(true);
    setShowListProjectPopup(false);
    setShowDropZonePopup(false);
  };

  const handleOpenProjectClick = () => {
    setShowMainPopup(false);
    setShowCreatePopup(false);
    setShowListProjectPopup(true);
    setShowDropZonePopup(true);
  };

  const handleBackClick = () => {
    setShowMainPopup(true);
    setShowCreatePopup(false);
    setShowListProjectPopup(false);
    setShowDropZonePopup(false);
  };

  const handleSelectListProject = (projectId) => {
    try {
      const selected = ListProject.find((project) => project._id === projectId);
      setSelectedProject(selected);
      console.log("Selected Project:", projectId);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleOpenClick = async () => {
    if (selectedProject) {
      console.log('Selected Project:', selectedProject.project_name, ' Type Project:', selectedProject.project_type);
      updateProjectNameAction(selectedProject.project_name);
      updateProjectDataAction({
        type: selectedProject.project_type,
        name: selectedProject.project_name,
      });
      navigate('/home');
      getDropZoneContent();
      startEditorWithImageRecognition();
      // updateImageDataAction(imageData)
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
      accept: {
          'image/*': ['.jpeg', '.png']
      }
  } as DropzoneOptions);

  const startEditor = (projectType: ProjectType) => {
      if (acceptedFiles.length > 0) {
          const files = sortBy(acceptedFiles, (item: File) => item.name)
          updateProjectDataAction({
              name: selectedProject.project_name,
              type: selectedProject.project_type
          });
          updateActiveImageIndexAction(0); 
          addImageDataAction(files.map((file:File) => ImageDataUtil
              .createImageDataFromFileData(file)));
          // updateActivePopupTypeAction(PopupWindowType.INSERT_LABEL_NAMES);
      }
  };

  const getDropZoneContent = () => {
      if (acceptedFiles.length === 0)
          return <>
              <input {...getInputProps()} />
              <img
                  draggable={false}
                  alt={'upload'}
                  src={'ico/box-opened.png'}
              />
              <p className='extraBold'>Drop images</p>
              <p>or</p>
              <p className='extraBold'>Click here to select them</p>
          </>;
      else if (acceptedFiles.length === 1)
          return <>
              <img
                  draggable={false}
                  alt={'uploaded'}
                  src={'ico/box-closed.png'}
              />
              <p className='extraBold'>1 image loaded</p>
          </>;
      else
          return <>
              <input {...getInputProps()} />
              <img
                  draggable={false}
                  key={1}
                  alt={'uploaded'}
                  src={'ico/box-closed.png'}
              />
              <p key={2} className='extraBold'>{acceptedFiles.length} images loaded</p>
          </>;
  };

  const startEditorWithObjectDetection = () => startEditor(ProjectType.OBJECT_DETECTION);
  const startEditorWithImageRecognition = () => startEditor(ProjectType.IMAGE_RECOGNITION);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to Home Page</h2>

      {showMainPopup && (
        <div>
          <button className="button-1" onClick={handleCreateProjectClick}>
            Create Project
          </button>
          <br />
          <button className="button-1" onClick={handleOpenProjectClick}>
            Open Project
          </button>
        </div>
      )}

      {showCreatePopup && (
        <div>
          <h2>Create Project</h2>
          <div>
            <div>Project name:</div>
            <input
              style={{
                width: "10%",
                padding: "8px",
                margin: "10px auto",
                border: "1px solid #000000",
                borderRadius: "5px",
                textAlign: "center",
              }}
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
            />
            <div>Project Type:</div>
            <select
              className="button-23"
              id="options"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="IMAGE_RECOGNITION">IMAGE_RECOGNITION</option>
              <option value="OBJECT_DETECTION">OBJECT DETECTION</option>
            </select>
            <div>
              <button className="button-1" onClick={handleAddProject}>
                Add Project
              </button>
              <button className="button-1" onClick={handleBackClick}>
                Back
              </button>
            </div>
            {showErrorPopup && (
              <div >
                <p style={{ color: 'red' }}>
                  Create Project failed.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showListProjectPopup && (
        <div>
          <h2>Select Project</h2>
          <table
            style={{
              width: "60%",
              margin: "auto",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    width: "40%",
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Text
                </th>
                <th
                  style={{
                    width: "20%",
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Type
                </th>
                <th
                  style={{
                    width: "20%",
                    border: "1px solid #ddd",
                    padding: "8px",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {ListProject.map((Project, index) => (
                <tr
                  key={Project._id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                  }}
                >
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {Project.project_name}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {Project.project_type}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      className="button-16"
                      role="button"
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      }}
                      onClick={() => handleSelectListProject(Project._id)}
                    >
                      Select
                    </button>
                    <button
                      className="button-16"
                      role="button"
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      }}
                      onClick={() => handleDeleteListProject(Project._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button className="button-1"  onClick={handleOpenClick}>
              Open {selectedProject.project_name} Project
            </button>
            <button className="button-1" onClick={handleBackClick}>
              Back
            </button>
          </div>
        </div>
      )}

      {showDropZonePopup && (
        <div className='ImagesDropZone' style={{
          backgroundColor: "black",
        }}>
            <div {...getRootProps({className: 'DropZone'})}>
                {getDropZoneContent()}
            </div>
            <div className='DropZoneButtons'>
                <button
                    onClick={startEditorWithObjectDetection}
                />
                <button
                    onClick={startEditorWithImageRecognition}
                />
            </div>
        </div>
      )}
      
    </div>
  );
};

// export default Home;

const mapDispatchToProps = {
  updateProjectNameAction: updateProjectName,
  updateProjectDataAction: updateProjectData,
  updateImageDataAction: updateImageData,
  updateActiveImageIndexAction: updateActiveImageIndex,
  addImageDataAction: addImageData,
  updateModelNameAction: updateModelName,
  updateLabelNamesAction: updateLabelNames,
};

const mapStateToProps = (state: AppState) => ({
  username: state.user.username,
  projectData: state.general.projectData,

});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
