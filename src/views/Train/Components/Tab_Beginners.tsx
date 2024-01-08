import React, { FC, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { AppState } from "../../../store";
import { ImageData } from "../../../store/labels/types";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import { NotificationUtil } from "../../../utils/NotificationUtil";
import { submitNewNotification } from "../../../store/notifications/actionCreators";
import { INotification, NotificationsActionType } from "../../../store/notifications/types";

interface IProps {
  imageData: ImageData[];
  submitNewNotificationAction: (notification: INotification) => NotificationsActionType;
}

const Tab_Beginners: FC<IProps> = ({ imageData, submitNewNotificationAction }) => {
  const navigate = useNavigate();
  const [epoch, setEpoch] = useState<string>("");
  const [learningRate, setLearningRate] = useState<string>("");
  const labels = [];

  for (let i = 0; i < imageData.length; i++) {
    let id = imageData[i]["labelNameIds"][0];
    let name = LabelsSelector.getLabelNameById(id)["name"];
    labels.push(name);
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      imageData.forEach((fileInfo, index) => {
        const file = fileInfo.fileData;
        formData.append("bytefiles", file);
      });
      formData.append("epochs", epoch);
      formData.append("lr", learningRate);
      formData.append("username", "test1")
      formData.append("project_name", "project-test1")
      formData.append("modelname", "mt1")

      labels.forEach((label, index) => {
        formData.append("labels", label);
      });

      console.log(labels);
      console.log(formData);

      const response = await axios.post(
        "http://localhost:8000/train/",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    submitNewNotificationAction(NotificationUtil.createMessageNotification({
      "header": "train success",
      "description": "in model ... train successful"
    }))
    console.log("Data submitted");
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
          onClick={() => navigate("/predict")}
        >
          Create Model
        </button>
        <button
          className="button-14"
          role="button"
          onClick={() => navigate("/predict")}
        >
          Select Existing Model
        </button>
        <button
          className="button-14"
          role="button"
          onClick={() => navigate("/home")}
        >
          Add & label images
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
        <button onClick={handleSubmit}>Train</button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageData: state.labels.imagesData,
});

const mapDispatchToProps = {
  submitNewNotificationAction: submitNewNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Tab_Beginners);
