import React, { FC, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { AppState } from "../../../store";
import { ImageData } from "../../../store/labels/types";
import path from "path";

interface IProps {
  imageData: ImageData[];
}

const Tab_Beginners: FC<IProps> = ({ imageData }) => {
  const navigate = useNavigate();
  const [epoch, setEpoch] = useState<string>("");
  const [learningRate, setLearningRate] = useState<string>("");

  const handleSubmit = async () => {
    if(imageData.length > 0){
    const formData = new FormData();
    
    imageData.forEach((fileInfo, index) => {
      const file = fileInfo.fileData;
      formData.append(`file${index}`, file);
      console.log(file);
    });
    console.log(formData);
    console.log("Data submitted");
    try {
      const data = {
        epoch,
        lr: learningRate,
        formData,
      };
      console.log(data)
      const response = await axios.post("http://localhost:8000/train/", data);
      console.log(response.data);
      // Handle any other logic after a successful request, if needed.
    } catch (error) {
      // Handle errors, e.g., display an error message or log the error.
      console.error("Error:", error);
    }}
  };

  return (
    <Fragment>
      <div className="tabs-component" style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
        <button className="button-14" role="button" onClick={() => navigate("/predict")}>
          Create Model
        </button>
        <button className="button-14" role="button" onClick={() => navigate("/predict")}>
          Select Existing Model
        </button>
        <button className="button-14" role="button" onClick={() => navigate("/Home")}>
          Add & Label Image
        </button>
      </div>
      <div className="Parameter">
        <h3>Model tuning</h3>
        <div>Epoch</div>
        <input type="text" value={epoch} onChange={(e) => setEpoch(e.target.value)} />
        <div>Learning Rate</div>
        <input type="text" value={learningRate} onChange={(e) => setLearningRate(e.target.value)} />
        <button onClick={handleSubmit}>Train</button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageData: state.labels.imagesData,
});

export default connect(mapStateToProps)(Tab_Beginners);
