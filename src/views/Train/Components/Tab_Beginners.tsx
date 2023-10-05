import React, { FC, Fragment ,useState} from "react";

const Tab_Beginners: FC<{}> = () => {
    const [epoch, setEpoch] = useState<string>("");
    const [learningRate, setLearningRate] = useState<string>("");
   
  return (
    <Fragment>
      <div className="Train">
        <button>Create Model</button>
        <button>Select Existing Model</button>
        
        </div>
        <div className="Parameter">
            <h3>Model tuning</h3>
            <div>Epoch</div>
            <input type="text" value={epoch} onChange={e => setEpoch(e.target.value)} />
            <div>Learning Rate</div>
            <input type="text" value={learningRate} onChange={e => setLearningRate(e.target.value)} />
        </div>
    </Fragment>
  );
};
export default Tab_Beginners;