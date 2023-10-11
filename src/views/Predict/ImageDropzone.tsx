import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface ImageDropzoneProps {
  onUploadSuccess: (imageUrl: string) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios
        .post('http://localhost:3001/upload', formData)
        .then((response) => {
          onUploadSuccess(response.data.imageUrl);
        })
        .catch((error) => {
          console.error('เกิดข้อผิดพลาดในการอัพโหลดไฟล์', error);
        });
    }
  };

  return (
    <div>
      <div {...getRootProps()} className="image-dropzone">
        <input {...getInputProps()} />
        <p>Upload Image</p>
        <p>ลากและวางไฟล์รูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
      </div>
      {selectedFile && (
        <div>
          <p>ไฟล์ที่เลือก: {selectedFile.name}</p>
          <button onClick={handleUpload}>Predict</button>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;

