import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import Tabs from "./Components/Tabs";
// Tabs Components
import Tab_Visualize from "./Components/Tab_Visualize";
import Tab_DataHealth from "./Components/Tab_DataHealth";
import NotificationsView from "../../views/NotificationsView/NotificationsView";
import { connectTab_Train as Tab_Train } from "./Components/Tab_Train";

type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];



// Tabs Array
const tabs: TabsType = [
  {
    label: "Tab Train",
    index: 1,
    Component: Tab_Train
  },
  {
    label: "Visualize",
    index: 2,
    Component: Tab_Visualize
  },
  {
    label: "Health Check",
    index: 3,
    Component: Tab_DataHealth
  }
];

export default function Train() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);

  return (

    <div className="Train">
      <div className="Home" style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/predict')}>Predict</button>
      </div>
      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}><h1>TRAIN MODEL</h1></div>
      <br />
      <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
      <NotificationsView />
    </div>
  );
}
