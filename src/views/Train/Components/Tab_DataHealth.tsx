import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis,ZAxis, Tooltip, Legend, CartesianGrid ,LabelList,Cell ,ScatterChart,Scatter} from 'recharts';
import {LabelStatus} from "../../../data/enums/LabelStatus";
import {LabelType} from "../../../data/enums/LabelType";
import {ImageData, LabelPoint, LabelRect} from "../../../store/labels/types";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import { size } from 'lodash';


interface IProps {
  imageData: ImageData[];
  activeLabelType: LabelType;
  notice_update: string;
  username: string;
  project_name: string;
  modelname: string;
}

interface SizeImage {
  name: string;
  value: number;
}

const DataHealth: React.FC<IProps> = ({ imageData ,activeLabelType ,notice_update ,username ,project_name ,modelname }) => {
  const labels = [];
  imageData.forEach(item => {
    item.labelNameIds.forEach(id => {
      const name = LabelsSelector.getLabelNameById(id)?.name;
      if (name) {
        labels.push(name);
      }
    });
  });

  const data = [];
  const counts = new Map();
  labels.forEach(item => {
    if (counts.has(item)) {
      counts.set(item, counts.get(item) + 1);
    } else {
      counts.set(item, 1);
    }
  });
  counts.forEach((value, name) => {
    data.push({name,value});
  });

  const imageCount = imageData.length;
  const annotationCount = data.reduce((total, item) => total + item.value, 0);
  const annotationsPerImage = (annotationCount / imageCount).toFixed(2);;
  const classCount = data.length;

  const data_SizeImage = [];
  for (let i = 0; i < imageData.length; i++) {
    const size = imageData[i].fileData.size;

    data_SizeImage.push(size);
  }

  const classifySize = (data_SizeImage) => {
    const smallSize: SizeImage[] = [];
    const mediumSize: SizeImage[] = [];
    const largeSize: SizeImage[] = [];
    const jumboSize: SizeImage[] = [];
  
    data_SizeImage.forEach((item) => {
 
      if (item >= 1048576) { // 1024*1024
        jumboSize.push(item);
      } else if (item >= 262144) { // 512 * 512
        largeSize.push(item);
      } else if (item <= 20736) { // 144 * 144
        smallSize.push(item);
      } else {
        mediumSize.push(item);
      }
    });
  
    return {
      small: smallSize,
      medium: mediumSize,
      large: largeSize,
      jumbo: jumboSize,
    };
  };

  const data_Images = imageData.map(image => ({
    size: image.fileData.size,
    name: image.fileData.name,
    url: image.fileData.url,
  }));
  
  const classifiedSizes = classifySize(data_SizeImage);
  const data_classifiedSizes= [
    { name: 'Small', count: classifiedSizes.small.length },
    { name: 'Medium', count: classifiedSizes.medium.length },
    { name: 'Large', count: classifiedSizes.large.length },
    { name: 'Jumbo', count: classifiedSizes.jumbo.length },
  ];

  const [Cluster,setCluster] = useState(null);
  const handleGetCluster = async () => {
    try {
      let response;
      if (activeLabelType === "IMAGE RECOGNITION") {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cluster?username=${username}&project_name=${project_name}&model_name=${modelname}`
        );
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cluster?username=${username}&project_name=${project_name}&model_name=${modelname}`
        );
      }

      console.log("dataresponse.data",response.data)
      formatDataForScatterPlot(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [Unique,setUnique] = useState(null);
  const handleGetUnique = async () => {
    try {
      let response2;
      if (activeLabelType === "IMAGE RECOGNITION") {
        response2 = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cluster/unique?username=${username}&project_name=${project_name}&model_name=${modelname}`
        );
      } else {
        response2 = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/cluster/unique?username=${username}&project_name=${project_name}&model_name=${modelname}`
        );
      }

      setUnique(`${import.meta.env.VITE_BACKEND_URL}/cluster/unique?username=${username}&project_name=${project_name}&model_name=${modelname}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDataForScatterPlot = (data) => {
    console.log("data",data)
    if (data && data.xycoord) {
      const uniqueLabels = [...new Set(data.true_labels)]; 
      const uniqueTrueLabels = [...new Set(data.true_labels)]; 
      const colors = ['blue', 'red', 'green', 'orange', 'yellow']; 
      const shapes = ['star',"triangle","circle","diamond","cross"]
      const labelColors = {}; 
      const trueLabelShape = {};

      uniqueLabels.forEach((label, index) => {
        labelColors[label] = colors[index % colors.length]; 
      });

      uniqueTrueLabels.forEach((label, index) => {
        trueLabelShape[label] = shapes[index % shapes.length]; 
      });

      const uniqueData = [...new Set(data.true_labels)];
      const customPayload = uniqueData.map((item, index) => ({
        value: item,
        type: 'circle',
        color: colors[index % colors.length]
      }));
       
      return setCluster(data.xycoord.map((coord, index) => ({
        x: coord[0],
        y: coord[1],
        filename: data.filename[index],
        actual_label: data.actual_labels[index],
        true_label: data.true_labels[index],
        fill: labelColors[data.true_labels[index]], 
        shape: trueLabelShape[data.true_labels[index]], 
        legend: customPayload
      })));
    } else {
      return [];
    }
  };

  const shouldFetchData = notice_update === "train";
  useEffect(() => {
    handleGetCluster();
    handleGetUnique();
    console.log("data_Images",classifiedSizes);
  }, [modelname,shouldFetchData]);

  return (
    <div>
      <div>
        <h2>Dataset Health Check</h2>
        <div className="Parameter" >
          <div  style={{ display: 'flex', justifyContent: 'space-between',padding: '0px' , marginBottom: '10px'}}>
            <div className="ParameterBox">
              <h4>images</h4>
              <h3 style={{ color: 'rgb(136, 132, 216)' }}>{imageCount}</h3>
              {/* <h4>0 missing annotations</h4> */}
            </div>
            <div className="ParameterBox">
              <h4>Annotations</h4>
              <h3 style={{ color: 'rgb(136, 132, 216)' }}>{annotationCount}</h3>
              <h4><span style={{ color: 'rgb(136, 132, 216)' }}>{annotationsPerImage}</span> per image (average)</h4>
              <h4>across <span style={{ color: 'rgb(136, 132, 216)' }}>{classCount}</span> classes</h4>
            </div>
          </div>
          <div className="Parameter" style={{ overflow: "auto", marginBottom: '10px' }}>
            <h3>Class Balance</h3>
            <BarChart width={800} height={150} data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" interval={0} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
          <div className="Parameter" style={{ overflow: "auto", marginBottom: '10px' }}>
            <h3>Cluster Images</h3>
            <ScatterChart
              width={800}
              height={400}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="x" />
              <YAxis type="number" dataKey="y" name="y" />
              <ZAxis type="number" dataKey="true_label" name="true_label" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={({ payload }) => {
                  if(payload && payload[0]){
                    const entry = payload[0].payload;
                    return (
                      <div className="custom-tooltip">
                        <p><strong>Filename:</strong> {entry.filename}</p>
                        <p><strong>True Label:</strong> {entry.true_label}</p>
                        {/* <p><strong>X:</strong> {entry.x.toFixed(2)}</p>
                        <p><strong>Y:</strong> {entry.y.toFixed(2)}</p> */}
                        {entry.filename && <img src={entry.filename} alt="Preview" style={{ width: 'auto', height: 'auto' }} />}
                      </div>
                    );
                  }else{
                    return null;
                  }
                }}
              />
              {
                Cluster && Cluster.map((entry, index) => (
                  <Scatter name={entry.true_label} data={[entry]} key={`scatter-${index}`} fill={entry.fill}/>
                  
                ))
              }
              {
                Cluster && Cluster.map((entry, index) => (
                  <Legend payload={entry.legend}/>
                  
                ))
              }
            </ScatterChart>
          </div>
          <div className="Parameter" style={{ overflow: "auto", marginBottom: '10px' }}>
            <h3>Unique Images</h3>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {Unique && <img src={Unique} alt="Unique Image" style={{ width: "100%", height: "auto" }} />}
            </div>
          </div>
          {/* <div className="Parameter" style={{overflow : "auto" , marginBottom: '10px'}}> */}
            {/* <h3>Dimension Insights</h3>
            <h4>Size Distribution</h4>
            <BarChart width={800} height={150} data={data_classifiedSizes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" interval={0}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8">
                <LabelList dataKey="label" position="right" fill="#000" />
                <Cell fill="#FFFF00" />
                <Cell fill="#008000" />
                <Cell fill="#0000FF" />
                <Cell fill="#FF0000" />
              </Bar>
            </BarChart>
            <h5>
              ! Small: Less than 144 x 144,
              <span style={{ color: "#008000" }}> Medium: Less than 512 x 512,</span>
              <span style={{ color: "#0000FF" }}> Large: Greater than 512 x 512,</span>
              <span style={{ color: "#FF0000" }}> Jumbo: Greater than 1024 x 1024.</span>
            </h5>
            <ScatterChart
              width={800}
              height={400}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis dataKey="size" type="number" name="Image Size" />
              <YAxis dataKey="size" type="number" name="Image Size" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Image Size" data={data_Images} fill="#8884d8">
                {/* {imageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))} */}
              {/* </Scatter>
            </ScatterChart> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageData: state.labels.imagesData,
  username: state.user.username,
  modelname: state.user.modelname,
  project_name: state.user.project_name,
  activeLabelType: state.labels.activeLabelType,
  notice_update: state.user.notice_update,
});

export default connect(mapStateToProps)(DataHealth);