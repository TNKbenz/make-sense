import React, { PropsWithChildren, useState } from "react";
import "./ImagesDropZone.scss";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { TextButton } from "../../Common/TextButton/TextButton";
import { ImageData, LabelName } from "../../../store/labels/types";
import { connect, useDispatch } from "react-redux";
import {
  addImageData,
  updateImageData,
  updateActiveImageIndex,
  updateActiveLabelType,
  updateLabelNames,
  setObjectData,
} from "../../../store/labels/actionCreators";
import { AppState } from "../../../store";
import { ProjectType } from "../../../data/enums/ProjectType";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import {
  updateActivePopupType,
  updateProjectData,
} from "../../../store/general/actionCreators";
import { ProjectData } from "../../../store/general/types";
import { ImageDataUtil } from "../../../utils/ImageDataUtil";
import { create, sortBy, update } from "lodash";
import { LabelUtil } from "../../../utils/LabelUtil";
import { LabelType } from "../../../data/enums/LabelType";

interface IProps {
  updateActiveImageIndexAction: (activeImageIndex: number) => any;
  addImageDataAction: (imageData: ImageData[]) => any;
  updateImageDataAction: (imageData: ImageData[]) => any;
  updateLabelNamesAction: (labelNames: LabelName[]) => any;
  updateProjectDataAction: (projectData: ProjectData) => any;
  updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
  updateActiveLabelTypeAction: (activeLabelType: LabelType) => any;
  setObjectDataAction: (objectData: any) => any;
  modeltype: string;
  projectData: ProjectData;
}

const ImagesDropZone: React.FC<IProps> = (props: PropsWithChildren<IProps>) => {
  const [inputValue, setInputValue] = useState("");

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  } as DropzoneOptions);

  const startEditor = (projectType: ProjectType) => {
    if (acceptedFiles.length > 0) {
      props.setObjectDataAction(null);
      props.updateImageDataAction([]);
      props.updateLabelNamesAction([]);
      const files = sortBy(acceptedFiles, (item: File) => item.name);
      props.updateProjectDataAction({
        ...props.projectData,
        type: projectType,
      });
      props.updateActiveImageIndexAction(0);
      props.updateActiveLabelTypeAction(LabelType.IMAGE_RECOGNITION);
      if (inputValue.trim().length > 0) {
        const label = LabelUtil.createLabelName(inputValue);
        props.updateLabelNamesAction([label]);

        props.addImageDataAction(
          files.map((file: File) =>
            ImageDataUtil.createImageDataFromFileDataWithLabel(file, label.id)
          )
        );
      } else {
        props.addImageDataAction(
          files.map((file: File) =>
            ImageDataUtil.createImageDataFromFileData(file)
          )
        );
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

  const getContentFolder = (value: string) => {
    setInputValue(value);
    console.log(`Current Label: `, value);
  };

  return (
    <div className="ImagesDropZone">
      {props.modeltype === "IMAGE_RECOGNITION" && (
        <div className="DropZoneButtons_Top">
          <input
            className="TextInput"
            type="text"
            placeholder="Label Name for Uploaded Image(s) (Optional)"
            // disabled={!acceptedFiles.length}
            value={inputValue}
            onChange={(event) => getContentFolder(event.target.value)}
          />
        </div>
      )}
      <div {...getRootProps({ className: "DropZone" })}>
        {getDropZoneContent()}
      </div>
      {props.modeltype !== "IMAGE_RECOGNITION" && (
        <div className="DropZoneButtons">
          <TextButton
            label={"Object Detection"}
            isDisabled={
              !acceptedFiles.length || props.modeltype !== "OBJECT_DETECTION"
            }
            onClick={startEditorWithObjectDetection}
          />
          <TextButton
            label={"Image recognition"}
            isDisabled={
              !acceptedFiles.length || props.modeltype !== "IMAGE_RECOGNITION"
            }
            onClick={startEditorWithImageRecognition}
          />
        </div>
      )}
      {props.modeltype === "IMAGE_RECOGNITION" && (
        <div className="DropZoneButtons">
          <TextButton
            label={"Object Detection"}
            isDisabled={
              !acceptedFiles.length || props.modeltype !== "OBJECT_DETECTION"
            }
            onClick={startEditorWithObjectDetection}
          />
          <TextButton
            label={"Image recognition"}
            isDisabled={
              !acceptedFiles.length || props.modeltype !== "IMAGE_RECOGNITION"
            }
            onClick={startEditorWithImageRecognition}
          />
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  updateActiveImageIndexAction: updateActiveImageIndex,
  updateActiveLabelTypeAction: updateActiveLabelType,
  addImageDataAction: addImageData,
  updateImageDataAction: updateImageData,
  updateProjectDataAction: updateProjectData,
  updateActivePopupTypeAction: updateActivePopupType,
  updateLabelNamesAction: updateLabelNames,
  setObjectDataAction: setObjectData,
};

const mapStateToProps = (state: AppState) => ({
  projectData: state.general.projectData,
  modeltype: state.user.modeltype,
});

export default connect(mapStateToProps, mapDispatchToProps)(ImagesDropZone);
