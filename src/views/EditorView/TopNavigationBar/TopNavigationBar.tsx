import React, { useState } from "react";
import "./TopNavigationBar.scss";
import StateBar from "../StateBar/StateBar";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import {
  updateActivePopupType,
  updateProjectData,
  updateFetching,
} from "../../../store/general/actionCreators";
import { setObjectData } from "../../../store/labels/actionCreators";
import TextInput from "../../Common/TextInput/TextInput";
import { ImageButton } from "../../Common/ImageButton/ImageButton";
import { Settings } from "../../../settings/Settings";
import { ProjectData } from "../../../store/general/types";
import DropDownMenu from "./DropDownMenu/DropDownMenu";
import { useNavigate } from "react-router-dom";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import axios from "axios";
import { NotificationUtil } from "../../../utils/NotificationUtil";
import { submitNewNotification } from "../../../store/notifications/actionCreators";
import {
  INotification,
  NotificationsActionType,
} from "../../../store/notifications/types";
import { RectLabelsExporter } from "../../../logic/export/RectLabelsExporter";
import { ImageDataUtil } from "../../../../src/utils/ImageDataUtil";
import { ImageData } from "../../../store/labels/types";
import { PopupActions } from "../../../logic/actions/PopupActions";

interface IProps {
  updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
  updateProjectDataAction: (projectData: ProjectData) => any;
  projectData: ProjectData;
  imageData: ImageData[];
  modelname: string;
  modeltype: string;
  username: string;
  project_name: string;
  submitNewNotificationAction: (
    notification: INotification
  ) => NotificationsActionType;
  ImageDataUtil: ImageDataUtil;
  setObjectDataAction: (imagesData: ImageData[]) => any;
  updateFetchingAction: (fetching: string, progress: number) => any;
}

const TopNavigationBar: React.FC<IProps> = (props) => {
  const [isTrainButtonClicked, setTrainButtonClicked] = useState(false);
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setSelectionRange(0, event.target.value.length);
  };
  console.log("user :", ...props.username, "project :", ...props.project_name);

  const navigate = useNavigate();

  const closePopup = () => navigate("/");

  const SaveUsersImages = async () => {
    const imageForm = new FormData();
    const imageFiles = props.imageData
      .filter((fileInfo) => fileInfo.fileData instanceof File)
      .map((fileInfo) => fileInfo.fileData);

    const chunkSize = 1000;

    // Check if the number of image files is greater than the chunk size
    if (imageFiles.length > chunkSize) {
      props.updateFetchingAction("Saving Image(s) - Starting", 0);
      const totalChunks = Math.ceil(imageFiles.length / chunkSize);
      let completedChunks = 0;

      // Split the array of image files into chunks
      const chunks = [];
      for (let i = 0; i < imageFiles.length; i += chunkSize) {
        const chunk = imageFiles.slice(i, i + chunkSize);
        const chunkForm = new FormData();

        // Append the chunk of image files to the new FormData
        chunk.forEach((file, index) => {
          console.log("File to save in chunk: ", file.name);
          chunkForm.append(`image_file`, file);
        });

        // Append common data to the new FormData
        chunkForm.append("username", props.username);
        chunkForm.append("project_name", props.project_name);

        // Add the promise to the chunks array
        chunks.push(
          axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/saveimage/`, chunkForm)
            .then(() => {
              completedChunks++;
              const progressPercent = (completedChunks / totalChunks) * 70;
              props.updateFetchingAction(
                `Saving Image(s) - Chunk ${completedChunks}/${totalChunks}`,
                progressPercent
              );
            })
        );
      }

      // Execute all promises in parallel
      await Promise.all(chunks);
      console.log("All image chunks saved successfully");

      // Continue with label saving logic...
    } else {
      // If fewer than Chunksize, make a single request
      props.updateFetchingAction("Saving Image(s)", 0);
      imageFiles.forEach((file) => {
        console.log("File to save: ", file.name);
        imageForm.append("image_file", file);
      });

      // Append common data to the FormData
      imageForm.append("username", props.username);
      imageForm.append("project_name", props.project_name);

      // Make the request for the single chunk
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/saveimage/`,
        imageForm
      );
      response.then(() => {
        props.updateFetchingAction("Image(s) Saved", 70);
        console.log("Image(s) saved with response:", response.data);
      });
    }
  };

  const TrainPage = async () => {
    // Allow button to be clicked only once
    if (isTrainButtonClicked) {
      return;
    }
    setTrainButtonClicked(true);
    props.updateActivePopupTypeAction(PopupWindowType.LOADING);

    if (props.modeltype === "IMAGE_RECOGNITION") {
      // Check if all images are labeled
      for (let i = 0; i < props.imageData.length; i++) {
        if (props.imageData[i]["labelNameIds"].length === 0) {
          setTrainButtonClicked(false);
          PopupActions.close();
          props.submitNewNotificationAction(
            NotificationUtil.createErrorNotification({
              header: "Missing Label",
              description:
                "All images must be labeled before proceed to training.",
            })
          );
          return;
        }
      }
      await SaveUsersImages();
      const labels = [];
      const chunkSize = 1000; // Chunck size for saving image labels : can be configured
      const totalChunks = Math.ceil(props.imageData.length / chunkSize);
      let completedChunks = 0;

      // Create an array to store label saving promises
      const labelRequests = [];

      for (let i = 0; i < props.imageData.length; i += chunkSize) {
        const chunk = props.imageData.slice(i, i + chunkSize);
        const formData = new FormData();

        formData.append("username", props.username);
        formData.append("project_name", props.project_name);

        labels.length = 0; // Clear the labels array
        chunk.forEach((fileInfo) => {
          const file = fileInfo.fileData;
          formData.append("file_name", file.name);
          const id = fileInfo["labelNameIds"][0];
          const name =
            LabelsSelector.getLabelNameById(id) &&
            LabelsSelector.getLabelNameById(id)["name"];
          labels.push(name);
        });

        labels.forEach((label, index) => {
          formData.append("labels", label);
        });

        // Add the label saving promise to the array
        labelRequests.push(
          axios
            .post(
              `${import.meta.env.VITE_BACKEND_URL}/saveimagelabel/`,
              formData
            )
            .then(() => {
              completedChunks++;
              props.updateFetchingAction(
                `Saving Label(s) - Chunk ${completedChunks}/${totalChunks}`,
                70 + (completedChunks / totalChunks) * 30
              );
            })
        );
      }

      // Wait for all label saving promises to resolve
      await Promise.all(labelRequests);
      console.log("All labels saved successfully");
      setTrainButtonClicked(false);
      props.updateFetchingAction("Done", 100);
      setTimeout(() => {
        PopupActions.close();
        navigate("/train");
      }, 2000);
    } else {
      // TODO : Object Detection
      for (let i = 0; i < props.imageData.length; i++) {
        // Not all images are labeled
        if (props.imageData[i]["labelRects"].length === 0) {
          PopupActions.close();
          props.submitNewNotificationAction(
            NotificationUtil.createErrorNotification({
              header: "Missing Label",
              description:
                "All images must be labeled before proceed to training.",
            })
          );
          return;
        }
      }
      await SaveUsersImages();
      const cname = [];
      LabelsSelector.getLabelNames().forEach((name, index) => {
        cname.push(name.name);
      });
      const chunkSize = 200; // Chunk size for object label saving : can be configured
      const totalChunks = Math.ceil(props.imageData.length / chunkSize);
      let completedChunks = 0;

      // Create an array to store object label saving promises
      const labelRequests = [];

      for (let i = 0; i < props.imageData.length; i += chunkSize) {
        const chunk = props.imageData.slice(i, i + chunkSize);
        console.log("chunk", chunk);
        const formData = new FormData();
        await ImageDataUtil.loadMissingImages(chunk);
        const yololabels = RectLabelsExporter.YOLOLabelsdata(chunk);

        formData.append("classnames", JSON.stringify(cname));
        const labelobject = {};

        for (let j = 0; j < chunk.length; j++) {
          labelobject[chunk[j].fileData.name] = yololabels[j];
        }

        formData.append("labels", JSON.stringify(labelobject));
        formData.append("username", props.username);
        formData.append("project_name", props.project_name);

        // Add the object label saving promise to the array
        labelRequests.push(
          axios
            .post(
              `${import.meta.env.VITE_BACKEND_URL}/saveobjectlabel/`,
              formData
            )
            .then(() => {
              completedChunks++;
              props.updateFetchingAction(
                `Saving Object Label(s) - Chunk ${completedChunks}/${totalChunks}`,
                70 + (completedChunks / totalChunks) * 30
              );
            })
        );
      }

      // Wait for all object label saving promises to resolve
      await Promise.all(labelRequests);

      console.log("All labels saved successfully");
      setTrainButtonClicked(false);
      props.setObjectDataAction(null);
      props.updateFetchingAction("Done", 100);
      setTimeout(() => {
        PopupActions.close();
        navigate("/train");
      }, 2000);
    }
  };

  return (
    <div className="TopNavigationBar">
      <StateBar />
      <div className="TopNavigationBarWrapper">
        <div className="NavigationBarGroupWrapper">
          <div className="Header" onClick={closePopup}>
            <img
              draggable={false}
              alt={"make-sense"}
              src={"/make-sense-ico-transparent.png"}
            />
            Home Page
          </div>
        </div>
        <div className="NavigationBarGroupWrapper">
          <DropDownMenu />
        </div>
        <div className="NavigationBarGroupWrapper middle">
          <div className="ProjectName">Project Name:</div>
          <TextInput
            isPassword={false}
            value={props.projectData.name}
            // onChange={onChange}
            onFocus={onFocus}
          />
        </div>
        <div className="NavigationBarGroupWrapper">
          <div
            className={`Name ${isTrainButtonClicked ? "disabled" : ""}`}
            onClick={TrainPage}
          >
            Train
          </div>
        </div>
        <div className="NavigationBarGroupWrapper">
          <ImageButton
            image={"ico/github-logo.png"}
            imageAlt={"github-logo.png"}
            buttonSize={{ width: 30, height: 30 }}
            href={Settings.GITHUB_URL}
          />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  updateActivePopupTypeAction: updateActivePopupType,
  updateProjectDataAction: updateProjectData,
  submitNewNotificationAction: submitNewNotification,
  setObjectDataAction: setObjectData,
  updateFetchingAction: updateFetching,
};

const mapStateToProps = (state: AppState) => ({
  projectData: state.general.projectData,
  username: state.user.username,
  imageData: state.labels.imagesData,
  modelname: state.user.modelname,
  modeltype: state.user.modeltype,
  project_name: state.user.project_name,
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigationBar);
