import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import { store } from './store';
import './index.css';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8079';
let token = window.localStorage.getItem("iaas-token")

if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <BrowserRouter>
    <Provider store={store} >
       <App  />
    </Provider>
   
    </BrowserRouter>
  </React.StrictMode>
);

