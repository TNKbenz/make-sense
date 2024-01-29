import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "./Predict.css";
import { PieChart, Pie, Tooltip } from "recharts";
import { AppState } from "src/store";
import { connect } from "react-redux";

interface ImageDropzoneProps {
  onUploadSuccess: (predictions: Predictions) => void;
  username: string;
  project_name: string;
  modelname: string;
}

type Predictions = {
  [key: string]: number;
};

type PredictionsResult = {
  predicted: List[number];
  predicted_labels: List[string];
  probabilities: List[List[number]];
};

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f0e", "#d1300e"];

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onUploadSuccess, username, project_name, modelname }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFilesUrls, setSelectedFilesUrls] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [prob, setProb] = useState<number | null>(null);
  const [predict_key, setPredict_key] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const resizedImages = await Promise.all(
        acceptedFiles.map(async (file) => await resizeImage(file, 250, 250))
      );

      setSelectedFiles(resizedImages);
      setSelectedFilesUrls(resizedImages.map((img) => URL.createObjectURL(img)));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  // const handleUpload = async () => {
  //   for (let i = 0; i < selectedFiles.length; i++) {
  //     const file = selectedFiles[i];
  //     const formData = new FormData();
  //     formData.append("bytefiles", file);
  //     formData.append("username", username);
  //     formData.append("project_name", project_name);
  //     formData.append("modelname", modelname);

  //     try {
  //       const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/uploadfile/`, formData);
  //       const receivedPredictions: PredictionsResult = response.data;

  //       setPredictions(receivedPredictions);
  //       onUploadSuccess(receivedPredictions);
  //       console.log("Receive prediction:", receivedPredictions);

  //       const Predict_Key: string = Object.keys(receivedPredictions.probabilities).reduce(
  //         (mostLikely, key) =>
  //           receivedPredictions[key] > receivedPredictions[mostLikely]
  //             ? key
  //             : mostLikely,
  //         Object.keys(receivedPredictions)[0]
  //       );

  //       setPredict_key(receivedPredictions.predicted_labels[0]);
  //       setProb(Math.max(...receivedPredictions.probabilities[0]));
  //       onUploadSuccess(Predict_Key);
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //     }
  //   }
  // };

  const handleUpload = async () => {
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append("bytefiles", file);
      formData.append("username", username);
      formData.append("project_name", project_name);
      formData.append("modelname", modelname);
  
      try {
        // สำหรับทดสอบเท่านั้น
        const mockPredictions: PredictionsResult = {
          predicted: [1, 2, 3],
          predicted_labels: ["Label 1", "Label 2", "Label 3"],
          probabilities: [[0.3, 0.4, 0.3]],
        };
        
        // แทนที่ axios.post ด้วยข้อมูล mock
        // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/uploadfile/`, formData);
        // const receivedPredictions: PredictionsResult = response.data;
  
        setPredictions(mockPredictions);
        onUploadSuccess(mockPredictions);
        console.log("Receive prediction:", mockPredictions);
  
        const Predict_Key: string = Object.keys(mockPredictions.probabilities).reduce(
          (mostLikely, key) =>
            mockPredictions[key] > mockPredictions[mostLikely]
              ? key
              : mostLikely,
          Object.keys(mockPredictions)[0]
        );
  
        setPredict_key(mockPredictions.predicted_labels[0]);
        setProb(Math.max(...mockPredictions.probabilities[0]));
        onUploadSuccess(Predict_Key);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
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

//   return (
//     <div>
//       <div {...getRootProps()} className="image-dropzone">
//         <input {...getInputProps()} />
//         <p className="Predict-image-dropzone">Upload Image</p>
//       </div>
//       {selectedFilesUrls.length > 0 && (
//         <div className="image-preview-container">
//           {selectedFilesUrls.map((url, index) => (
//             <div key={index} className={`image-preview_${selectedFilesUrls.length > 4 ? 0 : selectedFilesUrls.length % 4}`}>
//               <p></p>
//               <img src={url} alt={`Selected ${index + 1}`} className="Selected-Image" />
//               <p>ไฟล์ที่เลือก: {selectedFiles[index].name}</p>
//               <p>ประเภทไฟล์ที่เลือก: {selectedFiles[index].type}</p>

//               {predictions && (
//                 <div className="Predictions">
//                   <h2>
//                     คาดว่าเป็น: {predict_key} {prob * 100}%
//                   </h2>
//                   <div className="Chart">
//                     <PieChart width={250} height={250}>
//                       <Pie
//                         data={Object.keys(predictions).map((key, index) => ({
//                           name: key,
//                           value: predictions[key],
//                           fill: colors[index % colors.length],
//                         }))}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={25}
//                         outerRadius={50}
//                         dataKey="value"
//                         label={true}
//                       ></Pie>
//                       <Tooltip formatter={(value, name) => [value, name]} />
//                     </PieChart>
//                   </div>
//                 </div>
//               )}

//             </div>
//           ))}
//         </div>
//       )}
//       <div>
//         <button className="PredictButton" onClick={handleUpload}>Predict</button>
//       </div>
//     </div>
//   );
// };

  function truncateFileName(fileName: string, maxLength: number): string {
    return fileName.length > maxLength ? `${fileName.substring(0, maxLength)}...` : fileName;
  };
  
  return (
    <div>
      <div {...getRootProps()} className="image-dropzone">
        <input {...getInputProps()} />
        <p className="Predict-image-dropzone">Upload Image</p>
      </div>
      {selectedFilesUrls.length > 0 && (
        <div className="row">
          <div className="col-left">
            <div className="image-preview-container">
              {selectedFilesUrls.map((url, index) => (
                <div key={index} className={`image-preview_${selectedFilesUrls.length > 2 ? 0 : selectedFilesUrls.length % 2}`}>
                  <p></p>
                  <img src={url} alt={`Selected ${index + 1}`} className="Selected-Image" />
                  <p>ไฟล์ที่เลือก: {truncateFileName(selectedFiles[index].name, 30)}</p>
                  <p>ประเภทไฟล์ที่เลือก: {selectedFiles[index].type}</p>
                  <div className="col-right">
                    {predictions && (
                      <div className="Predictions">
                        <h2>
                          คาดว่าเป็น: {predict_key} {prob * 100}%
                        </h2>
                        <div className="Chart">
                          <PieChart width={250} height={250}>
                            <Pie
                              data={Object.keys(predictions).map((key, index) => ({
                                name: key,
                                value: predictions[key],
                                fill: colors[index % colors.length],
                              }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={25}
                              outerRadius={50}
                              dataKey="value"
                              label={true}
                            ></Pie>
                            <Tooltip formatter={(value, name) => [value, name]} />
                          </PieChart>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div>
        <button className="PredictButton" onClick={handleUpload}>Predict</button>
      </div>
    </div>
  );
}
const mapStateToProps = (state: AppState) => ({
  username: state.user.username,
  project_name: state.user.project_name,
  modelname: state.user.modelname,
});

export default connect(mapStateToProps)(ImageDropzone);
