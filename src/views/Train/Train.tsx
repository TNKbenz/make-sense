import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Tabs from "./Components/Tabs";
// Tabs Components
import Tab_Visualize from "./Components/Tab_Visualize";
import Tab_DataHealth from "./Components/Tab_DataHealth";
import Tab_Compare from "./Components/Tab_Compare";
import NotificationsView from "../../views/NotificationsView/NotificationsView";
import { connectTab_Train as Tab_Train } from "./Components/Tab_Train";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AppState } from "../../store";
import { submitNewNotification } from "../../store/notifications/actionCreators";
import { connect } from "react-redux";
import {
  INotification,
  NotificationsActionType,
} from "../../store/notifications/types";
import { NotificationUtil } from "../../utils/NotificationUtil";

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
    Component: Tab_Train,
  },
  {
    label: "Visualize",
    index: 2,
    Component: Tab_Visualize,
  },
  {
    label: "Health Check",
    index: 3,
    Component: Tab_DataHealth,
  },
  {
    label: "Compare models",
    index: 4,
    Component: Tab_Compare,
  },
];

interface IProps {
  modelname: string;
  modeltype: string;
  username: string;
  project_name: string;
  submitNewNotificationAction: (
    notification: INotification
  ) => NotificationsActionType;
}

const Train: React.FC<IProps> = (props) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<number>(tabs[0].index);
  const WS_URL = `ws://${window.location.hostname}/ws/${props.username}_${props.project_name}`;
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    share: false,
    shouldReconnect: () => true,
  });
  console.log("websocket url:", WS_URL);

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed");
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        event: "subscribe",
        data: {
          channel: "general-chatroom",
        },
      });
    }
  }, [readyState]);

  useEffect(() => {
    console.log(lastMessage);
    if (lastMessage !== null) {
      props.submitNewNotificationAction(
        NotificationUtil.createSuccessNotification({
          header: "Training success",
          description: "trainig success",
        })
      );
    }
  }, [lastMessage]);

  return (
    <div className="Train">
      <div
        className="Home"
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/predict")}>Predict</button>
      </div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1>TRAIN MODEL</h1>
      </div>
      <br />
      <Tabs selectedTab={selectedTab} onClick={setSelectedTab} tabs={tabs} />
      <NotificationsView />
    </div>
  );
};

const mapDispatchToProps = {
  submitNewNotificationAction: submitNewNotification,
};

const mapStateToProps = (state: AppState) => ({
  projectData: state.general.projectData,
  username: state.user.username,
  imageData: state.labels.imagesData,
  modelname: state.user.modelname,
  modeltype: state.user.modeltype,
  project_name: state.user.project_name,
});

export default connect(mapStateToProps, mapDispatchToProps)(Train);
