import React from 'react';
import ImageDropzone from './ImageDropzone';
import { useNavigate } from 'react-router-dom';
import './predict.css';

const Predict: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectModelClick = () => {
    navigate('/home');
    window.location.reload();
  };

  const handleUpload = (imageUrl: string) => {
    console.log('อัพโหลดไฟล์สำเร็จ รูปภาพอยู่ที่:', imageUrl);
  };

  return (
    <div className="Predict">
      <div className="Home">
        <button onClick={() => navigate('/')}>Home</button>
      </div>
      <h2>Welcome to Predict Page</h2>
      <div className="Content">
        <button onClick={handleSelectModelClick}>Select Existing Model</button>
        <div className="ModelName">
          <h2>Current Model Name</h2>
        </div>
        <div className="ImageDropzoneContainer">
          <ImageDropzone onUploadSuccess={handleUpload} />
        </div>
      </div>
    </div>
  );
};

export default Predict;