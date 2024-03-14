import React, { useCallback, useState , useEffect} from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Predict.css";
import { PieChart, Pie, Tooltip, ResponsiveContainer ,Cell ,Legend,BarChart,XAxis,YAxis,Bar} from "recharts";
import { AppState } from "src/store";
import { connect } from "react-redux";
import ObjectDetectionVisualizer from "object-detection-visualizer";

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

const colors = ["#ADD8E6","#ffb6c1","#ff7f0e", "#d1300e","#8884d8","#82ca9d","#ffc658",
  "#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#4B0082", "#800080",
  "#FF4500", "#FF6347", "#FFD700", "#32CD32", "#00FFFF", "#4169E1", "#9932CC",
  "#FF69B4", "#FF7F50", "#FFA07A", "#ADFF2F", "#00FF7F", "#20B2AA", "#9370DB",
  "#FF8C00", "#FF1493", "#00BFFF", "#228B22", "#8A2BE2", "#8B0000", "#8FBC8F",
  "#FFC0CB", "#800000"
];

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
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [Results, setResults] = useState([]);
  const [modifiedResults, setmodifiedResults] = useState([]);
  const [maxValues, setmaxValues] = useState([]);
  const [ResultsObject, setResultsObject] = useState([]);
  const [CountResultsObject, setCountResultsObject] = useState([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setResultsObject([]);
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
          console.log("response.data",response.data)
          return response.data; 
        })
      );
      if (activeLabelType === "IMAGE RECOGNITION") {
        const convertedData = predictionsResults.map(item => {
          return {
            name: item.predicted_labels[0],
            value: item.probabilities[0],
            class: Object.keys(item.prob_with_classname[0]),
            class_value: item.prob_with_classname[0],
          };
        });

        const modifiedData = convertedData.map(entry => ({
          ...entry,
        }));

        const maxValues = convertedData.reduce((acc, obj) => {
          const maxVal = Math.max(...obj.value);
          acc.push(maxVal);
          return acc;
        }, []);

        const ChartData = modifiedData.map(item => {
          const data = item.class
            .filter(className => item.class_value[className] !== undefined)
            .map(className => ({
              name: className,
              value: item.class_value[className]
            }));
        
          return data;
        });

        setResults(convertedData);
        setmodifiedResults(ChartData);
        setmaxValues(maxValues)
      } 
      else {
        const classCounts = {};
        predictionsResults[0].forEach(item => {
            item.classes.forEach(classValue => {
                if (classCounts[classValue] === undefined) {
                    classCounts[classValue] = 1;
                } else {
                    classCounts[classValue]++;
                }
            });
        });
        const countText = Object.entries(classCounts).map(([cls, count]) => `${cls} : ${count}`).join(', ');
        console.log("classCounts",countText)
        setCountResultsObject(countText)
        setResultsObject(predictionsResults)
      }
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

  type BoundingBoxStyles={
    boudingBoxFill?:string;
    boudingBoxStroke?:string;
    boundingBoxOpacity?:number;
    boundingBoxTextColor?:string;
    boundingBoxTextFont?:string;
    boundingBoxTextPosition?:TextPosition,
    disableLabel?:boolean;
    disableStroke?:boolean;
    disableFill?:boolean;    
}

  type ObjectDetectionVisualizerProps={
    image:string;
    annotations:Annotation[];
    boundingBoxStyles?:BoundingBoxStyles;
  }

  type Annotation={
      label:string;
      coordinates:Coordinate;
  }

  type Coordinate={
      x:number;
      y:number;
      width:number;
      height:number;
  }

  enum TextPosition{
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
    Center
  }

  return (
    <div>
      <div {...getRootProps()} className="image-preview-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <input {...getInputProps()} />
          <img draggable={false} alt={"upload"} src={"ico/box-opened.png"} />
          <p className="extraBold">Click here to select your image(s)</p>
        </div>
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
                        <BarChart data={modifiedResults[index].sort((a, b) => b.value - a.value).slice(0, 5)} layout="vertical" >
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 12, width: 80}}/>
                          <XAxis type="number" scale="auto" domain={[0, 1]} />
                          <Tooltip formatter={(value) => value.toFixed(2)} />
                          <Bar dataKey="value" label={{ position: 'right', formatter: (value) => value.toFixed(2) }}>
                            {modifiedResults[index].slice(0, 5).map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                            ))}
                          </Bar>
                          <Legend
                            align="center"
                            verticalAlign="bottom"
                            layout="horizontal"
                            payload={modifiedResults[index].slice(0, 5).map((entry, index) => ({
                              value: entry.name,
                              type: 'square',
                              color: colors[index % colors.length]
                            }))}
                            formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
                          />
                        </BarChart>
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
      {(selectedFilesUrls.length > 0 && activeLabelType !== "IMAGE RECOGNITION") && (
        <div className="image-preview-container">
          <div className="image-preview_1">
            {selectedFilesUrls.slice(0, 1).map((url, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                {ResultsObject.length === 0 && (
                  <div>
                    <img
                      src={url}
                    />
                    <div>
                      <p>ไฟล์ที่เลือก: {truncateFileName(selectedFiles[0].name, 30)}</p>
                      <p>ประเภทไฟล์ที่เลือก: {selectedFiles[0].type}</p>
                    </div>
                  </div>
                )}
                {ResultsObject.length > 0 && (
                  <div>
                    <ObjectDetectionVisualizer
                      annotations={ResultsObject[0][index].boxes.map((box, idx) => ({
                        label: ResultsObject[0][index].classes[idx],
                        coordinates: {
                          x: (box[0] + box[2]) / 2,
                          y: (box[1] + box[3]) / 2,
                          width: box[2] - box[0],
                          height: box[3] - box[1],
                        },
                      }))}
                      image={url}
                      boundingBoxStyles={{
                        boundingBoxOpacity: 0.2,
                        boundingBoxStroke: "red",
                        boundingBoxTextColor: "black",
                        boundingBoxFill: "red",
                        boundingBoxTextFont: "18px Arial",
                        boundingBoxTextPosition: TextPosition.BottomRight,
                      }}
                    />
                    <div>
                      <p> Result [ {CountResultsObject} ]</p>
                    </div>
                  </div>
                )}
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
