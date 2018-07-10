import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './Redux/Store';
const ENV = require('./frontenv');
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={ENV.PUBLIC_URL}>
      <App/>
    </BrowserRouter>
  </Provider>
, document.getElementById('root'));

