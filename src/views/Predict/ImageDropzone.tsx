import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Predict.css";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { AppState } from "src/store";
import { connect } from "react-redux";
// import Boundingbox from "react-bounding-box";

// Assuming you have defined these types
interface ImageDropzoneProps {
  onUploadSuccess: (predictions: Predictions[], index: number) => void;
  username: string;
  project_name: string;
  modelname: string;
  modeltype: string;
  activeLabelType: string;
}

type Predictions = {
  name: string;
  value: number;
};

type PredictionsResult = {
  predicted: number[];
  predicted_labels: string[];
  probabilities: number[][];
};

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f0e", "#d1300e"];

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onUploadSuccess,
  username,
  project_name,
  modelname,
  modeltype,
  activeLabelType,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFilesUrls, setSelectedFilesUrls] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<Predictions[]>([]);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const resizedImages = await Promise.all(
        acceptedFiles.map(async (file) =>
          resizeImage(file, activeLabelType === "IMAGE RECOGNITION" ? 250 : 500, 500)
        )
      );

      setSelectedFiles(resizedImages);
      setSelectedFilesUrls(resizedImages.map((img) => URL.createObjectURL(img)));
    }
  }, [activeLabelType]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  const handleUpload = async () => {
    if (!modelname) {
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 5000);
      return;
    }

    try {
      const predictionsResults: PredictionsResult[] = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("bytefiles", file);
          formData.append("username", username);
          formData.append("project_name", project_name);
          formData.append("modelname", modelname);

          let response;
          if (activeLabelType === "IMAGE RECOGNITION") {
            response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/uploadfile/`,
              formData
            );
          } else {
            response = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/object/predict`,
              formData
            );
          }

          return response.data;
        })
      );

      setPredictions((prevPredictions) => {
        const newPredictions: any[] = [];

        predictionsResults.forEach((receivedPredictions, index) => {
          if (activeLabelType === "IMAGE RECOGNITION") {
            const predictionsData: Predictions = receivedPredictions.predicted_labels.map(
              (label, labelIndex) => ({
                name: label,
                value: receivedPredictions.probabilities[labelIndex][0],
              })
            );
            newPredictions.push(predictionsData);
            onUploadSuccess(predictionsData, index);
          } else {
            const predictionsData = receivedPredictions.map((prediction) => ({
              boxes: prediction.boxes.map((box, index) => {
                const [x, y, width, height] = box;
                const coord = [x, y, width, height];
                const label = prediction.classes[index].toString(); // Assuming you want the class as the label
                return { coord, label };
              }),
              path: prediction.path,
              options: {
                colors: {
                  normal: "rgba(255,225,255,1)",
                  selected: "rgba(0,225,204,1)",
                  unselected: "rgba(100,100,100,1)"
                },
                style: {
                  maxWidth: "100%",
                  maxHeight: "90vh"
                }
                // showLabels: false
              }
            }));
            newPredictions.push(predictionsData);
            onUploadSuccess(predictionsData, index);
          }
        });

        return prevPredictions.concat(newPredictions);
      });
    } catch (error) {
      console.error("Error uploading file:", error);
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

  function truncateFileName(fileName: string, maxLength: number): string {
    return fileName.length > maxLength
      ? `${fileName.substring(0, maxLength)}...`
      : fileName;
  }

  return (
    <div>
      <div {...getRootProps()} className="image-dropzone">
        <input {...getInputProps()} />
        <p className="Predict-image-dropzone">Upload Image</p>
      </div>
      {(selectedFilesUrls.length > 0 && activeLabelType === "IMAGE RECOGNITION") && (
        <div className="row">
          <div className="col-left">
            <div className="image-preview-container">
              {selectedFilesUrls.map((url, index) => (
                <div
                  key={index}
                  className={`image-preview_${selectedFilesUrls.length > 2 ? 0 : selectedFilesUrls.length % 2}`}
                >
                  <p></p>
                  <img src={url} alt={`Selected ${index + 1}`} className="Selected-Image" />
                  <p>ไฟล์ที่เลือก: {truncateFileName(selectedFiles[index].name, 30)}</p>
                  <p>ประเภทไฟล์ที่เลือก: {selectedFiles[index].type}</p>
                  {predictions.length > 0 && (
                    <div className="row">
                      {predictions.map((prediction, index) => (
                        <div
                          key={index}
                          className={`col-left image-preview_${predictions.length > 2 ? 0 : predictions.length % 2}`}
                        >
                          <div className="Predictions">
                            <h2>
                              คาดว่าเป็น: {prediction.name} {prediction.value * 100}%
                            </h2>
                            <div className="Chart">
                              <ResponsiveContainer width="100%" height={200}>
                                <PieChart width={200} height={200}>
                                  <Pie
                                    dataKey="value"
                                    isAnimationActive={true}
                                    data={prediction}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={100}
                                    fill={colors[index % colors.length]}
                                    label
                                  />
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {(selectedFilesUrls.length > 0 && activeLabelType === "OBJECT_DETECTION") && (
        <div className="row">
          <div className="col-left">
            <div className="image-preview-container">
              <div
                className={`image-preview_${selectedFilesUrls.length > 2 ? 0 : selectedFilesUrls.length % 2}`}
              >
                {selectedFilesUrls.slice(0, 1).map((url, index) => (
                  <div key={index}>
                    <Boundingbox image={url} boxes={predictions[index].boxes} options={predictions[index].options} />
                    <p>ไฟล์ที่เลือก: {truncateFileName(selectedFiles[index].name, 30)}</p>
                    <p>ประเภทไฟล์ที่เลือก: {selectedFiles[index].type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <button className="PredictButton" onClick={handleUpload}>
          Predict
        </button>
      </div>
      {showErrorPopup && (
        <div>
          <p style={{ color: "red" }}>please select model.</p>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  username: state.user.username,
  project_name: state.user.project_name,
  modelname: state.user.modelname,
  modeltype: state.user.modeltype,
  activeLabelType: state.labels.activeLabelType,
});

export default connect(mapStateToProps)(ImageDropzone);
