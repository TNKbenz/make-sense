import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './Predict.css';
import { PieChart, Pie } from 'recharts';

interface ImageDropzoneProps {
  onUploadSuccess: (predictions: Predictions) => void;
}

type Predictions = {
  [key: string]: number;
};

const data = {
  "golden retriever": 0.8504292964935303,
  "Labrador retriever": 0.08213566243648529,
  "cocker spaniel": 0.01636691391468048,
  "kuvasz": 0.0071950675919651985,
  "Tibetan terrier": 0.005311739630997181
};

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f0e', '#d1300e'];

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Predictions | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Resize the image to 300x300 pixels
      const resizedImage = await resizeImage(file, 400,400);
      setSelectedFile(resizedImage);
      setSelectedFileUrl(URL.createObjectURL(resizedImage));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: 'image/*',
  });

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      
      axios
        .post('http://localhost:3001/upload', formData)
        .then((response) => {
          const receivedPredictions: Predictions = response.data.predictions;
          setPredictions(receivedPredictions);
          onUploadSuccess(receivedPredictions);
        })
        .catch((error) => {
          console.error('เกิดข้อผิดพลาดในการอัพโหลดไฟล์', error);
        });
    
        setPredictions(data)
    }
  };

  const resizeImage = async (file: File, maxWidth: number, maxHeight: number) => {
    return new Promise<File>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const width = img.width;
          const height = img.height;

          if (width <= maxWidth && height <= maxHeight) {
            resolve(file);
            return;
          }

          canvas.width = maxWidth;
          canvas.height = maxHeight;

          ctx.drawImage(img, 0, 0, maxWidth, maxHeight);

          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg');
        } else {
          resolve(file);
        }
      };
    });
  };

  return (
    <div>
      <div {...getRootProps()} className='image-dropzone'>
        <input {...getInputProps()} />
        <p className='Predict-image-dropzone'>Upload Image</p>
      </div>
      {selectedFile && (
        <div>
          <p></p>
          <img src={selectedFileUrl} alt='Selected' className='Selected-Image' />
          <p>ไฟล์ที่เลือก: {selectedFile.name}</p>
          <p>ประเภทไฟล์ที่เลือก: {selectedFile.type}</p>
          <button onClick={handleUpload}>Predict</button> 
        </div>
      )} 
      {predictions && (
      <div>
        <h2>คาดว่าเป็น: golden retriever {predictions["golden retriever"] * 100}%</h2>
        <div className='Chart' >
          <PieChart width={700} height={700}>
            <Pie
              data={Object.keys(data).map((key, index) => ({
                name: key,
                value: data[key],
                fill: colors[index % colors.length],
              }))}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={150}
              dataKey='value'
              label
            >
            </Pie>
          </PieChart>
        </div>
      </div>
    )}
    </div>
  );
};

export default ImageDropzone;
