import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import Tabs from "./Components/Tabs";
// Tabs Components
import Tab_Beginners from "./Components/Tab_Beginners";
import Tab_Developers from "./Components/Tab_Developers";

type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];



// Tabs Array
const tabs: TabsType = [
  {
    label: "Tab Beginners",
    index: 1,
    Component: Tab_Beginners
  },
  {
    label: "Tab Developers",
    index: 2,
    Component: Tab_Developers
  }
];

export default function Train() {
  const navigate = useNavigate();  
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);

  return (
    
    <div className="Train">
      <div className="Home"><button onClick={() => navigate('/Home')}>Home</button></div>
      <h1>Project Name</h1>
      <br />
      <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
    </div>
  );
}
