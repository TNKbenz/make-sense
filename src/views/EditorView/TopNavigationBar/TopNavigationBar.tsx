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
  updateFetchingAction: (fetching: string) => any;
}

const TopNavigationBar: React.FC<IProps> = (props) => {
  const [isTrainButtonClicked, setTrainButtonClicked] = useState(false);
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setSelectionRange(0, event.target.value.length);
  };
  console.log("user :", ...props.username, "project :", ...props.project_name);

  // const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value.toLowerCase().replace(" ", "-");

  //   props.updateProjectDataAction({
  //     ...props.projectData,
  //     name: value,
  //   });
  // };
  const navigate = useNavigate();

  const closePopup = () =>
    // props.updateActivePopupTypeAction(PopupWindowType.EXIT_PROJECT);
    navigate("/");

  const TrainPage = async () => {
    if (isTrainButtonClicked) {
      return;
    }
    setTrainButtonClicked(true);
    props.updateActivePopupTypeAction(PopupWindowType.LOADING);
    const formData = new FormData();
    if (props.modeltype === "IMAGE_RECOGNITION") {
      props.updateFetchingAction("Preparing Data");
      const labels = [];
      for (let i = 0; i < props.imageData.length; i++) {
        let id = props.imageData[i]["labelNameIds"][0];
        if (
          LabelsSelector.getLabelNameById(id) === undefined ||
          LabelsSelector.getLabelNameById(id) === null
        ) {
          props.updateFetchingAction("");
          PopupActions.close();
          props.submitNewNotificationAction(
            NotificationUtil.createErrorNotification({
              header: "Missing Label",
              description:
                "All images must be labeled before proceed to training.",
            })
          );
          return;
        } else {
          let name = LabelsSelector.getLabelNameById(id)["name"];
          labels.push(name);
        }
      }
      props.imageData.forEach((fileInfo, index) => {
        const file = fileInfo.fileData;
        if (file instanceof File) {
          console.log("File(s) to save: ", file.name);
          formData.append("image_file", file);
        }
        formData.append("file_name", file.name);
      });
      formData.append("username", props.username);
      formData.append("project_name", props.project_name);
      labels.forEach((label, index) => {
        formData.append("labels", label);
      });
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      console.log("waiting for response");
      props.updateFetchingAction("Waiting for Response");
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/saveimage/`,
        formData
      );
      response
        .then((result) => {
          console.log(
            "Image(s) and label(s) saved successfully with response: ",
            result.data
          );
          setTrainButtonClicked(false);
          props.updateFetchingAction("Done");
          PopupActions.close();
          navigate("/train");
        })
        .catch((error) => {
          setTrainButtonClicked(false);
          props.updateFetchingAction("");
          PopupActions.close();
          console.error("Error saving image(s) and label(s):", error);
        });
    } else {
      // Object Detection
      props.updateFetchingAction("Loading Image(s) Data");
      await ImageDataUtil.loadMissingImages(props.imageData);
      props.updateFetchingAction("Converting to YOLO Format");
      const yololabels = RectLabelsExporter.YOLOLabelsdata();
      props.updateFetchingAction("Preparing Data");
      const labelobject = {};
      console.log("props.imageData.length", props.imageData.length);
      for (let i = 0; i < props.imageData.length; i++) {
        // Not all images are labeled
        if (props.imageData[i]["labelRects"].length === 0) {
          props.updateFetchingAction("");
          PopupActions.close();
          props.submitNewNotificationAction(
            NotificationUtil.createErrorNotification({
              header: "Missing Label",
              description:
                "All images must be labeled before proceed to training.",
            })
          );
          return;
        } else {
          labelobject[props.imageData[i].fileData.name] = yololabels[i];
        }
      }
      const cname = [];
      LabelsSelector.getLabelNames().forEach((name, index) => {
        cname.push(name.name);
      });
      formData.append("classnames", JSON.stringify(cname));
      formData.append("labels", JSON.stringify(labelobject));
      formData.append("username", props.username);
      formData.append("project_name", props.project_name);
      props.imageData.forEach((fileInfo, index) => {
        const file = fileInfo.fileData;
        if (file instanceof File) {
          console.log("File(s) to save: ", file.name);
          formData.append("image_file", file);
        }
      });
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      console.log("waiting for response");
      props.updateFetchingAction("Waiting for Response");
      const response = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/saveobject/`,
        formData
      );
      response
        .then((result) => {
          console.log(
            "Image(s) and label(s) saved successfully with response: ",
            result.data
          );
          setTrainButtonClicked(false);
          props.updateFetchingAction("Done");
          PopupActions.close();
          navigate("/train");
        })
        .catch((error) => {
          setTrainButtonClicked(false);
          props.updateFetchingAction("");
          PopupActions.close();
          console.error("Error saving image(s) and label(s):", error);
        });
      props.setObjectDataAction(null);
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
