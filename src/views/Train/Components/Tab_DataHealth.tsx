import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid ,LabelList,Cell} from 'recharts';
import {LabelStatus} from "../../../data/enums/LabelStatus";
import {LabelType} from "../../../data/enums/LabelType";
import {ImageData, LabelPoint, LabelRect} from "../../../store/labels/types";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";

interface IProps {
  imageData: ImageData[];
  activeLabelType: LabelType;
}

interface SizeImage {
  name: string;
  value: number;
}

const DataHealth: React.FC<IProps> = ({ imageData }) => {
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
  
  const classifiedSizes = classifySize(data_SizeImage);
  const data_classifiedSizes= [
    { name: 'Small', count: classifiedSizes.small.length },
    { name: 'Medium', count: classifiedSizes.medium.length },
    { name: 'Large', count: classifiedSizes.large.length },
    { name: 'Jumbo', count: classifiedSizes.jumbo.length },
  ];

  const findMostFrequentOrAverageRatio = (data_SizeImage) => {
    data_SizeImage.sort((a, b) => a - b);

    let medianSize;
    const middleIndex = Math.floor(data_SizeImage.length / 2);

    if (data_SizeImage.length % 2 === 0) {
      medianSize = (data_SizeImage[middleIndex - 1] + data_SizeImage[middleIndex]) / 2;
    } else {
      medianSize = data_SizeImage[middleIndex];
    }
    return medianSize
  };
   const mostFrequentOrAverageRatio = findMostFrequentOrAverageRatio(data_SizeImage);

  const colorStyle = {
    color:
      mostFrequentOrAverageRatio >= 1048576
        ? 'red'
        : mostFrequentOrAverageRatio >= 262144
        ? 'blue'
        : mostFrequentOrAverageRatio <= 20736
        ? 'yellow'
        : 'green',
  };
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
            <div className="ParameterBox">
              <h4>Median Image Size</h4>
              <h3 style={colorStyle} >{mostFrequentOrAverageRatio}</h3>
              <h4>square</h4>
            </div>
          </div>
          <div className="Parameter" style={{overflow : "auto" , marginBottom: '10px'}}>
            <h3>Class Balance</h3>
            <BarChart width={800} height={150} data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" interval={0}/>
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
          <div className="Parameter" style={{overflow : "auto" , marginBottom: '10px'}}>
            <h3>Dimension Insights</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  imageData: state.labels.imagesData,
  activeLabelType: state.labels.activeLabelType
});

export default connect(mapStateToProps)(DataHealth);