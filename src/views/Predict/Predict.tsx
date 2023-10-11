import React from 'react';
import ImageDropzone from './ImageDropzone';
import { useNavigate } from 'react-router-dom';
import './Predict.css';


const Predict: React.FC = () => {
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
        <div className="Home">
            <button onClick={() => navigate('/')}>Home</button>
        </div>
            <div className='Predict'><h2>Welcome to Predict Page </h2></div>
            <button onClick={handleSelectModelClick}>Select Existing Model</button>
            <h2>Current Model Name</h2>
            <div className="ImageDropzoneContainer">
            <ImageDropzone onUploadSuccess={handleUpload} />
            </div>
        </div>
  );
};

export default Predict;