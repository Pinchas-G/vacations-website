import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';
import interceptorsService from './Services/InterceptorsService';
import MainLayout from './Components/Layout/MainLayout/MainLayout';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:4000');

interceptorsService.createInterceptors();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </Provider>
  </React.StrictMode >
);