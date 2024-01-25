import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Predict.css";
import { PieChart, Pie, Tooltip } from "recharts";
import { AppState } from "src/store";
import { connect } from "react-redux";

interface ImageDropzoneProps {
  onUploadSuccess: (predictions: Predictions) => void;
  username: string
  project_name: string
  modelname: string
}

type Predictions = {
  [key: string]: number;
};

type PredictionsResult = {
  predicted: List[number]
  predicted_labels: List[string]
  probabilities: List[List[number]]
};

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f0e", "#d1300e"];

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onUploadSuccess, username, project_name, modelname }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [prob, setProb] = useState<number | null>(null);
  const [predict_key, setPredict_key] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      const resizedImage = await resizeImage(file, 400, 400);
      setSelectedFile(resizedImage);
      setSelectedFileUrl(URL.createObjectURL(resizedImage));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("bytefiles", selectedFile);
      formData.append("username", username);
      formData.append("project_name", project_name);
      formData.append("modelname", modelname);

      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/uploadfile/`, formData)
        .then((response) => {
          const receivedPredictions: PredictionsResult = response.data;
          setPredictions(receivedPredictions);
          onUploadSuccess(receivedPredictions);
          console.log("recieve prediction:", receivedPredictions);

          const Predict_Key: string = Object.keys(receivedPredictions.probabilities).reduce(
            (mostLikely, key) =>
              receivedPredictions[key] > receivedPredictions[mostLikely]
                ? key
                : mostLikely,
            Object.keys(receivedPredictions)[0]
          );
          setPredict_key(receivedPredictions.predicted_labels[0]);
          setProb(Math.max(...receivedPredictions.probabilities[0]))
          onUploadSuccess(Predict_Key);
        })
        .catch((error) => {
          console.error("เกิดข้อผิดพลาดในการอัพโหลดไฟล์", error);
        });
    }
  };

  const resizeImage = async (
    file: File,
    maxWidth: number,
    maxHeight: number
  ) => {
    return new Promise<File>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

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
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              resolve(file);
            }
          }, "image/jpeg");
        } else {
          resolve(file);
        }
      };
    });
  };

  return (
    <div>
      <div {...getRootProps()} className="image-dropzone">
        <input {...getInputProps()} />
        <p className="Predict-image-dropzone">Upload Image</p>
      </div>
      {selectedFile && (
        <div>
          <p></p>
          <img
            src={selectedFileUrl}
            alt="Selected"
            className="Selected-Image"
          />
          <p>ไฟล์ที่เลือก: {selectedFile.name}</p>
          <p>ประเภทไฟล์ที่เลือก: {selectedFile.type}</p>
          <button onClick={handleUpload}>Predict</button>
        </div>
      )}
      {predictions && (
        <div>
          <h2>
            คาดว่าเป็น: {predict_key} {prob * 100}%
          </h2>
          <div className="Chart">
            <PieChart width={700} height={700}>
              <Pie
                data={Object.keys(predictions).map((key, index) => ({
                  name: key,
                  value: predictions[key],
                  fill: colors[index % colors.length],
                }))}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={150}
                dataKey="value"
                label={true}
              ></Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  username: state.user.username,
  project_name: state.user.project_name,
  modelname: state.user.modelname,
});

export default connect(mapStateToProps)(ImageDropzone);
