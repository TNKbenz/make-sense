import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid ,LabelList,Cell} from 'recharts';

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

const dataUrl = 'https://example.com/api/data'; 

const sizeImageUrl = 'https://example.com/api/sizeImage'; 

const fetchData = async () => {
  try {
    const response = await axios.get(dataUrl);
    const data: ImageData[] = response.data;

    const responseSizeImage = await axios.get(sizeImageUrl);
    const dataSizeImage: SizeImage[] = responseSizeImage.data; 

    console.log('ImageData:', data);
    console.log('SizeImage:', dataSizeImage);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();

const classifySize = (data: SizeImage[]) => {
  const smallSize: SizeImage[] = [];
  const mediumSize: SizeImage[] = [];
  const largeSize: SizeImage[] = [];
  const jumboSize: SizeImage[] = [];

  data.forEach((item) => {
    const dimensions = item.value.split('x');
    const width = parseInt(dimensions[0], 10);
    const height = parseInt(dimensions[1], 10);

    if (width * height >= 1048576) { // 1024*1024
      jumboSize.push(item);
    } else if (width * height >= 262144) { // 512 * 512
      largeSize.push(item);
    } else if (width * height <= 20736) { // 144 * 144
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
    { name: 'Small', count: classifiedSizes.small.length ,label: " < 144 x 144"},
    { name: 'Medium', count: classifiedSizes.medium.length ,label: "< 512 x 512"},
    { name: 'Large', count: classifiedSizes.large.length ,label: " > 512 x 512"},
    { name: 'Jumbo', count: classifiedSizes.jumbo.length ,label: " > 1024 x 1024"},
  ];
  return (
    <div>
      <div>
        <h2>Dataset Health Check</h2>
        <div className="Parameter" >
          <div  style={{ display: 'flex', justifyContent: 'space-between',padding: '0px' , marginBottom: '10px'}}>
            <div className="ParameterBox">
              <h4>images</h4>
              <h3 style={{ color: 'rgb(136, 132, 216)' }}>{imageCount}</h3>
              <h4>0 missing annotations</h4>
            </div>
            <div className="ParameterBox">
              <h4>Annotations</h4>
              <h3 style={{ color: 'rgb(136, 132, 216)' }}>{annotationCount}</h3>
              <h4><span style={{ color: 'rgb(136, 132, 216)' }}>{annotationsPerImage}</span> per image (average)</h4>
              <h4>across <span style={{ color: 'rgb(136, 132, 216)' }}>{classCount}</span> classes</h4>
            </div>
            <div className="ParameterBox">
              <h4>Median Image Ratio</h4>
              <h3 style={{ color: '#008000' }} >{mostFrequentOrAverageRatio}</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataHealth;
