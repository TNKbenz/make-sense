import React from 'react';
import ImageDropzone from './ImageDropzone';
import { useNavigate } from 'react-router-dom';
import './Predict.css';
import { AppState } from "src/store";
import { connect } from "react-redux";


interface PredictProps {
  username: string
  project_name: string
  modelname: string
}


const Predict: React.FC<PredictProps > = ({ username, project_name, modelname }) => {
  const navigate = useNavigate();

  const handleSelectModelClick = () => {
    navigate('/home');
    // window.location.reload();
  };

  const handleUpload = (imageUrl: string) => {
    console.log('อัพโหลดไฟล์สำเร็จ รูปภาพอยู่ที่:', imageUrl);
  };

  return (
    <div className="Predict">
      <div className="ButtonContainer">
        <button className="TrainButton" onClick={() => navigate('/')}>Home</button>
        <button className="TrainButton" onClick={() => navigate('/train')} >Train</button>
      </div>
      <div className='Predict'><h2>Welcome to Predict Page </h2></div>
      <button onClick={handleSelectModelClick}>Select Existing Model</button>
      <h2>Current Model {modelname}</h2>
      <div className="ImageDropzoneContainerWrapper">
        <div className="ImageDropzoneContainer">
          <ImageDropzone onUploadSuccess={handleUpload} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  username: state.user.username,
  project_name: state.user.project_name,
  modelname: state.user.modelname,
});

export default connect(mapStateToProps)(Predict);