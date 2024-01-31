import React, { useState, useEffect, PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.scss";
import { updateProjectName } from "../../store/users/actionCreators";
import { updateModelName } from "../../store/users/actionCreators";
import { AppState } from "../../store";
import { connect, useSelector } from "react-redux";
import { updateProjectData } from "../../store/general/actionCreators";
import { ProjectData } from "src/store/general/types";
import { ImageDataUtil } from "../../utils/ImageDataUtil";
import { LabelUtil } from "../../utils/LabelUtil";
import {
  addImageData,
  updateActiveImageIndex,
  updateLabelNames,
  updateImageData,
  updateImageDataById,
} from "../../store/labels/actionCreators";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { ImageData, LabelName } from "../../store/labels/types";
import { ProjectType } from "../../data/enums/ProjectType";
import { sortBy, uniq } from "lodash";

interface IProps {
  username: string;
  projectName: string;
  updateProjectNameAction: (project_name: string) => void;
  updateProjectDataAction: (projectData: ProjectData) => void;
  updateImageDataAction: (imageData: ImageData[]) => void;
  updateActiveImageIndexAction: (activeImageIndex: number) => any;
  updateModelNameAction: (modelname: string) => void;
  addImageDataAction: (imageData: ImageData[]) => any;
  updateLabelNamesAction: (labels: LabelName[]) => void;
  updateImageDataById: (id: string, newImageData: ImageData) => any;
  labelNames: LabelName[];
}

const Home: React.FC<IProps> = ({
  updateProjectNameAction,
  updateProjectDataAction,
  updateImageDataAction,
  username,
  projectName,
  addImageDataAction,
  updateModelNameAction,
  updateActiveImageIndexAction,
  updateLabelNamesAction,
  updateImageDataById,
  labelNames,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: AppState) => state.user.username);
  const [showMainPopup, setShowMainPopup] = useState(true);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showListProjectPopup, setShowListProjectPopup] = useState(false);
  const [ListProject, setListProject] = useState([]);
  const [newProject, setNewProject] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedOption, setSelectedOption] = useState("IMAGE_RECOGNITION");
  const [imageData, setImageData] = useState([]);
  const [showDropZonePopup, setShowDropZonePopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchListProject();
    }
  }, [user]);

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
        setShowErrorPopup(true);
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
      updateProjectNameAction(newProject);
      updateModelNameAction(selectedOption);
      updateProjectDataAction({
        type: null,
        name: newProject,
      });
      updateImageDataAction([]);
      updateLabelNamesAction([]);
      navigate("/home");
      setNewProject("");
    } catch (error) {
      console.error("Error adding ListProject:", error);
    }
  };

  const handleDeleteListProject = async (project_name) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/project/delete/?username=${username}&project_name=${project_name}`
      );
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/deletefolder/?username=${username}&project_name=${project_name}`
      );
      const updatedList = ListProject.filter(
        (Project) => Project.project_name !== project_name
      );
      setListProject(updatedList);
      fetchListProject();
    } catch (error) {
      console.error("Error deleting ListProject:", error);
    }
  };

  // const handleGetImages = async (projectId) => {
  //   try{
  //     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/???/?username=${username}/?projectId=${projectId}`)
  //     setImageData(response.data.imageData)
  //   } catch(error) {
  //     console.error('Error getting Images:', error);
  //   }
  // }

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

  const handleSelectListProject = (project_name) => {
    try {
      console.log("ListProject:", ListProject);
      console.log("project_name:", project_name);
      const selected = ListProject.find(
        (Project) => Project.project_name === project_name
      );
      setSelectedProject(selected);
      console.log("Selected Project:", selected);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  } as DropzoneOptions);

  const loadImagesFromBackend = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("project_name", selectedProject.project_name);
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/getimage`,
      formData
    );
    return {
      imageUrls: response.data.image_urls,
      labels: response.data.labels,
    };
  };

  const startEditor2 = async (projectType: ProjectType) => {
    const { imageUrls, labels } = await loadImagesFromBackend();
    if (imageUrls.length > 0) {
      updateProjectDataAction({
        name: selectedProject.project_name,
        type: selectedProject.project_type,
      });
      updateActiveImageIndexAction(0);

      // Add unique label names to label names list
      const unique_label = uniq(labels.map((label) => label.annotations[0]));
      console.log("unique_label:", unique_label);
      const created_label = unique_label.map((label) =>
        LabelUtil.createLabelName(label)
      );
      console.log("Created Labels:", created_label);
      updateLabelNamesAction(
        // unique_label.map((label) => LabelUtil.createLabelName(label))
        created_label
      );

      const labelMap = new Map(
        created_label.map((label) => [label.name, label.id])
      );
      const labelarr = [];

      for (let i = 0; i < labels.length; i++) {
        const annotation = labels[i].annotations[0];
        const labelId = labelMap.get(annotation);

        if (labelId !== undefined) {
          labelarr.push(labelId);
        } else {
          console.log("not match");
        }
      }
      console.log("labelMap:", labelMap);
      console.log("labelarr:", labelarr);

      const ImageDataArr = [];
      for (let i = 0; i < imageUrls.length; i++) {
        const imgdata = ImageDataUtil.createImageDataFromFileDataWithLabel(
          imageUrls[i],
          labelarr[i]
        );
        ImageDataArr.push(imgdata);
      }
      console.log("ImageDataArr:", ImageDataArr);
      addImageDataAction(ImageDataArr);

      console.log("add image file success");
      // updateActivePopupTypeAction(PopupWindowType.INSERT_LABEL_NAMES);
    }
  };

  const startEditor = (projectType: ProjectType) => {
    if (acceptedFiles.length > 0) {
      const files = sortBy(acceptedFiles, (item: File) => item.name);
      updateProjectDataAction({
        name: selectedProject.project_name,
        type: selectedProject.project_type,
      });
      updateActiveImageIndexAction(0);
      addImageDataAction(
        files.map((file: File) =>
          ImageDataUtil.createImageDataFromFileData(file)
        )
      );
      // updateActivePopupTypeAction(PopupWindowType.INSERT_LABEL_NAMES);
    }
  };

  const handleOpenClick = async () => {
    if (selectedProject) {
      const isInListProject = ListProject.find(
        (project) => project.project_name === selectedProject.project_name
      );

      if (isInListProject) {
        console.log(
          "Selected Project:",
          selectedProject.project_name,
          " Type Project:",
          selectedProject.project_type
        );
        updateProjectNameAction(selectedProject.project_name);
        updateProjectDataAction({
          type: selectedProject.project_type,
          name: selectedProject.project_name,
        });
        updateImageDataAction([]);
        // getDropZoneContent();
        await startEditorWithImageRecognition2();
        // updateImageDataAction(imageData)
        navigate("/home");
      } else {
        console.error("Error: Selected project not found in ListProject");
      }
    }
  };

  const getDropZoneContent = () => {
    if (acceptedFiles.length === 0)
      return (
        <>
          <input {...getInputProps()} />
          <img draggable={false} alt={"upload"} src={"ico/box-opened.png"} />
          <p className="extraBold">Drop images</p>
          <p>or</p>
          <p className="extraBold">Click here to select them</p>
        </>
      );
    else if (acceptedFiles.length === 1)
      return (
        <>
          <img draggable={false} alt={"uploaded"} src={"ico/box-closed.png"} />
          <p className="extraBold">1 image loaded</p>
        </>
      );
    else
      return (
        <>
          <input {...getInputProps()} />
          <img
            draggable={false}
            key={1}
            alt={"uploaded"}
            src={"ico/box-closed.png"}
          />
          <p key={2} className="extraBold">
            {acceptedFiles.length} images loaded
          </p>
        </>
      );
  };

  const startEditorWithObjectDetection = () =>
    startEditor(ProjectType.OBJECT_DETECTION);
  const startEditorWithImageRecognition = () =>
    startEditor(ProjectType.IMAGE_RECOGNITION);
  const startEditorWithImageRecognition2 = () =>
    startEditor2(ProjectType.IMAGE_RECOGNITION);

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
              <div>
                <p style={{ color: "red" }}>Create Project failed.</p>
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
              {ListProject.length > 0 ? (
                ListProject.map((Project, index) => (
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
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                        }}
                        onClick={() =>
                          handleSelectListProject(Project.project_name)
                        }
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
                        onClick={() =>
                          handleDeleteListProject(Project.project_name)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No projects available</td>
                </tr>
              )}
            </tbody>
          </table>
          <div>
            <button className="button-1" onClick={handleOpenClick}>
              Open {selectedProject.project_name} Project
            </button>
            <button className="button-1" onClick={handleBackClick}>
              Back
            </button>
          </div>
        </div>
      )}

      {showDropZonePopup && (
        <div
          className="ImagesDropZone"
          style={{
            backgroundColor: "black",
          }}
        >
          <div {...getRootProps({ className: "DropZone" })}>
            {getDropZoneContent()}
          </div>
          <div className="DropZoneButtons">
            <button onClick={startEditorWithObjectDetection} />
            <button onClick={startEditorWithImageRecognition} />
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
  projectName: state.user.project_name,
  projectData: state.general.projectData,
  labelNames: state.labels.labels,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
