import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import configureStore from './configureStore';
import { Provider } from 'react-redux';
import { AppInitializer } from './logic/initializer/AppInitializer';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './views/Login/Login';
import Home from './views/Home/Home';
import Train from './views/Train/Train';
import Predict from './views/Predict/Predict';

export const store = configureStore();
AppInitializer.inti();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/home",
    element: <App/>
  },
  {
    path: "/train",
    element: <Train/>    
  },
  {
    path: "/predict",
    element: <Predict/>    // element: <App/> 
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') || document.createElement('div'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);

