import React, { useRef, useState, useEffect } from "react";
import "./LoadingPopup.scss";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import { PopupActions } from "../../../logic/actions/PopupActions";
import { Blocks } from "react-loader-spinner";
import ProgressBar from "@ramonak/react-progress-bar";
import { ProjectData } from "../../../store/general/types";

interface IProps {
  fetching: string;
  projectData: ProjectData;
}

const LoadingPopup: React.FC<IProps> = (props) => {
  const [progress, setProgress] = useState(0);
  const [barlabel, setBarlabel] = useState("");

  const updateProgress = () => {
    const { type } = props.projectData;
    const status = props.fetching;

    if (status === "") {
      setProgress(0);
      return;
    }

    setBarlabel(status);

    switch (type) {
      case "IMAGE_RECOGNITION":
        switch (status) {
          case "Preparing Data":
            setProgress(0);
            break;
          case "Waiting for Response":
            setProgress(50);
            break;
          case "Done":
            setProgress(100);
            break;
          default:
            setProgress(0);
        }
        break;
      default:
        switch (status) {
          case "Loading Image(s) Data":
            setProgress(0);
            break;
          case "Converting to YOLO Format":
            setProgress(25);
            break;
          case "Preparing Data":
            setProgress(50);
            break;
          case "Waiting for Response":
            setProgress(75);
            break;
          case "Done":
            setProgress(100);
            break;
          default:
            setProgress(0);
        }
    }
  };

  useEffect(() => {
    updateProgress();
  }, [props.fetching]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Blocks
        height="30%"
        width="30%"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        wrapperClass="blocks-wrapper"
        visible={true}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "70%",
            left: "50%",
            transform: "translate(-50%)",
          }}
        >
          <ProgressBar
            completed={progress}
            customLabel={barlabel}
            bgColor="#4fa94d"
            height="50px"
            width="100%"
            customLabelStyles={{
              position: "absolute",
              top: "70%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "16px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  fetching: state.general.fetching,
  projectData: state.general.projectData,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingPopup);
