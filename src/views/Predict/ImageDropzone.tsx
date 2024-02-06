import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Predict.css";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { AppState } from "src/store";
import { connect } from "react-redux";

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
  const [Results, setResults] = useState([]);
  const [modifiedResults, setmodifiedResults] = useState([]);
  const [maxValues, setmaxValues] = useState([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setResults([]);
    setmaxValues([]);
    if (acceptedFiles.length > 0) {
      if (activeLabelType === "IMAGE RECOGNITION"){
        const resizedImages = await Promise.all(
          acceptedFiles.map(async (file) => await resizeImage(file, 250, 250))
        );  

        setSelectedFiles(resizedImages);
        setSelectedFilesUrls(
        resizedImages.map((img) => URL.createObjectURL(img))
      );
      } else {
        const resizedImages = await Promise.all(
          acceptedFiles.map(async (file) => await resizeImage(file, 500, 500))
        );  

        setSelectedFiles(resizedImages);
        setSelectedFilesUrls(
        resizedImages.map((img) => URL.createObjectURL(img))
      );
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  const handleUpload = async () => {
    try {
      if (!modelname) {
        setShowErrorPopup(true);
        setTimeout(() => {
          setShowErrorPopup(false);
        }, 5000);
        return;
      }
  
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

      const convertedData = predictionsResults.map(item => {
        return {
          name: item.predicted_labels[0],
          value: item.probabilities[0],
        };
      });

      const modifiedData = convertedData.map(entry => ({
        ...entry,
        name: [entry.name.toString(), 'not ' + entry.name.toString()]
      }));

      const maxValues = convertedData.reduce((acc, obj) => {
        const maxVal = Math.max(...obj.value);
        acc.push(maxVal);
        return acc;
      }, []);
      
      const ChartData = modifiedData.map(item => [
        {
          name: item.name[0],
          value: item.value[1]
        },
        {
          name: item.name[1],
          value: item.value[0]
        }
      ]);


      setResults(convertedData);
      setmodifiedResults(ChartData);
      setmaxValues(maxValues)
      console.log("predictionsResults",ChartData)
      

    } catch (error) {
      console.error("Error uploading file:", error);
      const mockData = [
        {
          "boxes": [
            [
              154.1825714111328,
              7.5833868980407715,
              176.99964904785156,
              42.36884689331055
            ],
            [
              175.34991455078125,
              8.12913703918457,
              203.90542602539062,
              47.07293701171875
            ],
            [
              35.22364807128906,
              61.724979400634766,
              65.57614135742188,
              103.93618774414062
            ],
            [
              176.47796630859375,
              13.385398864746094,
              199.4116668701172,
              47.5186767578125
            ],
            [
              267.6794738769531,
              19.45416831970215,
              275.0,
              54.36579132080078
            ]
          ],
          "classes": [0.0, 1.0, 1.0, 1.0, 0.0],
          "path": "images12.jpg"
        }
      ];
      
      const predictionsData: Predictions = {
        // Assuming you want to display only the first set of predictions for simplicity
        boxes: receivedPredictions[0].boxes.map((box, boxIndex) => {
          const [x, y, width, height] = box;
          const coord = [x, y, width, height];
          const label = receivedPredictions[0].classes[boxIndex].toString();
          return { coord, label };
        }),
        path: receivedPredictions[0].path,
        options: {
          colors: {
            normal: "rgba(255, 225, 255, 1)",
            selected: "rgba(0, 225, 204, 1)",
            unselected: "rgba(100, 100, 100, 1)",
          },
          style: {
            maxWidth: "100%",
            maxHeight: "90vh",
          },
        },
      };
      setPredictions((prevPredictions) => [
        ...prevPredictions,
        predictionsData,
      ]);
      onUploadSuccess([predictionsData], index);
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
                  className={`image-preview_${
                    selectedFilesUrls.length > 2
                      ? 0
                      : selectedFilesUrls.length % 2
                  }`}
                >
                  <p></p>
                  <img
                    src={url}
                    alt={`Selected ${index + 1}`}
                    className="Selected-Image"
                  />
                  <p>
                    ไฟล์ที่เลือก:{" "}
                    {truncateFileName(selectedFiles[index].name, 30)}
                  </p>
                  <p>ประเภทไฟล์ที่เลือก: {selectedFiles[index].type}</p>
                  {Results.length > 0 && (
                    <div className="Predictions">
                      <h2>
                        คาดว่าเป็น: {Results[index].name}{" "}
                        {((maxValues[index]) * 100).toFixed(2) + "%"}
                      </h2>
                      <div className="Chart">
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart width={200} height={200}>
                            <Pie
                              dataKey="value"
                              isAnimationActive={false}
                              data={modifiedResults[index]}
                              cx="50%"
                              cy="50%"
                              innerRadius={0}
                              outerRadius={100}
                              fill={colors[index % colors.length]}
                              label={(entry) => entry.name[0] + ` ${(entry.value * 100).toFixed(3)}%`}
                            >     
                            </Pie>
                            <Tooltip formatter={(value) => value.toFixed(4)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {(selectedFilesUrls.length > 0 && activeLabelType === "OBJECT_DETECTION") && (
        <div className="image-preview-container">
          <div className="image-preview_1">
            {selectedFilesUrls.slice(0, 1).map((url,) => (
              <div key={0} style={{ position: 'relative' }}>
                <img
                  src={url}
                  alt={`Selected ${0}`}
                  className="Selected-Image_1"
                />
                {/* {predictions.length > 0 && (
                  <div className="bounding-box-container">
                    {predictions[0].boxes.map((box, boxIndex) => (
                      <div
                        key={boxIndex}
                        className="bounding-box"
                        style={{
                          left: `${box.coord[0]}%`,
                          top: `${box.coord[1]}%`,
                          width: `${box.coord[2] - box.coord[0]}%`,
                          height: `${box.coord[3] - box.coord[1]}%`,
                        }}
                      ></div>
                  ))}
                </div>
                )} */}
                <p>ไฟล์ที่เลือก: {truncateFileName(selectedFiles[0].name, 30)}</p>
                <p>ประเภทไฟล์ที่เลือก: {selectedFiles[0].type}</p>
              </div>
            ))}
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
