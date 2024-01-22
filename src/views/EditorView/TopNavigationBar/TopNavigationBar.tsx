import React from "react";
import "./TopNavigationBar.scss";
import StateBar from "../StateBar/StateBar";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import {
  updateActivePopupType,
  updateProjectData,
} from "../../../store/general/actionCreators";
import TextInput from "../../Common/TextInput/TextInput";
import { ImageButton } from "../../Common/ImageButton/ImageButton";
import { Settings } from "../../../settings/Settings";
import { ProjectData } from "../../../store/general/types";
import DropDownMenu from "./DropDownMenu/DropDownMenu";
import { useNavigate } from "react-router-dom";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import axios from "axios";

interface IProps {
  updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
  updateProjectDataAction: (projectData: ProjectData) => any;
  projectData: ProjectData;
  imageData: ImageData[];
  modelname: string;
  username: string;
  project_name: string;
}

const TopNavigationBar: React.FC<IProps> = (props) => {
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setSelectionRange(0, event.target.value.length);
  };
  console.log("user :", ...props.username, "project :", ...props.project_name);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase().replace(" ", "-");

    props.updateProjectDataAction({
      ...props.projectData,
      name: value,
    });
  };

  const closePopup = () =>
    props.updateActivePopupTypeAction(PopupWindowType.EXIT_PROJECT);

  const navigate = useNavigate();
  const TrainPage = () => {
    const formData = new FormData();
    props.imageData.forEach((fileInfo, index) => {
      const file = fileInfo.fileData;
      formData.append("bytefiles", file);
    });
    formData.append("username", props.username);
    formData.append("project_name", props.project_name);

    const labels = [];
    for (let i = 0; i < props.imageData.length; i++) {
      let id = props.imageData[i]["labelNameIds"][0];
      let name = LabelsSelector.getLabelNameById(id)["name"];
      labels.push(name);
    }
    labels.forEach((label, index) => {
      formData.append("labels", label);
    });
    console.log(formData);
    const response = axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/saveimage/`,
      formData
    );
    navigate("/train");
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
            Make Sense
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
            onChange={onChange}
            onFocus={onFocus}
          />
        </div>
        <div className="NavigationBarGroupWrapper">
          <div className="Name" onClick={TrainPage}>
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
};

const mapStateToProps = (state: AppState) => ({
  projectData: state.general.projectData,
  username: state.user.username,
  imageData: state.labels.imagesData,
  modelname: state.user.modelname,
  project_name: state.user.project_name,
});

export default connect(mapStateToProps, mapDispatchToProps)(TopNavigationBar);
