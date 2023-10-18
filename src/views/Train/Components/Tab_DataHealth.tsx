import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ImageData {
  src: string;
  type: string;
}

interface SizeImage {
  name: string;
  value: string;
}

const data = [
  { name: 'A', value: 2 },
  { name: 'B', value: 2 },
  { name: 'C', value: 2 },
  { name: 'D', value: 2 },
  { name: 'E', value: 4 },
];

const data_SizeImage: SizeImage[] = [
  { name: 'A', value: '400x300' },
  { name: 'B', value: '800x820' },
  { name: 'C', value: '800x820' },
  { name: 'D', value: '800x800' },
  { name: 'E', value: '1600x810' },
];

const classifySize = (data: SizeImage[]) => {
  const mediumSize: SizeImage[] = [];
  const largeSize: SizeImage[] = [];
  const jumboSize: SizeImage[] = [];

  data.forEach((item) => {
    const dimensions = item.value.split('x');
    const width = parseInt(dimensions[0], 10);
    const height = parseInt(dimensions[1], 10);

    if (width >= 1000 || height >= 1000) {
      jumboSize.push(item);
    } else if (width >= 400 || height >= 400) {
      largeSize.push(item);
    } else {
      mediumSize.push(item);
    }
  });

  return {
    medium: mediumSize,
    large: largeSize,
    jumbo: jumboSize,
  };
};


const findMostFrequentOrAverageRatio = (data: SizeImage[]) => {
  const ratioCount = {};
  data.forEach((item) => {
    if (item.value in ratioCount) {
      ratioCount[item.value]++;
    } else {
      ratioCount[item.value] = 1;
    }
  });

  let mostFrequentRatio = '';
  let maxCount = 0;

  for (const ratio in ratioCount) {
    if (ratioCount[ratio] > maxCount) {
      mostFrequentRatio = ratio;
      maxCount = ratioCount[ratio];
    }
  }

  if (mostFrequentRatio) {
    return mostFrequentRatio;
  } else {
    
    const totalWidth = data.reduce((total, item) => total + parseInt(item.value.split('x')[0], 10), 0);
    const totalHeight = data.reduce((total, item) => total + parseInt(item.value.split('x')[1], 10), 0);
    const averageWidth = totalWidth / data.length;
    const averageHeight = totalHeight / data.length;
    

    return `${averageWidth}x${averageHeight}`;
  }
};

const DataHealth: React.FC = () => {

  const classifiedSizes = classifySize(data_SizeImage);
  const mostFrequentOrAverageRatio = findMostFrequentOrAverageRatio(data_SizeImage);
  const imageCount = data_SizeImage.length;
  const annotationCount = data.reduce((total, item) => total + item.value, 0);
  const annotationsPerImage = annotationCount / imageCount;
  const classCount = data.length;


  const data_classifiedSizes= [
    { name: 'Medium', count: classifiedSizes.medium.length },
    { name: 'Large', count: classifiedSizes.large.length },
    { name: 'Jumbo', count: classifiedSizes.jumbo.length },
  ];
  return (
    <div>
      <div>
        <h2>Dataset Health Check</h2>
        <div className="Parameter" >
          <div  style={{ display: 'flex', justifyContent: 'space-between',padding: '0px' , marginBottom: '10px'}}>
            <div className="ParameterBox">
              <h4>images</h4>
              <h3>{imageCount}</h3>
              <h4>0 missing annotations</h4>
            </div>
            <div className="ParameterBox">
              <h4>Annotations</h4>
              <h3>{annotationCount}</h3>
              <h4>{annotationsPerImage} per image (average)</h4>
              <h4>across {classCount} classes</h4>
            </div>
            <div className="ParameterBox">
              <h4>Median Image Ratio</h4>
              <h3>{mostFrequentOrAverageRatio}</h3>
              <h4>square</h4>
            </div>
          </div>
          <div className="Parameter" style={{overflow : "auto" , marginBottom: '10px'}}>
            <h3>Class Balance</h3>
            <BarChart width={800} height={150} data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
          <div className="Parameter" style={{overflow : "auto" , marginBottom: '10px'}}>
            <h3>Dimension Insights</h3>
            <h4>Size Distribution</h4>
            <BarChart width={800} height={150} data={data_classifiedSizes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataHealth;
