import React, { useRef, useState } from "react";
import "./LoadImagesFolderPopup.scss";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import {
  addImageData,
  updateLabelNames,
} from "../../../store/labels/actionCreators";
import { GenericYesNoPopup } from "../GenericYesNoPopup/GenericYesNoPopup";
import { useDropzone } from "react-dropzone";
import { ImageData } from "../../../store/labels/types";
import { PopupActions } from "../../../logic/actions/PopupActions";
import { ImageDataUtil } from "../../../utils/ImageDataUtil";
import { LabelUtil } from "../../../utils/LabelUtil";
import { LabelName } from "../../../store/labels/types";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import { sortBy, uniq } from "lodash";
import { submitNewNotification } from "../../../store/notifications/actionCreators";
import { INotification } from "../../../store/notifications/types";
import { NotificationUtil } from "../../../utils/NotificationUtil";
import { NotificationsDataMap } from "../../../data/info/NotificationsData";
import { Notification } from "../../../data/enums/Notification";

interface IProps {
  addImageDataAction: (imageData: ImageData[]) => any;
  updateLabelNamesAction: (labelNames: LabelName[]) => any;
  submitNewNotificationAction: (notification: INotification) => any;
}

const LoadImagesFolderPopup: React.FC<IProps> = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [labelNames, setLabelNames] = useState(LabelsSelector.getLabelNames());
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);
    console.log("inputValue", inputValue);
  };

  const onAccept = () => {
    if (acceptedFiles.length > 0) {
      const files = sortBy(acceptedFiles, (item: File) => item.name);
      if (inputValue.trim().length > 0) {
        const newLabelNames = [
          ...labelNames,
          LabelUtil.createLabelName(inputValue),
        ];
        const uniqueLabelNames = uniq(
          newLabelNames.map((labelName: LabelName) => labelName.name)
        );
        if (uniqueLabelNames.length === newLabelNames.length) {
          const label_index = newLabelNames.length - 1;
          props.updateLabelNamesAction(newLabelNames);
          props.addImageDataAction(
            files.map((file: File) =>
              ImageDataUtil.createImageDataFromFileDataWithLabel(
                file,
                newLabelNames[label_index].id
              )
            )
          );
          PopupActions.close();
        } else {
          props.submitNewNotificationAction(
            NotificationUtil.createErrorNotification(
              NotificationsDataMap[Notification.NON_UNIQUE_LABEL_NAMES_ERROR]
            )
          );
          return;
        }
      } else {
        props.submitNewNotificationAction(
          NotificationUtil.createErrorNotification(
            NotificationsDataMap[Notification.EMPTY_LABEL_NAME_ERROR]
          )
        );
        return;
      }
    }
  };

  const onReject = () => {
    PopupActions.close();
  };

  const getDropZoneContent = () => {
    if (acceptedFiles.length === 0)
      return (
        <>
          <input {...getInputProps()} />
          <img draggable={false} alt={"upload"} src={"ico/box-opened.png"} />
          <p className="extraBold">Drop your image(s) here</p>
          <p>or</p>
          <p className="extraBold">Click here to select them</p>
        </>
      );
    else if (acceptedFiles.length === 1)
      return (
        <>
          <img draggable={false} alt={"uploaded"} src={"ico/box-closed.png"} />
          <p className="extraBold">1 new image loaded</p>
        </>
      );
    else
      return (
        <>
          <img
            draggable={false}
            key={1}
            alt={"uploaded"}
            src={"ico/box-closed.png"}
          />
          <p key={2} className="extraBold">
            {acceptedFiles.length} new images loaded
          </p>
        </>
      );
  };

  const renderContent = () => {
    return (
      <div className="LoadMoreImagesPopupContent">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          placeholder="Label Name for Uploaded Image(s)"
          className="TextInput"
        />
        <div {...getRootProps({ className: "DropZone" })}>
          {getDropZoneContent()}
        </div>
      </div>
    );
  };

  return (
    <GenericYesNoPopup
      title={"Import Images with Defined Label"}
      renderContent={renderContent}
      acceptLabel={"Load"}
      disableAcceptButton={acceptedFiles.length < 1}
      onAccept={onAccept}
      rejectLabel={"Cancel"}
      onReject={onReject}
    />
  );
};

const mapDispatchToProps = {
  addImageDataAction: addImageData,
  updateLabelNamesAction: updateLabelNames,
  submitNewNotificationAction: submitNewNotification,
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadImagesFolderPopup);
