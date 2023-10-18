import axios from "axios";
import React, { FC, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import { findLast } from "lodash";

const Tab_Beginners: FC<{}> = () => {
  const navigate = useNavigate();
  const [epoch, setEpoch] = useState<string>("");
  const [learningRate, setLearningRate] = useState<string>("");

  // const imageDatas = LabelsSelector.getImagesData();
  // console.log(imageDatas);
  // for (const imageData of imageDatas) {
  //   const labelNames = LabelsSelector.getLabelNames();
  //   let a = imageData.labelNameIds.map((labelNameId: string) => {
  //     return findLast(labelNames, { id: labelNameId }).name;
  //   });
  //   console.log(a);
  //   console.log(labelNames);
  // }

  //send training data to backend
  const handleSubmit = async () => {
    console.log("data submitted");
    // try {
    //   const data = {
    //     epoch,
    //     lr: learningRate,
    //   };
    //   const response = await axios.post("http://localhost:8000/train/", data);
    //   console.log(response.data);
    //   // Handle any other logic after a successful request, if needed.
    // } catch (error) {
    //   // Handle errors, e.g., display an error message or log the error.
    //   console.error("Error:", error);
    // }
  };

  return (
    <Fragment>
      <div className="Train">
        <button onClick={() => navigate("/predict")}>Create Model</button>
        <button onClick={() => navigate("/predict")}>
          Select Existing Model
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
export default Tab_Beginners;
